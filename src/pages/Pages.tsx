import { Link, useParams } from "wouter";
import { FileText, Mail, MapPin, Phone, RefreshCw, ShieldAlert, Wallet } from "lucide-react";
import familySm from "@/assets/family-880.jpg";
import StateFinder, { LINE_ICON } from "@/site/StateFinder";
import QuoteFlow from "@/site/QuoteFlow";
import { CtaBand, EmailLink, PageHero, QuoteButton, Tbc, useMeta } from "@/site/ui";
import { LINE_COPY, LINE_IDS, hasDraft, linesIn, statesFor, useAvailability } from "@/site/availability";
import { isPreview, routing, site } from "@/site/config";

/* ============================== ABOUT ============================== */
export function About() {
  useMeta(
    "Meet the Family Behind Top Dawg Financial | Malysha & Lindsay Flanders",
    "Top Dawg Financial is a family-run independent agency founded by Malysha and Lindsay Flanders. Meet the people behind the agency.",
  );
  return (
    <>
      <PageHero
        eyebrow="About Top Dawg"
        crumb="Our family"
        title={<>Family first. <em className="accent">Then everything else we protect.</em></>}
        lede="An independent agency built by Malysha and Lindsay for families and business owners."
      />
      <section className="sec">
        <div className="wrap family">
          <div className="family-photo">
            <img src={familySm} alt="Lindsay and Malysha Flanders with their three Cane Corsos" width={880} height={925} loading="lazy" />
          </div>
          <div className="family-copy">
            <span className="eyebrow">Meet the family behind Top Dawg</span>
            <h2 className="display h2">Protection starts with people.</h2>
            <div className="prose">
              <p>
                We’re Malysha and Lindsay, a family building a business around what matters most to us: looking out for the people we love.
                We know how much work goes into building a home, growing a business, and planning for the future. That’s why we take
                time to understand what matters to you, explain your options in plain language, and help you explore coverage
                available where you live.
              </p>
            </div>
            <div className="sig">
              <div><b>Malysha</b><span>Co-founder</span></div>
              <div><b>Lindsay</b><span>Co-founder</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec sec-dark on-dark">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What you can expect</span>
            <h2 className="display h2">How we work with every client.</h2>
          </div>
          <div className="steps">
            <div className="step"><h3 className="h3">Plain language</h3><p>We explain coverage, limits and exclusions in words that make sense, before you sign anything.</p></div>
            <div className="step"><h3 className="h3">Honest limits</h3><p>If we aren’t licensed in your state, or a carrier won’t write your risk, we tell you right away.</p></div>
            <div className="step"><h3 className="h3">Still here after the sale</h3><p>Policy changes, renewals and questions come back to the same agency that helped you buy.</p></div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ============================== STATES ============================== */
export function States() {
  const a = useAvailability();
  useMeta(
    "States We Serve | Top Dawg Financial",
    "See which states Top Dawg Financial serves for auto, home and business, life and final expense, and health and Medicare coverage.",
  );
  const served = statesFor(a);
  return (
    <>
      <PageHero
        eyebrow="States we serve"
        crumb="States"
        title={<>Licensed state by state. <em className="accent">Honest about each one.</em></>}
        lede="Insurance licenses are issued by each state and each line of coverage. Here’s exactly what we can help with, and where."
      />
      <section className="sec">
        <div className="wrap stack">
          {hasDraft(a) && (
            <div className="draft-note">
              Preview: these states come from the internal producer list and are marked draft. On the live site, only states marked “verified” in
              availability.json appear.
            </div>
          )}
          <StateFinder />
        </div>
      </section>
      <section className="sec sec-ivory">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">All states</span>
            <h2 className="display h2">Where we’re licensed to help.</h2>
          </div>
          <div className="state-index">
            {served.map((c) => (
              <Link key={c} href={`/states/${c.toLowerCase()}`} className="state-link">
                {a.states[c].name}
                <small>{linesIn(a, c).map((l) => (l === "pc" ? "P&C" : l === "life" ? "LIFE" : "HEALTH")).join(" · ")}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function StateDetail() {
  const a = useAvailability();
  const { code = "" } = useParams<{ code: string }>();
  const C = code.toUpperCase();
  const s = a.states[C];
  const lines = s ? linesIn(a, C) : [];
  useMeta(
    s ? `Insurance in ${s.name} | Top Dawg Financial` : "State not found | Top Dawg Financial",
    s ? `Coverage Top Dawg Financial can help with in ${s.name}: ${lines.map((l) => LINE_COPY[l].short).join(", ") || "none at this time"}.` : "",
  );
  if (!s) return <NotFound />;
  return (
    <>
      <PageHero
        eyebrow={`Insurance in ${s.name}`}
        crumb={s.name}
        title={lines.length ? <>Coverage we can help with in <em className="accent">{s.name}.</em></> : <>We aren’t licensed in {s.name} yet.</>}
        lede={lines.length ? `Licensed agents on our team can help ${s.name} households and businesses with the coverage below.` : "We only list states where we can actually help. Check back, or look up another state."}
      />
      <section className="sec">
        <div className="wrap two-col">
          <div className="stack">
            {lines.map((l) => {
              const Icon = LINE_ICON[l];
              return (
                <div key={l} className="contact-item" style={{ gap: 12 }}>
                  <span className="line-ico"><Icon aria-hidden="true" /></span>
                  <h2 className="h3">{LINE_COPY[l].short}</h2>
                  <p>{LINE_COPY[l].covers}.</p>
                  <p className="small">Handled by our {routing[a.lines[l].team].label}.</p>
                  <div><QuoteButton line={l} state={C} className="btn btn-dark" label={`Request a quote in ${s.name}`} /></div>
                </div>
              );
            })}
            {lines.length === 0 && <Link href="/states" className="btn btn-line">See states we serve</Link>}
          </div>
          <aside className="aside-card">
            <span className="eyebrow">Local details</span>
            {isPreview ? (
              <p>
                <Tbc>Publish this state page only once it has real local content:</Tbc> who on the team serves {s.name}, carriers appointed
                there, state-specific requirements (for example minimum auto limits), and a {s.name} review. Without that, keep the page
                unlisted (noindex) so it isn’t a thin page.
              </p>
            ) : (
              <p>Questions about coverage in {s.name}? Call {site.phone} or email <EmailLink />.</p>
            )}
            <p className="small">Not every carrier or product is available in every county. Coverage is subject to underwriting.</p>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ============================== CONTACT ============================== */
export function Contact() {
  useMeta(
    "Contact Top Dawg Financial | Customer Service",
    "Contact Top Dawg Financial for a quote, a policy change, billing help or help reporting a claim.",
  );
  return (
    <>
      <PageHero eyebrow="Contact & customer service" crumb="Contact" title={<>Talk to a person. <em className="accent">A licensed one.</em></>} lede={`New quote, policy change, billing question or a claim to report: call ${site.phone}, email us, or arrange an in-person appointment.`} />
      <section className="sec">
        <div className="wrap stack">
          <div className="contact-grid">
            <div className="contact-item">
              <Phone aria-hidden="true" />
              <span className="label">Call</span>
              <a className="v" href={site.phoneHref} style={{ textDecoration: "none" }}>{site.phone}</a>
              <p>Talk with a licensed member of our team.</p>
            </div>
            <div className="contact-item">
              <Mail aria-hidden="true" />
              <span className="label">Email</span>
              <EmailLink className="v email-link" />
              <p>Include your name, state and policy number if you have one.</p>
            </div>
            <div className="contact-item">
              <MapPin aria-hidden="true" />
              <span className="label">In person</span>
              <span className="v">By appointment</span>
              <p>Prefer to meet? Call us to arrange an in-person appointment.</p>
            </div>
          </div>
          <div className="btn-row"><QuoteButton /></div>
        </div>
      </section>
      <section className="sec sec-ivory">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Existing clients</span>
            <h2 className="display h2">How can we help with your policy?</h2>
          </div>
          <div className="svc-list">
            <div className="svc"><RefreshCw aria-hidden="true" color="var(--gold-ink)" /><h3 className="h3">Change a policy</h3><p>Add a driver or vehicle, update an address, change coverage. Email us the details; changes take effect only once the carrier confirms them.</p></div>
            <div className="svc"><Wallet aria-hidden="true" color="var(--gold-ink)" /><h3 className="h3">Billing &amp; payments</h3><p>Most premiums are billed and paid directly with your carrier. We’ll point you to the right payment portal or phone line.</p></div>
            <div className="svc"><ShieldAlert aria-hidden="true" color="var(--gold-ink)" /><h3 className="h3">Report a claim</h3><p>Call your carrier’s claim line first; it’s on your policy and ID card. Then let us know so we can help you through it.</p></div>
            <div className="svc"><FileText aria-hidden="true" color="var(--gold-ink)" /><h3 className="h3">Documents &amp; ID cards</h3><p>Need proof of insurance, a certificate or your declarations page? Email us and tell us where it needs to go.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================== QUOTE ============================== */
export function Quote() {
  useMeta("Request a Quote | Top Dawg Financial", "Request an insurance quote from Top Dawg Financial. Start with your state or ZIP code and a licensed agent will follow up.");
  return (
    <>
      <PageHero eyebrow="Quote request" crumb="Get a quote" title={<>Let’s find the right coverage.</>} lede="Three short steps. A licensed agent follows up with real options from carriers we’re appointed with in your state." />
      <section className="sec">
        <div className="wrap"><QuoteFlow /></div>
      </section>
    </>
  );
}

/* ============================== LICENSING ============================== */
export function Licensing() {
  const a = useAvailability();
  const lic = site.license;
  const pc = statesFor(a, "pc");
  const lifeStates = statesFor(a, "life");
  const healthStates = statesFor(a, "health");
  useMeta(
    "Licensing Information | Top Dawg Financial",
    `${site.brand} is operated by ${site.legalName}, dba ${site.dba}. ${lic.holder}, ${lic.jurisdiction} ${lic.type} License No. ${lic.number}.`,
  );
  return (
    <>
      <PageHero eyebrow="Legal" crumb="Licensing" title="Licensing information" lede="Who we are, how we’re licensed, and where you can check it yourself." />
      <section className="sec">
        <div className="wrap stack">
          <dl className="lic-grid">
            <div><dt>Business name</dt><dd>{site.brand}</dd></div>
            <div><dt>Registered DBA</dt><dd>{site.dba}</dd></div>
            <div><dt>Legal entity</dt><dd>{site.legalName}, doing business as {site.dba}</dd></div>
            <div>
              <dt>Licensee</dt>
              <dd>{lic.holder}{!lic.holderOnRecordConfirmed && <> <Tbc>confirm exact name on CDI record</Tbc></>}</dd>
            </div>
            <div><dt>License</dt><dd>{lic.jurisdiction} {lic.type}</dd></div>
            <div><dt>License number</dt><dd className="tabular">{lic.number}</dd></div>
            <div><dt>Issued by</dt><dd>{lic.issuer}</dd></div>
          </dl>
          <p className="prose" style={{ margin: 0 }}>
            You can check this license on the California Department of Insurance website:{" "}
            <a href={lic.lookupUrl} target="_blank" rel="noopener noreferrer">CDI license search</a>. Enter license number {lic.number}.
          </p>
          {pc.length > 0 && (
            <div className="stack-sm">
              <h2 className="h3">Property &amp; Casualty: states we serve</h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>{pc.map((c) => a.states[c].name).join(", ")}</p>
            </div>
          )}
          {lifeStates.length > 0 && (
            <div className="stack-sm">
              <h2 className="h3">Life: states we serve</h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>{lifeStates.map((c) => a.states[c].name).join(", ")}</p>
            </div>
          )}
          {healthStates.length > 0 && (
            <div className="stack-sm">
              <h2 className="h3">Health &amp; Medicare: states we serve</h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>{healthStates.map((c) => a.states[c].name).join(", ")}</p>
            </div>
          )}
          {hasDraft(a) && <div className="draft-note">Preview: Life and Health states shown here are still drafts and won’t appear on the live site until verified.</div>}
          <p className="small" style={{ margin: 0, color: "var(--muted)" }}>
            Questions about our licensing? Call {site.phone} or email <EmailLink />.
          </p>
        </div>
      </section>
    </>
  );
}

/* ============================== PRIVACY ============================== */
export function Privacy() {
  useMeta("Privacy Notice | Top Dawg Financial", "How Top Dawg Financial collects and uses information submitted through this website.");
  return (
    <>
      <PageHero eyebrow="Legal" crumb="Privacy" title="Privacy notice" />
      <section className="sec">
        <div className="wrap prose stack-sm">
          {isPreview && <div className="draft-note">Draft outline. Have counsel finalize this notice, including state privacy law and insurance privacy requirements, before launch.</div>}
          <p><strong>What we collect.</strong> When you request a quote or contact us, we collect what you enter: your name, phone, email, ZIP code or state, the coverage you’re interested in, and any details you add. We also record when you submitted it and whether you agreed to be contacted.</p>
          <p><strong>How we use it.</strong> To respond to your request, prepare quotes with insurance carriers we’re appointed with, service your policy, and meet legal and licensing requirements.</p>
          <p><strong>Who we share it with.</strong> Licensed members of our team, insurance carriers you ask us to quote with, and service providers that run our systems. We don’t sell your personal information.</p>
          <p><strong>Contact preferences.</strong> You can withdraw consent to calls or texts at any time by replying STOP, telling an agent, or emailing <EmailLink />.</p>
          <p><strong>Questions.</strong> Call {site.phone} or email <EmailLink />.</p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  useMeta("Page not found | Top Dawg Financial", "");
  return (
    <PageHero eyebrow="404" title="We couldn’t find that page." lede="It may have moved. Start from the home page or check your state.">
      <div className="btn-row">
        <Link href="/" className="btn btn-gold">Go home</Link>
        <Link href="/states" className="btn btn-line">Check your state</Link>
      </div>
    </PageHero>
  );
}

export { LINE_IDS };
