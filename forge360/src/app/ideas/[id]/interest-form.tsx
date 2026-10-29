"use client";

import { useActionState } from "react";
import { expressInterest } from "../actions";

export function InterestForm({ ideaId }: { ideaId: string }) {
  const [state, action, pending] = useActionState(expressInterest, undefined);

  if (state?.ok) {
    return (
      <p role="status" className="panel text-sm">
        Sent. The founder sees your Skill Card and message. If they accept, you&apos;ll both see each other&apos;s contact on your dashboard.
      </p>
    );
  }

  return (
    <form action={action} className="panel space-y-3">
      <input type="hidden" name="idea_id" value={ideaId} />
      <label htmlFor="message" className="font-semibold">Express interest</label>
      <p className="text-sm text-ink-soft">One or two lines: what would you do in your first hour on this?</p>
      <textarea id="message" name="message" rows={3} minLength={10} maxLength={500} required className="field" />
      {state?.error && <p role="alert" className="alert">{state.error}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Sending…" : "Send"}</button>
      <p className="text-xs text-muted">Your email and institute stay hidden until the founder accepts.</p>
    </form>
  );
}
