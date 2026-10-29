"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Role = "student" | "founder";

const ROLES: { id: Role; title: string; body: string }[] = [
  { id: "student", title: "I have a skill", body: "Build a Skill Card and find ideas that need you." },
  { id: "founder", title: "I have an idea", body: "Post it, tag the skills you need, meet people who can execute." },
];

export function LayerLink({ initialRole, next }: { initialRole?: Role; next?: string }) {
  const [role, setRole] = useState<Role | undefined>(initialRole);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function redirectTo() {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (next) params.set("next", next);
    return `${window.location.origin}/auth/callback?${params}`;
  }

  async function google() {
    await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    setState(error ? "error" : "sent");
  }

  return (
    <div className="mt-8 space-y-8">
      <fieldset>
        <legend className="label">I&apos;m here because…</legend>
        <div className="grid gap-3">
          {ROLES.map((r) => (
            <label
              key={r.id}
              className={`panel flex cursor-pointer items-start gap-3 !p-4 transition-colors ${role === r.id ? "!border-ember bg-ember-soft" : "hover:border-ink-soft"}`}
            >
              <input type="radio" name="role" className="mt-1 accent-ember" checked={role === r.id} onChange={() => setRole(r.id)} />
              <span>
                <span className="block font-semibold">{r.title}</span>
                <span className="block text-sm text-ink-soft">{r.body}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">You can hold both roles later — a student with an idea is welcome.</p>
      </fieldset>

      {state === "sent" ? (
        <p role="status" className="panel text-sm">
          Check <strong>{email}</strong> for a sign-in link. You can close this tab.
        </p>
      ) : (
        <div className="space-y-4">
          <button type="button" onClick={google} className="btn-ghost w-full">
            <svg aria-hidden viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.2 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" /> or use your college email <span className="h-px flex-1 bg-line" />
          </div>
          <form onSubmit={magicLink} className="space-y-3">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@college.ac.in"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn-primary w-full" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Email me a sign-in link"}
            </button>
            {state === "error" && <p role="alert" className="text-sm text-ember-dark">Couldn&apos;t send the link. Check the address and try again.</p>}
          </form>
          <p className="text-xs text-muted">No passwords. A college email links you to your institute automatically.</p>
        </div>
      )}
    </div>
  );
}
