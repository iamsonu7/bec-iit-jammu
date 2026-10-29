"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Role = "student" | "founder";

const ROLES: { id: Role; title: string; body: string; icon: React.ReactNode }[] = [
  {
    id: "student",
    title: "I have a skill",
    body: "Build a Skill Card and find ideas that need you.",
    icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  },
  {
    id: "founder",
    title: "I have an idea",
    body: "Post it, tag the skills you need, meet people who can execute.",
    icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />,
  },
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
              className={`flex cursor-pointer items-center gap-4 rounded-xl border-[1.5px] bg-white p-4 transition ${role === r.id ? "border-navy shadow-(--shadow-card) ring-4 ring-sky/20" : "border-line hover:border-navy/40"}`}
            >
              <input type="radio" name="role" className="sr-only" checked={role === r.id} onChange={() => setRole(r.id)} />
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg transition ${role === r.id ? "bg-navy text-white" : "bg-sky-soft text-navy"}`}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden>{r.icon}</svg>
              </span>
              <span className="flex-1">
                <span className="block font-sub font-semibold text-charcoal">{r.title}</span>
                <span className="block text-sm text-ink-soft">{r.body}</span>
              </span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${role === r.id ? "border-navy" : "border-line"}`} aria-hidden>
                {role === r.id && <span className="size-2.5 rounded-full bg-navy" />}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">You can hold both roles later — a student with an idea is welcome.</p>
      </fieldset>

      {state === "sent" ? (
        <p role="status" className="notice">
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
            {state === "error" && <p role="alert" className="alert">Couldn&apos;t send the link. Check the address and try again.</p>}
          </form>
          <p className="text-xs text-muted">No passwords. A college email links you to your institute automatically.</p>
        </div>
      )}
    </div>
  );
}
