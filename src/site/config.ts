/* ============================================================
   SITE CONFIG — business details shown across the site.
   Anything set to null renders as "to confirm" in preview and is
   hidden on the live site. Fill these in before launch.
   ============================================================ */

export const site = {
  /** Public brand (client decision Nov 7). */
  brand: "Top Dawg Financial",
  /** DBA confirmed Nov 7. */
  /** DBA exactly as registered on the CDI record. Used in legal disclosures only. */
  dba: "Top Dawg Insurance",
  /** Legal entity (client-confirmed Nov 7). */
  legalName: "Flanders Enterprise LLC" as string | null,
  domain: "topdawgfinancial.com",
  email: "info@topdawgfinancial.com",
  /** Public phone line (confirmed Nov 7). */
  phone: "(818) 900-7742",
  phoneHref: "tel:+18189007742",
  phoneDisplay: "818-900-7742",
  /** No street address or business hours are published (client decision, Nov 7). */
  howToMeet: "Work with us by phone, or arrange an in-person appointment.",
  /**
   * License 4249694 is NOT shown on the site until holder, type and issuing state
   * are confirmed from the official record. Set `verified: true` with the details.
   */
  /**
   * California license (client-confirmed Nov 7): Lindsay's CA Property & Casualty license.
   * `holderOnRecord` must match the licensee name exactly as it appears on the CDI record.
   */
  license: {
    verified: true,
    number: "4249694",
    holder: "Lindsay Sammons" as string | null,
    holderOnRecordConfirmed: true,
    type: "Property & Casualty" as string | null,
    jurisdiction: "California" as string | null,
    issuer: "California Department of Insurance",
    lookupUrl: "https://cdicloud.insurance.ca.gov/cal/LicenseNumberSearch",
  },
  /**
   * Medicare: 6 organizations represented.
   * The website uses CMS's generic TPMO disclaimer, which needs no plan count
   * (client decision Nov 7: too many plans to list a number).
   */
  medicare: {
    organizations: 6,
  },
};

/**
 * Where quote requests go. Apex Flow CRM is the intake system (client decision,
 * Nov 7): no separate quote inboxes. `pipeline` is the CRM pipeline each team's
 * requests land in; the CRM alerts that team as soon as a request arrives.
 */
export const routing = {
  pc: { label: "Auto, Home & Business desk", pipeline: "Property & Casualty" },
  "life-health": { label: "Life & Health desk", pipeline: "Life or Health (by product)" },
  medicare: { label: "Medicare desk", pipeline: "Medicare (else Health)" },
  general: { label: "Client care", pipeline: "n/a" },
} as const;

export type TeamId = keyof typeof routing;

/** Lead delivery. Set as repo secrets / .env. */
export const delivery = {
  /** Apex Flow CRM website intake (server/integrations/websiteLeads.ts in the CRM repo). */
  crmWebhook:
    (import.meta.env.VITE_CRM_WEBHOOK_URL as string | undefined) ||
    "https://apex-flow-crm-production.up.railway.app/api/integrations/website/leads",
  web3formsKey: (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || null,
  availabilityUrl:
    (import.meta.env.VITE_AVAILABILITY_URL as string | undefined) ||
    `${import.meta.env.BASE_URL}data/availability.json`,
};

/** True in the clickable preview build (hash routing, preview bar). */
export const isPreview = import.meta.env.VITE_PREVIEW === "1";
/** Client review build: preview features, but no internal launch review page. */
export const isClientPreview = import.meta.env.VITE_CLIENT === "1";
