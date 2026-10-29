"use client";

import { DISCIPLINES } from "@/lib/types";
import type { BasicsInput } from "@/app/onboarding/actions";

export function BasicsFields({
  value,
  onChange,
  showHeadline = true,
}: {
  value: BasicsInput;
  onChange: (v: BasicsInput) => void;
  showHeadline?: boolean;
}) {
  const set = <K extends keyof BasicsInput>(k: K, v: BasicsInput[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="name" className="label">Your name</label>
        <input id="name" className="field" required autoComplete="name" value={value.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div>
        <label htmlFor="handle" className="label">Handle <span className="font-normal text-muted">(your card URL)</span></label>
        <div className="flex items-center rounded-xl border border-line bg-card focus-within:border-navy focus-within:ring-4 focus-within:ring-sky/25">
          <span className="pl-4 text-sm text-muted">/card/</span>
          <input
            id="handle"
            className="w-full bg-transparent py-3 pr-4 text-base focus:outline-none"
            required
            pattern="[a-z0-9_]{3,24}"
            value={value.handle}
            onChange={(e) => set("handle", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          />
        </div>
      </div>
      <div>
        <label htmlFor="discipline" className="label">Discipline</label>
        <select id="discipline" className="field" required value={value.discipline} onChange={(e) => set("discipline", e.target.value)}>
          <option value="">Choose…</option>
          {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="year" className="label">Year <span className="font-normal text-muted">(optional)</span></label>
        <input id="year" className="field" placeholder="e.g. 2nd year, alumni" value={value.year ?? ""} onChange={(e) => set("year", e.target.value)} />
      </div>
      <div>
        <label htmlFor="city" className="label">City</label>
        <input id="city" className="field" required autoComplete="address-level2" value={value.city} onChange={(e) => set("city", e.target.value)} />
      </div>
      {showHeadline && (
        <div className="sm:col-span-2">
          <label htmlFor="headline" className="label">One line: &ldquo;I can ship…&rdquo;</label>
          <input
            id="headline"
            className="field"
            maxLength={120}
            placeholder="I can ship a launch reel and its captions in an afternoon."
            value={value.headline ?? ""}
            onChange={(e) => set("headline", e.target.value)}
          />
        </div>
      )}
      <label className="flex items-start gap-3 text-sm text-ink-soft sm:col-span-2">
        <input type="checkbox" className="mt-1 accent-navy" checked={value.consent} onChange={(e) => set("consent", e.target.checked)} required />
        <span>
          I agree that Forge 360 stores the details I enter to show my Skill Card and match me with ideas. My email and institute stay
          hidden until I accept a match. I can delete my data at any time from my dashboard. <a href="/privacy" target="_blank" className="font-medium text-navy underline">Privacy</a>
        </span>
      </label>
    </div>
  );
}
