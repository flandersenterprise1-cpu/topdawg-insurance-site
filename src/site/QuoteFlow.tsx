import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LINE_COPY, linesIn, productOffered, stateFromZip, useAvailability, type LineId } from "./availability";
import { delivery, isPreview, routing, site, type TeamId } from "./config";
import { LINE_ICON } from "./StateFinder";
import { MedicareDisclaimer, quoteIntent } from "./ui";

/* Products offered under each line, and the team each request is routed to. */
export const PRODUCTS: { id: string; line: LineId; label: string; hint: string; team: TeamId; ask?: string }[] = [
  { id: "auto", line: "pc", label: "Auto", hint: "Cars, trucks and household drivers", team: "pc", ask: "How many vehicles and drivers?" },
  { id: "home", line: "pc", label: "Homeowners", hint: "The house you own and live in", team: "pc", ask: "Roughly what year was the home built?" },
  { id: "renters", line: "pc", label: "Renters or condo", hint: "Your belongings and liability", team: "pc" },
  { id: "trucking", line: "pc", label: "Trucking", hint: "Commercial auto, cargo and liability for trucking operations", team: "pc", ask: "How many trucks, and what do you haul?" },
  { id: "commercial-auto", line: "pc", label: "Commercial auto & fleet", hint: "Vehicles your business owns or uses, from one van to a fleet", team: "pc", ask: "How many vehicles, and what are they used for?" },
  { id: "food-truck", line: "pc", label: "Food truck & trailer", hint: "Liability, the truck or trailer, and equipment inside", team: "pc", ask: "Truck or trailer, and do you cook on board?" },
  { id: "builders-risk", line: "pc", label: "Builder’s risk", hint: "A building under construction or renovation", team: "pc", ask: "New construction or renovation, and the project value?" },
  { id: "commercial", line: "pc", label: "Commercial insurance", hint: "Commercial property, liability and specialty coverage", team: "pc", ask: "What does the business do, and what needs covering?" },
  { id: "business", line: "pc", label: "Business insurance", hint: "General liability, BOP and workers’ comp", team: "pc", ask: "What does your business do, and how many employees?" },
  { id: "life", line: "life", label: "Life insurance", hint: "Term or permanent coverage for your family", team: "life-health" },
  { id: "final-expense", line: "life", label: "Final expense", hint: "Smaller whole life policy for end-of-life costs", team: "life-health" },
  { id: "medicare", line: "health", label: "Medicare", hint: "Turning 65, or reviewing your current plan", team: "medicare", ask: "When does your Medicare start (or when did it)?" },
  { id: "health", line: "health", label: "Individual & family health", hint: "Coverage if you’re under 65", team: "life-health" },
  { id: "supplemental", line: "health", label: "Supplemental", hint: "Dental, vision, hospital indemnity", team: "life-health" },
];

export const CONSENT_TEXT =
  "By checking this box, I agree that Top Dawg Financial and its licensed agents may contact me at the phone number and email I provided about the coverage I requested, including by calls and text messages that may use automated technology or prerecorded voice. Consent is not a condition of purchase. Message and data rates may apply. I can opt out at any time by replying STOP or telling an agent.";

type Step = 1 | 2 | 3 | 4;

function leadId() {
  return "TD-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function deliver(payload: Record<string, unknown>): Promise<"sent" | "preview" | "unconfigured" | "failed"> {
  if (isPreview) return "preview";
  const jobs: Promise<boolean>[] = [];
  if (delivery.crmWebhook) {
    jobs.push(
      fetch(delivery.crmWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }
  if (delivery.web3formsKey) {
    const team = routing[payload.team as TeamId];
    jobs.push(
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: delivery.web3formsKey,
          subject: `Quote request · ${payload.product_label} · ${payload.state} · ${team.label}`,
          from_name: "Top Dawg Financial website",
          ...payload,
        }),
      })
        .then((r) => r.json())
        .then((d) => !!d.success)
        .catch(() => false),
    );
  }
  if (!jobs.length) return "unconfigured";
  const results = await Promise.all(jobs);
  return results.some(Boolean) ? "sent" : "failed";
}

export default function QuoteFlow() {
  const a = useAvailability();
  const [step, setStep] = useState<Step>(quoteIntent.state ? 2 : 1);
  const [zip, setZip] = useState("");
  const [state, setState] = useState(quoteIntent.state ?? "");
  const [locErr, setLocErr] = useState("");
  const [product, setProduct] = useState(quoteIntent.product ?? "");
  const [detail, setDetail] = useState("");
  const [f, setF] = useState({ first: "", last: "", phone: "", email: "", best: "Any time" });
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState(""); // hidden honeypot; people never see it
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ status: string; payload: Record<string, unknown> } | null>(null);

  const preferLine = quoteIntent.line;
  const offered = state ? linesIn(a, state) : [];
  const choices = useMemo(
    () =>
      PRODUCTS.filter((p) => productOffered(a, state, p.line, p.id)).sort(
        (x, y) => Number(y.line === preferLine) - Number(x.line === preferLine),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, a],
  );
  const chosen = PRODUCTS.find((p) => p.id === product);
  const sName = state ? a.states[state]?.name : "";

  const goStep2 = () => {
    let s = state;
    if (zip) {
      const z = stateFromZip(zip);
      if (!z) return setLocErr("That ZIP code doesn’t look right. Enter 5 digits, or choose your state.");
      s = z;
      setState(z);
    }
    if (!s) return setLocErr("Enter your ZIP code or choose your state.");
    setLocErr("");
    if (chosen && !productOffered(a, s, chosen.line, chosen.id)) setProduct("");
    setStep(2);
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!f.first.trim()) e.first = "Enter your first name.";
    if (!f.last.trim()) e.last = "Enter your last name.";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter an email address like name@example.com.";
    if (!consent) e.consent = "Check the box so a licensed agent can contact you, or call us instead.";
    setErrs(e);
    if (Object.keys(e).length || !chosen) return;
    setBusy(true);
    const now = new Date().toISOString();
    const payload = {
      lead_id: leadId(),
      submitted_at: now,
      lead_source: "website",
      source_page: "quote-request",
      product: chosen.id,
      product_label: chosen.label,
      line: chosen.line,
      state,
      zip: zip || null,
      team: chosen.team,
      route_to: routing[chosen.team].label,
      first_name: f.first.trim(),
      last_name: f.last.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      best_time: f.best,
      details: detail.trim() || null,
      contact_consent: true,
      consent_text: CONSENT_TEXT,
      consent_at: now,
      availability_version: a.updated,
      quote_type: "request (agent follow-up, no live carrier quote)",
      company_website: trap,
    };
    const status = await deliver(payload);
    setBusy(false);
    if (status === "failed" || status === "unconfigured") {
      setErrs({ form: "We couldn’t send your request. Please try again, or call us at " + site.phone + "." });
      if (status === "unconfigured") setErrs({ form: "Online requests aren’t switched on yet. Please call " + site.phone + "." });
      return;
    }
    setResult({ status, payload });
    setStep(4);
  };

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="quote-shell">
      <div className="quote-card">
        <div className="progress" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={step >= n ? "done" : ""} />
          ))}
        </div>

        {step === 1 && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              goStep2();
            }}
          >
            <div className="stack-sm">
              <span className="qstep-label">Step 1 of 3 · Location</span>
              <h2 className="display h2">Where do you live, or where is the business?</h2>
              <p className="lede">Insurance is licensed state by state, so we start here.</p>
            </div>
            <div className="form-grid two">
              <div className="field">
                <label htmlFor="q-zip">ZIP code</label>
                <input
                  id="q-zip"
                  className="input"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setZip(v);
                    const z = stateFromZip(v);
                    if (z) setState(z);
                  }}
                  placeholder="5 digits"
                />
              </div>
              <div className="field">
                <label htmlFor="q-state">State</label>
                <select id="q-state" className="select" value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="">Choose a state</option>
                  {Object.entries(a.states)
                    .sort((x, y) => x[1].name.localeCompare(y[1].name))
                    .map(([c, s]) => (
                      <option key={c} value={c}>{s.name}</option>
                    ))}
                </select>
              </div>
            </div>
            {locErr && <span className="err" role="alert">{locErr}</span>}
            <div className="q-actions">
              <span className="small" style={{ color: "var(--muted)" }}>Takes about two minutes.</span>
              <button type="submit" className="btn btn-dark">
                Continue <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="stack">
            <div className="stack-sm">
              <span className="qstep-label">Step 2 of 3 · Coverage in {sName}</span>
              <h2 className="display h2">What would you like covered?</h2>
            </div>
            {choices.length === 0 ? (
              <div className="stack-sm">
                <p className="lede">We aren’t licensed in {sName} yet, so we can’t quote coverage there. We’d rather say so now.</p>
                <div className="btn-row">
                  <button type="button" className="btn btn-line" onClick={() => setStep(1)}>Choose another state</button>
                  <Link href="/contact" className="btn btn-text">Contact us with a question</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="choice-grid two" role="group" aria-label="Coverage">
                  {choices.map((p) => {
                    const Icon = LINE_ICON[p.line];
                    return (
                      <button key={p.id} type="button" className="choice" aria-pressed={product === p.id} onClick={() => setProduct(p.id)}>
                        <span className="line-ico"><Icon aria-hidden="true" /></span>
                        <span>
                          <b>{p.label}</b>
                          <span>{p.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {offered.length < 3 && (
                  <p className="small" style={{ color: "var(--muted)", margin: 0 }}>
                    Only coverage we can write in {sName} is listed.
                  </p>
                )}
                <div className="q-actions">
                  <button type="button" className="btn btn-text" onClick={() => setStep(1)}>
                    <ArrowLeft aria-hidden="true" /> Change state
                  </button>
                  <button type="button" className="btn btn-dark" disabled={!chosen} onClick={() => setStep(3)}>
                    Continue <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && chosen && (
          <form
            className="stack"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="stack-sm">
              <span className="qstep-label">Step 3 of 3 · {chosen.label} in {sName}</span>
              <h2 className="display h2">Where should your agent reach you?</h2>
            </div>
            <div className="form-grid two">
              {(
                [
                  ["first", "First name", "given-name", "text"],
                  ["last", "Last name", "family-name", "text"],
                  ["phone", "Mobile phone", "tel", "tel"],
                  ["email", "Email", "email", "email"],
                ] as const
              ).map(([k, label, ac, type]) => (
                <div className="field" key={k}>
                  <label htmlFor={`q-${k}`}>{label}</label>
                  <input
                    id={`q-${k}`}
                    className="input"
                    type={type}
                    autoComplete={ac}
                    value={f[k]}
                    onChange={set(k)}
                    aria-invalid={errs[k] ? "true" : undefined}
                    aria-describedby={errs[k] ? `q-${k}-err` : undefined}
                  />
                  {errs[k] && <span id={`q-${k}-err`} className="err">{errs[k]}</span>}
                </div>
              ))}
              <div className="field">
                <label htmlFor="q-best">Best time to call</label>
                <select id="q-best" className="select" value={f.best} onChange={set("best")}>
                  <option>Any time</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="q-detail">{chosen.ask ?? "Anything we should know?"} <span style={{ fontWeight: 500, color: "var(--muted)" }}>(optional)</span></label>
                <input id="q-detail" className="input" value={detail} onChange={(e) => setDetail(e.target.value)} />
              </div>
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="q-company-website">Company website</label>
              <input id="q-company-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            <label className="consent" htmlFor="q-consent">
              <input id="q-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{CONSENT_TEXT} See our <Link href="/privacy">privacy notice</Link>.</span>
            </label>
            {errs.consent && <span className="err">{errs.consent}</span>}
            {errs.form && <span className="err" role="alert">{errs.form}</span>}
            <div className="q-actions">
              <button type="button" className="btn btn-text" onClick={() => setStep(2)}>
                <ArrowLeft aria-hidden="true" /> Back
              </button>
              <button type="submit" className="btn btn-gold" disabled={busy}>
                {busy ? "Sending…" : "Send my quote request"}
              </button>
            </div>
          </form>
        )}

        {step === 4 && result && chosen && (
          <div className="stack" role="status">
            <span className="line-ico" style={{ width: 56, height: 56 }}><Check aria-hidden="true" /></span>
            <h2 className="display h2">Thank you, {f.first}. Your request is with our {routing[chosen.team].label.toLowerCase()}.</h2>
            <p className="lede">
              A licensed agent will contact you about {chosen.label.toLowerCase()} in {sName}. This is a quote request, so nothing is bound and
              no coverage has started.
            </p>
            {result.status === "preview" && (
              <div className="stack-sm">
                <div className="draft-note">
                  Preview only: this request was not sent. On the live site it goes into Apex Flow CRM ({routing[chosen.team].pipeline}{" "}
                  pipeline), which alerts the {routing[chosen.team].label} right away, with the record below.
                </div>
                <pre className="payload">{JSON.stringify(result.payload, null, 2)}</pre>
              </div>
            )}
            <div className="btn-row">
              <Link href="/" className="btn btn-line">Back to home</Link>
            </div>
          </div>
        )}
      </div>

      <aside className="decl" aria-label="Your request summary">
        <div className="decl-head">
          <b>Request summary</b>
          <span>{result ? String(result.payload.lead_id) : "Top Dawg Financial"}</span>
        </div>
        <dl className="decl-rows" style={{ margin: 0 }}>
          {(
            [
              ["State", sName],
              ["ZIP", zip],
              ["Coverage", chosen?.label],
              ["Line", chosen ? LINE_COPY[chosen.line].long : ""],
              ["Handled by", chosen ? routing[chosen.team].label : ""],
              ["Type", "Quote request"],
            ] as [string, string | undefined][]
          ).map(([k, v]) => (
            <div className="decl-row" key={k}>
              <dt>{k}</dt>
              <i aria-hidden="true" />
              <dd className={v ? "" : "pending"}>{v || "—"}</dd>
            </div>
          ))}
        </dl>
        {chosen?.id === "medicare" && (
          <div style={{ padding: "0 20px 14px" }}>
            <MedicareDisclaimer className="disclaimer small" />
          </div>
        )}
        <div className="decl-foot">
          <span className="stamp">{step === 4 ? "Received" : "Not bound"}</span>
          <ol>
            <li>Your request goes to the licensed team for your state and coverage.</li>
            <li>An agent reviews it and contacts you by phone or email.</li>
            <li>We compare carriers we’re appointed with in your state and walk you through the options.</li>
            <li>Nothing is bound until you choose a policy and the carrier confirms it.</li>
          </ol>
          <p className="small" style={{ margin: 0, color: "var(--muted)" }}>
            Prefer to talk? Call <b style={{ color: "var(--ink)" }}>{site.phone}</b>
          </p>
        </div>
      </aside>
    </div>
  );
}
