import { useState } from "react";
import { Link } from "wouter";
import { Briefcase, Car, Check, ChevronRight, Crown, HeartPulse, House, Store, Truck, Users } from "lucide-react";
import { hasDraft, isOffered, LINE_IDS, statesFor, useAvailability, type LineId } from "./availability";
import { useStartQuote } from "./ui";
import { isPreview } from "./config";

/* ---------- "What can we help you protect?" ---------- */
const CHOICES: { id: string; label: string; icon: typeof Car; line: LineId; product?: string }[] = [
  { id: "life", label: "Life", icon: Users, line: "life" },
  { id: "health", label: "Health", icon: HeartPulse, line: "health" },
  { id: "home", label: "Home", icon: House, line: "pc", product: "home" },
  { id: "auto", label: "Auto", icon: Car, line: "pc", product: "auto" },
  { id: "trucking", label: "Trucking", icon: Truck, line: "pc", product: "trucking" },
  { id: "commercial", label: "Commercial Insurance", icon: Store, line: "pc", product: "commercial" },
  { id: "business", label: "Business Insurance", icon: Briefcase, line: "pc", product: "business" },
];

export function ProtectPicker() {
  const [sel, setSel] = useState<string>("");
  const start = useStartQuote();
  const chosen = CHOICES.find((c) => c.id === sel);
  return (
    <div className="pick">
      <div className="pick-grid" role="radiogroup" aria-label="Coverage to protect">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={sel === c.id}
            className="pick-card"
            onClick={() => setSel(c.id)}
          >
            <c.icon className="pick-ico" aria-hidden="true" strokeWidth={1.6} />
            <span className="pick-label">{c.label}</span>
            <span className="pick-radio" aria-hidden="true">{sel === c.id && <Check strokeWidth={3} />}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-metal btn-block" onClick={() => start(chosen ? { line: chosen.line, product: chosen.product } : {})}>
        Build My Quote <ChevronRight aria-hidden="true" />
      </button>
      <p className="pick-note">Next we’ll ask for your state or ZIP, so we only show coverage we can write where you live.</p>
    </div>
  );
}

/* ---------- "Protection across multiple states" ---------- */
const ROWS: { key: LineId | "all"; label: string; icon: typeof Car }[] = [
  { key: "life", label: "Life", icon: Users },
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "pc", label: "Property & Casualty", icon: House },
  { key: "all", label: "All three lines", icon: Crown },
];

export function StatesChips() {
  const a = useAvailability();
  const listFor = (k: LineId | "all") =>
    k === "all" ? statesFor(a).filter((c) => LINE_IDS.every((l) => isOffered(a, c, l))) : statesFor(a, k);
  const byCode = (codes: string[]) => [...codes].sort();
  return (
    <section className="sstates on-dark" aria-labelledby="states-title">
      <div className="wrap">
        <h2 id="states-title" className="ruled-title display">Protection across multiple states</h2>
        <div className="srows">
          {ROWS.map((r) => {
            const codes = byCode(listFor(r.key));
            if (!codes.length && !isPreview) return null;
            return (
              <div className="srow" key={r.key}>
                <r.icon className="srow-ico" aria-hidden="true" strokeWidth={1.6} />
                <span className="srow-label">{r.label}</span>
                <ul className="chips-st" aria-label={`${r.label} states`}>
                  {codes.length ? (
                    codes.map((c) => (
                      <li key={c}>
                        <Link href={`/states/${c.toLowerCase()}`} title={a.states[c].name} aria-label={a.states[c].name}>
                          {c}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="none">Coming soon</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="sfoot">Availability varies by state, product and carrier.</p>
        {hasDraft(a) && (
          <p className="sfoot"><span className="tbc">Preview: draft state lists, hidden on the live site until each one is verified.</span></p>
        )}
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/states" className="btn btn-gold-line">Look up your state</Link>
        </div>
      </div>
    </section>
  );
}
