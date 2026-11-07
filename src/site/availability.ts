import { useEffect, useState } from "react";
import bundled from "../../public/data/availability.json";
import { delivery, isPreview } from "./config";

export type LineId = "life" | "health" | "pc";
export type Status = "verified" | "draft" | "off";

export interface StateEntry {
  name: string;
  life: Status;
  health: Status;
  pc: Status;
}

export interface Availability {
  showDraft: boolean;
  updated: string;
  approvedBy: string | null;
  lines: Record<LineId, { label: string; team: "pc" | "life-health" }>;
  states: Record<string, StateEntry>;
  /** Products written only in some states (builder’s risk, food truck, commercial auto…). */
  products?: Record<string, { label: string; states: Record<string, Status> }>;
}

export const LINE_IDS: LineId[] = ["pc", "life", "health"];

export const LINE_COPY: Record<LineId, { short: string; long: string; covers: string }> = {
  pc: {
    short: "Auto, Home & Business",
    long: "Property & Casualty",
    covers: "Auto, homeowners, renters, condo and business coverage",
  },
  life: {
    short: "Life & Final Expense",
    long: "Life Insurance",
    covers: "Term, whole life and final expense",
  },
  health: {
    short: "Health & Medicare",
    long: "Health Insurance",
    covers: "Medicare plans, individual health and supplemental coverage",
  },
};

let cache: Availability | null = null;

/** Loads availability.json (editable without code changes). Falls back to the bundled copy. */
export function useAvailability(): Availability {
  const [data, setData] = useState<Availability>(cache ?? (bundled as unknown as Availability));
  useEffect(() => {
    if (cache || isPreview) return;
    let alive = true;
    fetch(delivery.availabilityUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: Availability) => {
        cache = json;
        if (alive) setData(json);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

/** Draft entries only ever show in a preview build. The live site shows verified entries only. */
const showStatus = (a: Availability, v: Status | undefined) => v === "verified" || (v === "draft" && a.showDraft && isPreview);

/** A line is public in a state only if verified (or draft, in previews). */
export function isOffered(a: Availability, code: string, line: LineId): boolean {
  const s = a.states[code];
  if (!s) return false;
  return showStatus(a, s[line]);
}

/** A product is offered in a state if its line is, and (for gated products) its own entry allows it. */
export function productOffered(a: Availability, code: string, line: LineId, productId?: string): boolean {
  if (!isOffered(a, code, line)) return false;
  const gate = productId ? a.products?.[productId] : undefined;
  return gate ? showStatus(a, gate.states[code]) : true;
}

/** States where a gated product can be shown, sorted by state name. */
export function statesForProduct(a: Availability, productId: string, line: LineId): string[] {
  return Object.keys(a.states)
    .filter((c) => productOffered(a, c, line, productId))
    .sort((x, y) => a.states[x].name.localeCompare(a.states[y].name));
}

export const isGated = (a: Availability, productId?: string) => !!(productId && a.products?.[productId]);

export function linesIn(a: Availability, code: string): LineId[] {
  return LINE_IDS.filter((l) => isOffered(a, code, l));
}

export function statesFor(a: Availability, line?: LineId): string[] {
  return Object.keys(a.states)
    .filter((c) => (line ? isOffered(a, c, line) : linesIn(a, c).length > 0))
    .sort((x, y) => a.states[x].name.localeCompare(a.states[y].name));
}

export function hasDraft(a: Availability): boolean {
  return isPreview && a.showDraft && Object.values(a.states).some((s) => [s.life, s.health, s.pc].includes("draft"));
}

/* ---- ZIP → state (first three digits). Visitors can always change it. ---- */
const ZIP3: [number, number, string][] = [
  [5, 5, "NY"], [6, 9, "PR"], [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"], [39, 49, "ME"],
  [50, 59, "VT"], [60, 69, "CT"], [70, 89, "NJ"], [100, 149, "NY"], [150, 196, "PA"],
  [197, 199, "DE"], [200, 200, "DC"], [201, 201, "VA"], [202, 205, "DC"], [206, 219, "MD"],
  [220, 246, "VA"], [247, 268, "WV"], [270, 289, "NC"], [290, 299, "SC"], [300, 319, "GA"],
  [320, 349, "FL"], [350, 369, "AL"], [370, 385, "TN"], [386, 397, "MS"], [398, 399, "GA"],
  [400, 427, "KY"], [430, 459, "OH"], [460, 479, "IN"], [480, 499, "MI"], [500, 528, "IA"],
  [530, 549, "WI"], [550, 567, "MN"], [570, 577, "SD"], [580, 588, "ND"], [590, 599, "MT"],
  [600, 629, "IL"], [630, 658, "MO"], [660, 679, "KS"], [680, 693, "NE"], [700, 714, "LA"],
  [716, 729, "AR"], [730, 749, "OK"], [750, 799, "TX"], [800, 816, "CO"], [820, 831, "WY"],
  [832, 838, "ID"], [840, 847, "UT"], [850, 865, "AZ"], [870, 884, "NM"], [885, 885, "TX"],
  [889, 898, "NV"], [900, 961, "CA"], [967, 968, "HI"], [970, 979, "OR"], [980, 994, "WA"],
  [995, 999, "AK"],
];

export function stateFromZip(zip: string): string | null {
  if (!/^\d{5}$/.test(zip)) return null;
  const p = parseInt(zip.slice(0, 3), 10);
  const hit = ZIP3.find(([lo, hi]) => p >= lo && p <= hi);
  return hit ? hit[2] : null;
}
