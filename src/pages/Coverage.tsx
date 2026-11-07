import type { ReactNode } from "react";
import { Link } from "wouter";
import {
  Briefcase, Building2, Car, Check, Construction, HardHat, Heart, HeartHandshake, Home as HomeIcon, Hospital, KeyRound, MapPin, Scale, ShieldPlus, Stethoscope, Truck, UtensilsCrossed, Users,
} from "lucide-react";
import { CtaBand, Faq, MedicareDisclaimer, PageHero, QuoteButton, useMeta } from "@/site/ui";
import { LINE_COPY, hasDraft, isGated, statesFor, statesForProduct, useAvailability, type LineId } from "@/site/availability";
import { site } from "@/site/config";

type Product = { id: string; icon: typeof Car; name: string; body: string; covers: string[]; quote?: string };

function ProductList({ items, line }: { items: Product[]; line: LineId }) {
  const a = useAvailability();
  return (
    <div className="products">
      {items.map((p) => {
        // Products written only in some states are shown only where they're available.
        const gated = isGated(a, p.quote);
        const where = gated ? statesForProduct(a, p.quote!, line) : [];
        if (gated && where.length === 0) return null;
        return (
        <article key={p.name} className="product wrap" id={p.id}>
          <div className="product-head">
            <span className="line-ico"><p.icon aria-hidden="true" /></span>
            <h2 className="display" style={{ fontSize: "2rem" }}>{p.name}</h2>
          </div>
          <p>{p.body}</p>
          <ul className="covers">
            {p.covers.map((c) => (
              <li key={c}><Check aria-hidden="true" />{c}</li>
            ))}
          </ul>
          {gated && (
            <p className="avail-line">
              <MapPin aria-hidden="true" />
              <span><b>Available in:</b> {where.map((c) => a.states[c].name).join(", ")}</span>
            </p>
          )}
          <div><QuoteButton line={line} product={p.quote} label={`Request a ${p.name.toLowerCase()} quote`} className="btn btn-dark" /></div>
        </article>
        );
      })}
    </div>
  );
}

function StatesNote({ line }: { line: LineId }) {
  const a = useAvailability();
  const list = statesFor(a, line);
  return (
    <section className="sec-tight sec-ivory">
      <div className="wrap stack-sm">
        <span className="eyebrow">Where we offer {LINE_COPY[line].short.toLowerCase()}</span>
        <p style={{ margin: 0, maxWidth: "90ch" }}>
          {list.length ? list.map((c) => a.states[c].name).join(", ") : "No states are published yet."}
        </p>
        {hasDraft(a) && <div className="draft-note">Draft list, shown in this preview only. The live site lists only verified states.</div>}
        <div><Link href="/states" className="btn btn-text">Check your state</Link></div>
      </div>
    </section>
  );
}

function CoveragePage(props: {
  meta: [string, string];
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  line: LineId;
  products: Product[];
  faq: { q: string; a: ReactNode }[];
  extra?: ReactNode;
}) {
  useMeta(props.meta[0], props.meta[1]);
  return (
    <>
      <PageHero eyebrow={props.eyebrow} title={props.title} lede={props.lede} crumb={props.crumb}>
        <div className="btn-row"><QuoteButton line={props.line} /></div>
      </PageHero>
      <ProductList items={props.products} line={props.line} />
      {props.extra}
      <StatesNote line={props.line} />
      <section className="sec">
        <div className="wrap faq-grid">
          <div className="stack-sm">
            <span className="eyebrow">Questions</span>
            <h2 className="display h2">Good to know.</h2>
          </div>
          <Faq items={props.faq} />
        </div>
      </section>
      <CtaBand line={props.line} />
    </>
  );
}

/* ============================== PERSONAL ============================== */
export function Personal() {
  return (
    <CoveragePage
      meta={["Auto, Home & Renters Insurance | Top Dawg Insurance", "Compare auto, homeowners, condo and renters insurance through Top Dawg Insurance, an independent family-run agency. Request a quote in your state."]}
      crumb="Auto & Home"
      eyebrow="Personal insurance"
      title={<>The car in the driveway. <em className="accent">The home behind it.</em></>}
      lede="Auto, homeowners, condo and renters coverage, shopped across the carriers we’re appointed with in your state."
      line="pc"
      products={[
        { id: "auto", icon: Car, name: "Auto", quote: "auto", body: "Coverage for the vehicles and drivers in your household. We look at the limits you actually need, not just the state minimum.", covers: ["Liability for injuries and damage you cause to others", "Collision and comprehensive for your own vehicle", "Uninsured and underinsured motorist protection", "Options like roadside help and rental reimbursement, where offered"] },
        { id: "home", icon: HomeIcon, name: "Homeowners", quote: "home", body: "Protection for the house, your belongings and your liability. We’ll talk through replacement cost, deductibles and what your area’s risks mean for coverage.", covers: ["The structure and other buildings on the property", "Personal belongings, at home and away", "Personal liability if someone is hurt on your property", "Extra living costs if a covered loss forces you out"] },
        { id: "renters", icon: KeyRound, name: "Renters & Condo", quote: "renters", body: "Your landlord’s or association’s policy doesn’t cover your things. Renters and condo policies do, usually for less than people expect.", covers: ["Your furniture, electronics and clothing", "Personal liability", "Improvements you made to a condo unit", "Temporary housing after a covered loss"] },
      ]}
      faq={[
        { q: "What do you need from me for an auto quote?", a: <p>Each driver’s name, date of birth and license number, plus each vehicle’s year, make, model or VIN. Your current declarations page helps us compare like for like.</p> },
        { q: "Will switching cost me anything?", a: <p>Some carriers charge a cancellation fee or keep a short-rate portion of the premium. Keep your current policy until the new one is confirmed, and we’ll help you time the change.</p> },
        { q: "Are flood and earthquake included in a homeowners policy?", a: <p>Usually not. They’re typically separate policies or endorsements. Ask your agent what’s available for your address.</p> },
      ]}
    />
  );
}

/* ============================== AUTO ============================== */
export function Auto() {
  return (
    <CoveragePage
      meta={["Auto Insurance | Top Dawg Insurance", "Personal auto insurance through Top Dawg Insurance, an independent family-run agency. Compare carriers we’re appointed with and request a quote in your state."]}
      crumb="Auto"
      eyebrow="Auto insurance"
      title={<>The car in the driveway, <em className="accent">covered the right way.</em></>}
      lede="Coverage for the vehicles and drivers in your household, shopped across the carriers we’re appointed with in your state."
      line="pc"
      products={[
        { id: "auto", icon: Car, name: "Auto", quote: "auto", body: "Coverage for the vehicles and drivers in your household. We look at the limits you actually need, not just the state minimum.", covers: ["Liability for injuries and damage you cause to others", "Collision and comprehensive for your own vehicle", "Uninsured and underinsured motorist protection", "Options like roadside help and rental reimbursement, where offered"] },
      ]}
      faq={[
        { q: "What do you need from me for an auto quote?", a: <p>Each driver’s name, date of birth and license number, plus each vehicle’s year, make, model or VIN. Your current declarations page helps us compare like for like.</p> },
        { q: "Is the state minimum enough?", a: <p>Often not. State minimums can be far below the cost of a serious accident. Your agent will walk through limits that fit what you own and what you drive.</p> },
        { q: "Will switching cost me anything?", a: <p>Some carriers charge a cancellation fee or keep a short-rate portion of the premium. Keep your current policy until the new one is confirmed, and we’ll help you time the change.</p> },
        { q: "Do you insure vehicles used for work?", a: <p>Yes. Vehicles used for a business are usually covered under commercial auto. See our <Link href="/business">business insurance</Link> page.</p> },
      ]}
    />
  );
}

/* ============================== HOME ============================== */
export function HomeInsurance() {
  return (
    <CoveragePage
      meta={["Home, Renters & Condo Insurance | Top Dawg Insurance", "Homeowners, renters and condo insurance through Top Dawg Insurance, an independent family-run agency. Request a quote in your state."]}
      crumb="Home"
      eyebrow="Home insurance"
      title={<>The home you’ve built, <em className="accent">protected.</em></>}
      lede="Homeowners, renters and condo coverage, shopped across the carriers we’re appointed with in your state."
      line="pc"
      products={[
        { id: "home", icon: HomeIcon, name: "Homeowners", quote: "home", body: "Protection for the house, your belongings and your liability. We’ll talk through replacement cost, deductibles and what your area’s risks mean for coverage.", covers: ["The structure and other buildings on the property", "Personal belongings, at home and away", "Personal liability if someone is hurt on your property", "Extra living costs if a covered loss forces you out"] },
        { id: "renters", icon: KeyRound, name: "Renters & Condo", quote: "renters", body: "Your landlord’s or association’s policy doesn’t cover your things. Renters and condo policies do, usually for less than people expect.", covers: ["Your furniture, electronics and clothing", "Personal liability", "Improvements you made to a condo unit", "Temporary housing after a covered loss"] },
      ]}
      faq={[
        { q: "What do you need from me for a home quote?", a: <p>The property address, year built, square footage, roof age and any updates to plumbing, wiring or heating. Your current declarations page helps us compare like for like.</p> },
        { q: "Are flood and earthquake included in a homeowners policy?", a: <p>Usually not. They’re typically separate policies or endorsements. Ask your agent what’s available for your address.</p> },
        { q: "Do I need renters insurance if my landlord has insurance?", a: <p>Yes. The landlord’s policy covers the building, not your belongings or your personal liability.</p> },
      ]}
    />
  );
}

/* ============================== BUSINESS ============================== */
export function Business() {
  return (
    <CoveragePage
      meta={["Business Insurance: General Liability, BOP & Workers’ Comp | Top Dawg Insurance", "Commercial insurance for small and growing businesses: general liability, business owner’s policies, workers’ compensation and more from Top Dawg Insurance."]}
      crumb="Business"
      eyebrow="Business insurance"
      title={<>You built the business. <em className="accent">We’ll help you protect it.</em></>}
      lede="Commercial coverage for owners, contractors and growing teams. Tell us what you do and we’ll match it to carriers that write your kind of business."
      line="pc"
      products={[
        { id: "gl", icon: Scale, name: "General liability", quote: "commercial", body: "The foundation for most businesses: protection if a customer, vendor or member of the public says your work or premises caused injury or damage.", covers: ["Bodily injury and property damage to others", "Legal defense costs", "Personal and advertising injury", "Certificates of insurance for clients and landlords"] },
        { id: "bop", icon: Building2, name: "Business owner’s policy", quote: "business", body: "A BOP bundles general liability with property coverage, often at a better price than buying them separately. A common fit for offices, shops and restaurants.", covers: ["General liability", "Your building, equipment and inventory", "Business income after a covered loss", "Optional add-ons offered by the carrier"] },
        { id: "wc", icon: HardHat, name: "Workers’ compensation", quote: "business", body: "Required in most states once you have employees. It pays for work-related injuries and protects the business from related lawsuits.", covers: ["Medical bills for work injuries", "Lost wages while an employee recovers", "Employer’s liability", "Help with state compliance requirements"] },
        { id: "trucking", icon: Truck, name: "Trucking", quote: "trucking", body: "Coverage for owner-operators and fleets. We look at your trucks, your cargo and your routes to match you with carriers that write trucking in your state.", covers: ["Primary auto liability", "Physical damage for tractors and trailers", "Motor truck cargo", "Coverage that can help with filing requirements, where carriers offer it"] },
        { id: "commercial-auto", icon: Car, name: "Commercial auto & fleet", quote: "commercial-auto", body: "Coverage for vehicles your business owns or relies on, from a single work van to a full fleet.", covers: ["Liability for vehicles used in your business", "Physical damage for company vehicles", "Hired and non-owned auto, where carriers offer it", "Fleet options for multiple vehicles and drivers"] },
        { id: "food-truck", icon: UtensilsCrossed, name: "Food truck & trailer", quote: "food-truck", body: "Mobile food businesses need coverage for the road and the kitchen. We look at the vehicle or trailer, the equipment inside and where you set up.", covers: ["Auto liability for the truck, or coverage for the trailer", "General liability at events and service locations", "Cooking equipment and business property", "Options for food spoilage and business income, where offered"] },
        { id: "builders-risk", icon: Construction, name: "Builder’s risk", quote: "builders-risk", body: "Protection for a building while it’s being built or renovated, for owners, investors and contractors.", covers: ["The structure and materials during construction", "Materials on site and in transit, where offered", "Theft and vandalism on the job site", "Coverage that ends when the project is complete"] },
        { id: "more", icon: Briefcase, name: "Professional & specialty", quote: "commercial", body: "Professional liability and other specialty coverage are available through some of our carriers, depending on your state and industry.", covers: ["Professional liability (errors and omissions)", "Commercial property", "Umbrella coverage", "Ask us about coverage for your specific industry"] },
      ]}
      faq={[
        { q: "What information do you need for a business quote?", a: <p>What the business does, how long it’s operated, annual revenue, payroll and number of employees, locations, and any past claims. A copy of your current policy helps.</p> },
        { q: "Can you issue a certificate of insurance?", a: <p>Once you have a policy through us, yes. Email us the certificate holder’s details and what they require.</p> },
        { q: "Do you cover every industry?", a: <p>Not every one. Carriers set their own appetite by industry and state. If we can’t place your business, we’ll tell you quickly.</p> },
      ]}
    />
  );
}

/* ============================== LIFE ============================== */
export function Life() {
  return (
    <CoveragePage
      meta={["Life Insurance & Final Expense | Top Dawg Insurance", "Term life, whole life and final expense insurance from Top Dawg Insurance. Talk with a licensed agent about protecting your family."]}
      crumb="Life"
      eyebrow="Life insurance & final expense"
      title={<>For the people <em className="accent">who count on you.</em></>}
      lede="Term, whole life and final expense coverage, explained without pressure by licensed agents."
      line="life"
      products={[
        { id: "term", icon: Users, name: "Term life", quote: "life", body: "Coverage for a set number of years, usually while children are at home or a mortgage is being paid. Often the most coverage for the premium.", covers: ["A tax-free death benefit in most cases", "Terms commonly from 10 to 30 years", "Some policies can convert to permanent coverage", "Underwriting may include health questions or an exam"] },
        { id: "whole", icon: Heart, name: "Whole life", quote: "life", body: "Permanent coverage that lasts your lifetime as long as premiums are paid, with cash value that builds over time.", covers: ["Lifetime coverage", "Level premiums on many policies", "Cash value you may be able to borrow against", "A planned benefit for heirs or estate costs"] },
        { id: "fe", icon: HeartHandshake, name: "Final expense", quote: "final-expense", body: "A smaller whole life policy meant to cover funeral costs, medical bills and other final expenses, so family isn’t left with the bill.", covers: ["Smaller face amounts, often easier to qualify for", "Simplified health questions on many plans", "Premiums that typically don’t rise with age", "Some plans have a waiting period for full benefits"] },
      ]}
      faq={[
        { q: "How much life insurance do I need?", a: <p>A common starting point is enough to replace income for the years your family would need it, plus debts like a mortgage. Your agent will walk through the numbers with you.</p> },
        { q: "Do I need a medical exam?", a: <p>Some policies require one and some don’t. Simplified and guaranteed-issue options exist, usually with lower amounts or waiting periods.</p> },
      ]}
    />
  );
}

/* ============================== HEALTH ============================== */
export function Health() {
  return (
    <CoveragePage
      meta={["Health Insurance & Medicare Help | Top Dawg Insurance", "Medicare guidance, individual and family health insurance, and supplemental coverage from licensed agents at Top Dawg Insurance."]}
      crumb="Health & Medicare"
      eyebrow="Health insurance & Medicare"
      title={<>Medicare, made clear. <em className="accent">Health coverage before 65, too.</em></>}
      lede="Licensed agents who explain your options in plain language, at enrollment time and every year after."
      line="health"
      products={[
        { id: "medicare", icon: ShieldPlus, name: "Medicare", quote: "medicare", body: "Turning 65, retiring, or rethinking your current plan? We explain how Original Medicare, Medicare Advantage, Medicare Supplement and Part D plans fit together and which plans we can offer in your area.", covers: ["Medicare Advantage (Part C)", "Medicare Supplement (Medigap)", "Prescription drug plans (Part D)", "Annual plan reviews during enrollment periods"] },
        { id: "individual", icon: Stethoscope, name: "Individual & family health", quote: "health", body: "Coverage for people under 65 who don’t get insurance through work. We help you compare plan types, networks and costs.", covers: ["Individual and family plans", "Help understanding enrollment periods", "Network and prescription checks", "Plans available vary by state and county"] },
        { id: "supplemental", icon: Hospital, name: "Supplemental", quote: "supplemental", body: "Coverage that sits alongside your main health plan and pays cash benefits or covers services it doesn’t.", covers: ["Hospital indemnity", "Dental and vision", "Accident and critical illness, where available", "Not a substitute for major medical coverage"] },
      ]}
      extra={
        <section className="sec-tight">
          <div className="wrap">
            <MedicareDisclaimer />
          </div>
        </section>
      }
      faq={[
        { q: "When should I start looking at Medicare?", a: <p>About three months before the month you turn 65. Your Initial Enrollment Period runs for seven months around your birthday month.</p> },
        { q: "Does it cost more to use an agent for Medicare?", a: <p>No. Plan premiums are the same whether you enroll through an agent or directly with the plan.</p> },
        { q: "Can you help with a plan I already have?", a: <p>Yes. We can review your current plan against your doctors and prescriptions and explain when you’re allowed to make changes.</p> },
      ]}
    />
  );
}

export { Briefcase };
