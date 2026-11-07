import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Car, HeartHandshake, Stethoscope } from "lucide-react";
import {
  LINE_COPY,
  LINE_IDS,
  isOffered,
  linesIn,
  stateFromZip,
  statesFor,
  useAvailability,
  type LineId,
} from "./availability";
import { routing } from "./config";
import { QuoteButton } from "./ui";

export const LINE_ICON: Record<LineId, typeof Car> = { pc: Car, life: HeartHandshake, health: Stethoscope };

/* Tile-grid map of the US: [code, column, row] */
const TILES: [string, number, number][] = [
  ["AK", 0, 0], ["ME", 11, 0],
  ["WI", 6, 1], ["VT", 10, 1], ["NH", 11, 1],
  ["WA", 1, 2], ["ID", 2, 2], ["MT", 3, 2], ["ND", 4, 2], ["MN", 5, 2], ["IL", 6, 2], ["MI", 7, 2], ["NY", 9, 2], ["MA", 10, 2],
  ["OR", 1, 3], ["NV", 2, 3], ["WY", 3, 3], ["SD", 4, 3], ["IA", 5, 3], ["IN", 6, 3], ["OH", 7, 3], ["PA", 8, 3], ["NJ", 9, 3], ["CT", 10, 3], ["RI", 11, 3],
  ["CA", 1, 4], ["UT", 2, 4], ["CO", 3, 4], ["NE", 4, 4], ["MO", 5, 4], ["KY", 6, 4], ["WV", 7, 4], ["VA", 8, 4], ["MD", 9, 4], ["DE", 10, 4],
  ["AZ", 2, 5], ["NM", 3, 5], ["KS", 4, 5], ["AR", 5, 5], ["TN", 6, 5], ["NC", 7, 5], ["SC", 8, 5], ["DC", 9, 5],
  ["OK", 4, 6], ["LA", 5, 6], ["MS", 6, 6], ["AL", 7, 6], ["GA", 8, 6],
  ["HI", 0, 7], ["TX", 4, 7], ["FL", 9, 7],
];

type Filter = "all" | LineId;

export default function StateFinder({ initial }: { initial?: string }) {
  const a = useAvailability();
  const [filter, setFilter] = useState<Filter>("all");
  const [code, setCode] = useState<string>(initial ?? "");
  const [zip, setZip] = useState("");
  const [zipErr, setZipErr] = useState("");

  const lit = useMemo(() => new Set(statesFor(a, filter === "all" ? undefined : filter)), [a, filter]);
  const allNames = useMemo(
    () => Object.entries(a.states).sort((x, y) => x[1].name.localeCompare(y[1].name)),
    [a],
  );

  const lookupZip = () => {
    const s = stateFromZip(zip.trim());
    if (!s || !a.states[s]) {
      setZipErr("Enter a 5-digit U.S. ZIP code, or choose your state from the list.");
      return;
    }
    setZipErr("");
    setCode(s);
  };

  const offered = code ? linesIn(a, code) : [];
  const shown = filter === "all" ? offered : offered.filter((l) => l === filter);
  const name = code ? a.states[code]?.name : "";

  return (
    <div className="finder">
      <div className="finder-controls">
        <div className="chips" role="group" aria-label="Filter by coverage">
          {(["all", ...LINE_IDS] as Filter[]).map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All coverage" : f === "pc" ? "Property & Casualty" : f === "health" ? "Health / Medicare" : "Life"}
            </button>
          ))}
        </div>
        <div className="finder-pickers">
          <div className="field">
            <label htmlFor="sf-state">Your state</label>
            <select id="sf-state" className="select" value={code} onChange={(e) => setCode(e.target.value)}>
              <option value="">Choose a state</option>
              {allNames.map(([c, s]) => (
                <option key={c} value={c}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <form
            className="field"
            onSubmit={(e) => {
              e.preventDefault();
              lookupZip();
            }}
          >
            <label htmlFor="sf-zip">Or ZIP code</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="sf-zip"
                className="input"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="e.g. 75201"
                value={zip}
                aria-invalid={zipErr ? "true" : undefined}
                aria-describedby={zipErr ? "sf-zip-err" : undefined}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              />
              <button type="submit" className="btn btn-dark" style={{ borderRadius: 6 }}>
                Check
              </button>
            </div>
            {zipErr && (
              <span id="sf-zip-err" className="err" role="alert">
                {zipErr}
              </span>
            )}
          </form>
        </div>
        <div className="tilemap-box">
          <div className="tilemap" role="group" aria-label="Map of states. Highlighted states are where we can help with the selected coverage.">
            {Array.from({ length: 8 }).flatMap((_, r) =>
              Array.from({ length: 12 }).map((__, c) => {
                const t = TILES.find(([, col, row]) => col === c && row === r);
                if (!t) return <span key={`${r}-${c}`} aria-hidden="true" />;
                const [sc] = t;
                const on = lit.has(sc);
                const part = filter === "all" && on && linesIn(a, sc).length < 3;
                return (
                  <button
                    key={sc}
                    type="button"
                    className={`tile${on ? " on" : ""}${part ? " part" : ""}`}
                    aria-pressed={code === sc}
                    aria-label={`${a.states[sc]?.name ?? sc}${on ? "" : ", not currently served"}`}
                    onClick={() => setCode(sc)}
                  >
                    {sc}
                  </button>
                );
              }),
            )}
          </div>
        </div>
        <div className="legend" aria-hidden="true">
          {filter === "all" ? (
            <>
              <span><i style={{ background: "var(--emerald-2)" }} />All three lines</span>
              <span><i style={{ background: "#5d8a7c" }} />Some lines</span>
            </>
          ) : (
            <span><i style={{ background: "var(--emerald-2)" }} />{LINE_COPY[filter].short} available</span>
          )}
          <span><i style={{ background: "var(--ivory-2)" }} />Not yet</span>
        </div>
      </div>

      <div className="result on-dark" aria-live="polite">
        {!code && (
          <>
            <span className="eyebrow">Where we can help</span>
            <h3>Pick a state to see your options.</h3>
            <p className="muted">
              We only show coverage we can actually write where you live. Choose a state from the list, enter your ZIP, or tap the map.
            </p>
          </>
        )}
        {code && shown.length > 0 && (
          <>
            <span className="eyebrow">{name}</span>
            <h3>Here’s how we can help in {name}.</h3>
            <div className="result-lines">
              {shown.map((l) => {
                const Icon = LINE_ICON[l];
                return (
                  <div className="result-line" key={l}>
                    <span className="line-ico"><Icon aria-hidden="true" /></span>
                    <span>
                      <b>{LINE_COPY[l].short}</b>
                      <span>{LINE_COPY[l].covers} · {routing[a.lines[l].team].label}</span>
                    </span>
                    <QuoteButton line={l} state={code} label="Start" />
                  </div>
                );
              })}
            </div>
            {filter !== "all" && offered.length > shown.length && (
              <button type="button" className="btn btn-text" onClick={() => setFilter("all")}>
                Show all coverage in {name}
              </button>
            )}
            <Link href={`/states/${code.toLowerCase()}`} className="btn btn-text">
              More about coverage in {name}
            </Link>
          </>
        )}
        {code && shown.length === 0 && (
          <>
            <span className="eyebrow">{name}</span>
            <h3>
              {offered.length > 0 && filter !== "all"
                ? `We can’t help with ${LINE_COPY[filter as LineId].short.toLowerCase()} in ${name} yet.`
                : `We aren’t licensed in ${name} yet.`}
            </h3>
            {offered.length > 0 && filter !== "all" ? (
              <button type="button" className="btn btn-line" onClick={() => setFilter("all")}>
                See what we offer in {name}
              </button>
            ) : (
              <p className="muted">
                We’d rather tell you that now than take your details and send you elsewhere later. If you have family or a business in
                another state, check it here.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { isOffered };
