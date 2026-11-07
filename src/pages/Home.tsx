import { Link } from "wouter";
import { ArrowRight, Building2, Car, HeartHandshake, Phone, Stethoscope } from "lucide-react";
import { ProtectPicker, StatesChips } from "@/site/HomeBlocks";
import family from "@/assets/family.jpg";
import familySm from "@/assets/family-880.jpg";
import { CtaBand, EmailLink, Faq, QuoteButton, useMeta } from "@/site/ui";
import { isPreview, site } from "@/site/config";
import reviews from "../../public/data/reviews.json";

const LINES = [
  {
    href: "/personal",
    icon: Car,
    title: "Auto & Home",
    body: "Cars, homes, condos and renters coverage for the way your household actually lives.",
    tags: ["Auto", "Homeowners", "Renters", "Condo"],
  },
  {
    href: "/business",
    icon: Building2,
    title: "Business",
    body: "Liability, property and workers’ comp for owners who would rather be running the business.",
    tags: ["General liability", "BOP", "Workers’ comp"],
  },
  {
    href: "/life",
    icon: HeartHandshake,
    title: "Life & Final Expense",
    body: "Income replacement, a paid-off mortgage, or simply no bills left behind for the people you love.",
    tags: ["Term", "Whole life", "Final expense"],
  },
  {
    href: "/health",
    icon: Stethoscope,
    title: "Health & Medicare",
    body: "Medicare guidance at 65 and beyond, plus individual and supplemental coverage before then.",
    tags: ["Medicare", "Individual", "Supplemental"],
  },
];


export const HOME_FAQ = [
  {
    q: "Are you an insurance company?",
    a: (
      <p>
        No. Top Dawg Insurance is an independent agency. We’re licensed to sell insurance and appointed with several carriers, so we can
        compare options for you. Your policy is issued by the carrier you choose, and claims are paid by that carrier.
      </p>
    ),
  },
  {
    q: "Can you help me in my state?",
    a: (
      <p>
        It depends on the state and the type of coverage. Use the state finder above: it shows only the coverage we can write where you live.
        If we can’t help, we’ll say so up front.
      </p>
    ),
  },
  {
    q: "Is the online form an actual quote?",
    a: (
      <p>
        It’s a quote request. A licensed agent reviews what you send, gathers anything else the carriers need, and comes back with real
        options. Prices depend on each carrier’s underwriting, so we don’t post rates online.
      </p>
    ),
  },
  {
    q: "Does it cost anything to work with you?",
    a: (
      <p>
        Asking for a quote is free and you’re under no obligation to buy. Agents are typically paid a commission by the carrier when a policy
        is issued.
      </p>
    ),
  },
  {
    q: "I already have a policy. Can you review it?",
    a: (
      <p>
        Yes. Send us your current declarations page and we’ll walk through what it covers and where you might have gaps. Keep your current
        policy in force until a new one is confirmed in writing.
      </p>
    ),
  },
  {
    q: "How do I file a claim?",
    a: (
      <p>
        Report a claim directly to your insurance carrier using the number on your policy or ID card, as soon as you can. If you bought the
        policy through us, call or email us and we’ll help you find the right number and the information to have ready.
      </p>
    ),
  },
];

export default function Home() {
  useMeta(
    "Top Dawg Insurance | Protect Your Assets. Build Your Legacy.",
    "Top Dawg Insurance is an independent, family-run agency helping households and businesses with auto, home, business, life, health and Medicare coverage in the states where we’re licensed.",
  );
  return (
    <>
      <SignatureTop />
      <HomeLower />
    </>
  );
}

/** Signature design (client-approved, Nov 7). */
function SignatureTop() {
  return (
    <>
      <section className="mhero on-dark" aria-labelledby="hero-title">
        <div className="mhero-grid">
          <figure className="mhero-photo">
            <img
              src={family}
              srcSet={`${familySm} 880w, ${family} 1320w`}
              sizes="(min-width: 900px) 50vw, 52vw"
              alt="Malysha and Lindsay, founders of Top Dawg Insurance, with their three Cane Corsos"
              width={1320}
              height={1388}
              fetchPriority="high"
            />
          </figure>
          <div className="mhero-copy">
            <h1 id="hero-title" className="mhero-title">
              Protect your assets. <em>Build your legacy.</em>
            </h1>
            <span className="mhero-swash" aria-hidden="true" />
            <p className="mhero-sub">One trusted team for your family, health, home, vehicles and business.</p>
            <div className="mhero-btns">
              <QuoteButton className="btn btn-metal" label="Get My Quote" />
              <a className="btn btn-gold-line" href={site.phoneHref}>
                <Phone aria-hidden="true" /> Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
        <svg className="mhero-curve" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 L0 34 Q720 -10 1440 30 L1440 60 Z" fill="var(--emerald)" />
          <path d="M0 34 Q720 -10 1440 30" fill="none" stroke="url(#gline)" strokeWidth="3" />
          <defs>
            <linearGradient id="gline" x1="0" x2="1">
              <stop offset="0" stopColor="#8a6a2f" />
              <stop offset="0.5" stopColor="#f1d79a" />
              <stop offset="1" stopColor="#8a6a2f" />
            </linearGradient>
          </defs>
        </svg>
      </section>
      <div className="mstrip">
        <span>Personal</span><i aria-hidden="true">•</i><span>Commercial</span><i aria-hidden="true">•</i><span>Life &amp; Health</span>
      </div>

      <section className="protect" aria-labelledby="protect-title">
        <div className="wrap">
          <h2 id="protect-title" className="ruled-title display">What can we help you protect?</h2>
          <ProtectPicker />
        </div>
      </section>

      <StatesChips />

      <section className="sec built">
        <div className="wrap">
          <div className="built-head">
            <h2 className="display h2">Built around family.<br />Driven by protection.</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
        </div>
        <div className="wrap">
          <div className="family-solo">
            <span className="eyebrow">Meet the family behind Top Dawg</span>
            <h3 className="display h2">Protection starts with people.</h3>
            <blockquote className="family-quote">
              <p>
                “We’re Malysha and Lindsay, a family building a business around what matters most to us: looking out for the people we
                love. We know how much work goes into building a home, growing a business, and planning for the future. That’s why we
                take time to understand what matters to you, explain your options in plain language, and help you explore coverage
                available where you live.”
              </p>
            </blockquote>
          </div>
        </div>
      </section>

    </>
  );
}

/** Sections shared by every design. */
function HomeLower() {
  const PACK = [
    { href: "/personal", tag: "Auto, home & business", title: "Property", body: "Front and center, always on duty. Coverage for the house, the cars and the business you’ve built." },
    { href: "/life", tag: "Life & final expense", title: "Life", body: "Calm, patient and watching over the long run. Protection for the people who depend on you." },
    { href: "/health", tag: "Health & Medicare", title: "Health", body: "Never far from your side. Medicare guidance and health coverage at every stage of life." },
  ];

  const approved = (reviews as { name: string; place: string; text: string; approved: boolean }[]).filter((r) => r.approved);

  return (
    <>
      <section className="sec sec-ivory">
        <div className="wrap">
          <div className="sec-head split">
            <div className="stack-sm">
              <span className="eyebrow">What we cover</span>
              <h2 className="display h2">One agency for the house, the car, the business and the people in it.</h2>
            </div>
            <p className="lede">Four kinds of coverage, explained in plain language and handled by licensed agents who know the products.</p>
          </div>
          <div className="lines">
            {LINES.map((l) => (
              <Link key={l.href} href={l.href} className="line-card">
                <span className="line-ico"><l.icon aria-hidden="true" /></span>
                <h3 className="h3">{l.title}</h3>
                <p>{l.body}</p>
                <ul>{l.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="go">Learn more <ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-char on-dark">
        <div className="wrap">
          <div className="pack-intro">
            <div className="stack-sm">
              <span className="eyebrow">Meet the pack</span>
              <h2 className="display h2">
                Every family needs a protector. <em className="accent">Ours has three.</em>
              </h2>
            </div>
            <p className="lede">
              The dogs in our portrait gave the agency its name. Each one stands for a line of protection we offer, and the same loyal
              instinct behind it.
            </p>
          </div>
          <div className="pack">
            {PACK.map((p) => (
              <Link key={p.href} href={p.href} className="pup">
                <span className="pup-tag">{p.tag}</span>
                <div className="pup-body">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <span className="go">Explore {p.title.toLowerCase()} <ArrowRight aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-dark on-dark">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2 className="display h2">Three steps, and a real person at each one.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <h3 className="h3">Tell us where and what</h3>
              <p>Your state or ZIP first, then the coverage you need. It takes about two minutes on your phone.</p>
            </div>
            <div className="step">
              <h3 className="h3">A licensed agent compares options</h3>
              <p>Your request goes to the team licensed for your state and line. They shop the carriers we’re appointed with.</p>
            </div>
            <div className="step">
              <h3 className="h3">You decide, with the details in front of you</h3>
              <p>We explain the coverage, the deductibles and the trade-offs. Nothing is bound until you say yes and the carrier confirms.</p>
            </div>
          </div>
        </div>
      </section>


      {approved.length > 0 ? (
        <section className="sec sec-ivory">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">From our clients</span>
              <h2 className="display h2">In their words.</h2>
            </div>
            <div className="reviews">
              {approved.slice(0, 3).map((r) => (
                <figure className="review" key={r.name} style={{ margin: 0, borderStyle: "solid" }}>
                  <span className="stars" aria-hidden="true">★★★★★</span>
                  <blockquote style={{ margin: 0 }}><p>{r.text}</p></blockquote>
                  <figcaption className="small"><b>{r.name}</b> · {r.place}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="sec sec-ivory">
          <div className="wrap">
            <div className="sec-head split">
              <div className="stack-sm">
                <span className="eyebrow">Our service approach</span>
                <h2 className="display h2">What working with Top Dawg looks like.</h2>
              </div>
              <p className="lede">A home, a business, a trucking operation and a family’s future represent years of effort. We treat them that way.</p>
            </div>
            <div className="promises">
              <div className="promise"><span className="k">We listen first</span><b>Your situation, not a script.</b><p>We start by learning what matters to you, what you own and who depends on you.</p></div>
              <div className="promise"><span className="k">We explain clearly</span><b>Coverage in plain words.</b><p>Limits, deductibles and exclusions explained before you decide anything.</p></div>
              <div className="promise"><span className="k">We show your options</span><b>What’s available in your state.</b><p>We compare the carriers we’re appointed with where you live, and tell you if we can’t help.</p></div>
              <div className="promise"><span className="k">We stay reachable</span><b>By phone or in person.</b><p>Call {site.phone}, or arrange an in-person appointment with our team.</p></div>
            </div>
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap faq-grid">
          <div className="stack-sm">
            <span className="eyebrow">Questions</span>
            <h2 className="display h2">Straight answers.</h2>
            <p className="lede">Something we didn’t cover? Call {site.phone} or email <EmailLink />.</p>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>


      <CtaBand />
    </>
  );
}
