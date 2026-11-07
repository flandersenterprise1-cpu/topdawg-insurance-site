import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Plus } from "lucide-react";
import { isPreview, site } from "./config";
import type { LineId } from "./availability";

/* ---------- brand ---------- */
export function BrandMark({ className = "brand-mark", tone = "emerald" }: { className?: string; tone?: "emerald" | "none" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      {tone === "emerald" && <rect width="64" height="64" rx="14" fill="#12322b" />}
      <g fill="none" stroke="#d1b06b" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M21.5 16.5 Q32 13 42.5 16.5 L50.5 9.5 L48 22 Q51.5 29 49 36 L50 44.5 Q49.5 53 40.5 54 L23.5 54 Q14.5 53 14 44.5 L15 36 Q12.5 29 16 22 L13.5 9.5 Z" />
        <path d="M29.5 22.5 Q32 24 34.5 22.5" />
        <path d="M22.5 29.5 L27 30.3 M41.5 29.5 L37 30.3" />
        <path d="M28.5 42 Q22.5 42.5 21.5 48.5 M35.5 42 Q41.5 42.5 42.5 48.5" />
        <path d="M32 43.6 V46.4 M27.5 48 Q32 50.6 36.5 48" />
      </g>
      <rect x="28.5" y="38.6" width="7" height="5" rx="2" fill="#d1b06b" />
    </svg>
  );
}

/** Gold crown-and-shield "TD" crest (from the client's approved mockup). */
export function Crest({ className = "crest" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" aria-hidden="true">
      <defs>
        <linearGradient id="crestGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e3a8" />
          <stop offset="0.45" stopColor="#d7ae5a" />
          <stop offset="0.55" stopColor="#b2873a" />
          <stop offset="1" stopColor="#e9c97d" />
        </linearGradient>
      </defs>
      <path d="M14 18 L18 6 L25 13 L32 3 L39 13 L46 6 L50 18 Z" fill="url(#crestGold)" />
      <circle cx="18" cy="5.5" r="2" fill="url(#crestGold)" />
      <circle cx="32" cy="2.5" r="2" fill="url(#crestGold)" />
      <circle cx="46" cy="5.5" r="2" fill="url(#crestGold)" />
      <path d="M6 22 H58 V46 C58 61 46 69 32 74 C18 69 6 61 6 46 Z" fill="none" stroke="url(#crestGold)" strokeWidth="3" />
      <path d="M11 26.5 H53 V46 C53 58 43.5 64.5 32 68.7 C20.5 64.5 11 58 11 46 Z" fill="none" stroke="url(#crestGold)" strokeWidth="1.2" />
      <text x="32" y="56" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="27" fill="url(#crestGold)" letterSpacing="-2">TD</text>
    </svg>
  );
}

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Top Dawg Insurance home">
      <Crest />
      <span className="brand-div" aria-hidden="true" />
      <span className="brand-word">
        <b>TOP DAWG</b>
        <span>Insurance</span>
      </span>
    </Link>
  );
}

/* ---------- page meta (title + description for SEO) ---------- */
export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", description);
  }, [title, description]);
}

/* ---------- "to confirm" marker: visible in preview, hidden on the live site ---------- */
export function Tbc({ children }: { children: ReactNode }) {
  if (!isPreview) return null;
  return <span className="tbc">{children}</span>;
}

/* ---------- quote prefill (survives navigation without query strings) ---------- */
export const quoteIntent: { line?: LineId; state?: string; product?: string } = {};

export function useStartQuote() {
  const [, go] = useLocation();
  return (intent: { line?: LineId; state?: string; product?: string } = {}) => {
    quoteIntent.line = intent.line;
    quoteIntent.state = intent.state;
    quoteIntent.product = intent.product;
    go("/quote");
  };
}

export function QuoteButton({
  line,
  state,
  product,
  label = "Get a Quote",
  className = "btn btn-gold",
}: {
  line?: LineId;
  state?: string;
  product?: string;
  label?: string;
  className?: string;
}) {
  const start = useStartQuote();
  return (
    <button type="button" className={className} onClick={() => start({ line, state, product })}>
      {label} <ArrowRight aria-hidden="true" />
    </button>
  );
}

/* ---------- layout pieces ---------- */
export function PageHero({ eyebrow, title, lede, crumb, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; crumb?: string; children?: ReactNode }) {
  return (
    <section className="phero on-dark">
      <BrandMark className="phero-mark" tone="none" />
      <div className="wrap">
        {crumb && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Main</Link> / {crumb}
          </nav>
        )}
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display h1">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function CtaBand({ title, line }: { title?: ReactNode; line?: LineId }) {
  return (
    <section className="cta-band on-dark">
      <div className="wrap cta-in">
        <div className="stack-sm">
          <span className="eyebrow">Ready when you are</span>
          <h2 className="display h2">{title ?? <>Tell us your state. We’ll take it from there.</>}</h2>
        </div>
        <div className="btn-row">
          <QuoteButton line={line} />
          <Link href="/contact" className="btn btn-line">
            Talk to Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>
            {it.q}
            <Plus aria-hidden="true" />
          </summary>
          <div className="ans">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

/** The contact email as a clickable mailto link. */
export function EmailLink({ className }: { className?: string }) {
  return (
    <a className={className ?? "email-link"} href={`mailto:${site.email}`}>
      {site.email}
    </a>
  );
}

/** CMS generic TPMO disclaimer (42 CFR 422.2267(e)(41)), used for website visitors who aren't identified yet. */
export const TPMO_DISCLAIMER =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

export function MedicareDisclaimer({ className = "disclaimer" }: { className?: string }) {
  return (
    <div className={className}>
      <p>{TPMO_DISCLAIMER}</p>
      <p>Not connected with or endorsed by the U.S. government or the federal Medicare program.</p>
    </div>
  );
}
