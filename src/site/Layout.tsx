import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { Brand, BrandMark, EmailLink, QuoteButton, Tbc } from "./ui";
import { isClientPreview, isPreview, site } from "./config";
import { hasDraft, useAvailability } from "./availability";

const NAV = [
  { href: "/", label: "Main" },
  { href: "/home-insurance", label: "Home" },
  { href: "/auto", label: "Auto" },
  { href: "/business", label: "Business" },
  { href: "/life", label: "Life" },
  { href: "/health", label: "Health & Medicare" },
  { href: "/states", label: "States" },
  { href: "/about", label: "Our Family" },
  { href: "/contact", label: "Contact" },
];

function Header() {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [loc]);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Brand />
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={(n.href === "/" ? loc === "/" : loc.startsWith(n.href)) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-right">
          <span className="hdr-cta">
            <QuoteButton className="btn btn-metal btn-sm" label="Get a Quote" />
          </span>
        </div>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mnav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mnav" className="mnav" aria-label="Mobile">
          <div className="wrap">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
            <QuoteButton className="btn btn-metal btn-block" label="Get My Quote" />
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const lic = site.license;
  return (
    <footer className="ftr on-dark">
      <div className="wrap ftr-top">
        <div className="ftr-brand">
          <Brand />
          <p>An independent, family-run insurance agency for households and businesses in the states where we are licensed.</p>
        </div>
        <div>
          <h4>Coverage</h4>
          <ul>
            <li><Link href="/home-insurance">Home, renters &amp; condo</Link></li>
            <li><Link href="/auto">Auto insurance</Link></li>
            <li><Link href="/business">Business insurance</Link></li>
            <li><Link href="/life">Life &amp; final expense</Link></li>
            <li><Link href="/health">Health &amp; Medicare</Link></li>
          </ul>
        </div>
        <div>
          <h4>Agency</h4>
          <ul>
            <li><Link href="/about">Meet the family</Link></li>
            <li><Link href="/states">States we serve</Link></li>
            <li><Link href="/contact">Customer service</Link></li>
            <li><Link href="/licensing">Licensing</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Reach us</h4>
          <ul>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><EmailLink /></li>
            <li>By phone, or in person by appointment</li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr-legal">
        <p>
          <b>{site.brand}</b>
          {" · "}
          {site.legalName}, dba {site.dba}
          {" · "}
          <b>{lic.holder}</b>, {lic.jurisdiction} {lic.type} License No. {lic.number}
          {" · "}
          <Link href="/licensing" className="ftr-lic-link">Licensing information</Link>
          {!lic.holderOnRecordConfirmed && <> <Tbc>confirm the licensee name exactly as on the CDI record</Tbc></>}
        </p>
        <p>
          Insurance products are offered only in states where the agency and its producers are licensed and appointed. Not every product
          is available in every state. Coverage is subject to each carrier’s underwriting, policy terms, conditions and exclusions. A quote
          request does not bind or change coverage; coverage starts only when a carrier confirms it in writing.
        </p>
        <p>© {new Date().getFullYear()} {site.brand}. {site.legalName}, dba {site.dba}. Top Dawg. Top Tier.</p>
      </div>
    </footer>
  );
}

function PreviewBar({ mobile, setMobile }: { mobile: boolean; setMobile: (m: boolean) => void }) {
  const a = useAvailability();
  return (
    <div className="pbar" role="region" aria-label="Preview controls">
      <span>
        <b>{isClientPreview ? "DESIGN PREVIEW" : "PREVIEW"}</b> · for review only{hasDraft(a) ? " · state lists are drafts pending license verification" : ""}
      </span>
      <div className="pbar-group">
        <button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button>
        <button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile</button>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [loc]);
  const page = (
    <div className="site">
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
  if (!isPreview) return page;
  return (
    <>
      <PreviewBar mobile={mobile} setMobile={setMobile} />
      <div className={mobile ? "stage mobile" : "stage"}>{page}</div>
    </>
  );
}

export { BrandMark };
