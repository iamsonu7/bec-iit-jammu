import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { deleteMyAccount, respondToInterest, setIdeaStatus, withdrawInterest } from "./actions";

export const metadata: Metadata = { title: "Dashboard" };

type Contact = { student_email: string; student_institute: string | null; founder_email: string };

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-tier-t0-bg text-tier-t0",
  accepted: "bg-tier-t2-bg text-tier-t2",
  declined: "bg-sky-soft text-navy",
  withdrawn: "bg-tier-t0-bg text-tier-t0",
};

function Status({ s }: { s: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[s] ?? ""}`}>{s}</span>;
}

export default async function Dashboard() {
  const viewer = await requireViewer("/dashboard");
  if (!viewer.consented || !viewer.handle || viewer.roles.length === 0) redirect("/start");
  const supabase = await createClient();
  const isStudent = viewer.roles.includes("student");
  const isFounder = viewer.roles.includes("founder");

  const [{ data: myInterests }, { data: myIdeas }] = await Promise.all([
    isStudent
      ? supabase.from("interests").select("id, status, message, created_at, ideas(id, title)").eq("student_id", viewer.id).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    isFounder
      ? supabase.from("ideas").select("id, title, status, interests(id, status, message, student_id, created_at)").eq("founder_id", viewer.id).neq("status", "removed").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  type Incoming = { id: string; status: string; message: string; student_id: string };
  const ideas = (myIdeas ?? []) as unknown as { id: string; title: string; status: string; interests: Incoming[] }[];
  const sent = (myInterests ?? []) as unknown as { id: string; status: string; message: string; ideas: { id: string; title: string } | null }[];

  const studentIds = [...new Set(ideas.flatMap((i) => i.interests.map((x) => x.student_id)))];
  const { data: cards } = studentIds.length
    ? await supabase.from("public_cards").select("user_id, handle, name, headline").in("user_id", studentIds)
    : { data: [] };
  const cardBy = new Map((cards ?? []).map((c) => [c.user_id as string, c]));

  const acceptedIds = [...sent, ...ideas.flatMap((i) => i.interests)].filter((x) => x.status === "accepted").map((x) => x.id);
  const contacts = new Map<string, Contact>();
  await Promise.all(
    acceptedIds.map(async (id) => {
      const { data } = await supabase.rpc("interest_contact", { p_interest: id });
      if (data?.[0]) contacts.set(id, data[0] as Contact);
    }),
  );

  return (
    <>
    <PageHeader
      eyebrow="Dashboard"
      title={<>Hi, {viewer.name?.split(" ")[0] ?? viewer.handle}</>}
      actions={
        <>
          {isStudent && <Link href={`/card/${viewer.handle}`} className="btn-sky">My Skill Card</Link>}
          <Link href="/ideas" className="btn-light">Browse ideas</Link>
          <Link href="/onboarding/founder" className="btn-light">{isFounder ? "Post an idea" : "I have an idea too"}</Link>
          {!isStudent && <Link href="/onboarding/student" className="btn-light">Add a Skill Card</Link>}
        </>
      }
    >
      {[isStudent && `${sent.length} request${sent.length === 1 ? "" : "s"} sent`, isFounder && `${ideas.length} idea${ideas.length === 1 ? "" : "s"} posted`].filter(Boolean).join(" · ")}
    </PageHeader>
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">

      {isFounder && (
        <section aria-labelledby="ideas-h">
          <h2 id="ideas-h" className="text-2xl font-bold text-charcoal">Your ideas</h2>
          {ideas.length === 0 && <p className="mt-3 text-sm text-muted">No ideas yet. <Link href="/onboarding/founder" className="underline">Post one</Link>.</p>}
          <ul className="mt-4 space-y-4">
            {ideas.map((idea) => (
              <li key={idea.id} className="panel">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link href={`/ideas/${idea.id}`} className="font-semibold hover:underline">{idea.title}</Link>
                  <form action={setIdeaStatus} className="flex items-center gap-2 text-sm">
                    <input type="hidden" name="idea_id" value={idea.id} />
                    <span className="text-muted">Status:</span>
                    {(["open", "paused", "closed"] as const).map((s) => (
                      <button key={s} name="status" value={s} aria-pressed={idea.status === s}
                        className={`chip capitalize ${idea.status === s ? "chip-on" : "hover:border-ink-soft"}`}>
                        {s}
                      </button>
                    ))}
                  </form>
                </div>
                {idea.interests.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">No interest yet. Share the idea link with students.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-line">
                    {idea.interests.map((it) => {
                      const card = cardBy.get(it.student_id);
                      const contact = contacts.get(it.id);
                      return (
                        <li key={it.id} className="py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {card ? (
                              <Link href={`/card/${card.handle}`} className="font-medium hover:underline">{card.name ?? card.handle} <span className="text-muted">@{card.handle}</span></Link>
                            ) : (
                              <span className="text-muted">A student</span>
                            )}
                            <Status s={it.status} />
                          </div>
                          {card?.headline && <p className="mt-1 text-sm text-ink-soft">&ldquo;{card.headline}&rdquo;</p>}
                          <p className="mt-2 rounded-lg border-l-4 border-sky bg-paper px-3 py-2 text-sm text-ink-soft">{it.message}</p>
                          {it.status === "pending" && (
                            <form action={respondToInterest} className="mt-3 flex gap-2">
                              <input type="hidden" name="interest_id" value={it.id} />
                              <button name="decision" value="accept" className="btn-primary !py-2">Accept &amp; share contact</button>
                              <button name="decision" value="decline" className="btn-ghost !py-2">Decline</button>
                            </form>
                          )}
                          {contact && (
                            <p className="mt-3 text-sm">
                              Contact: <a href={`mailto:${contact.student_email}`} className="font-semibold text-navy underline decoration-sky decoration-2">{contact.student_email}</a>
                              {contact.student_institute && <span className="text-muted"> · {contact.student_institute}</span>}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isStudent && (
        <section aria-labelledby="sent-h">
          <h2 id="sent-h" className="text-2xl font-bold text-charcoal">Your requests</h2>
          {sent.length === 0 && <p className="mt-3 text-sm text-muted">Nothing yet. <Link href="/ideas" className="underline">Find an idea that needs your skills</Link>.</p>}
          <ul className="mt-4 space-y-3">
            {sent.map((it) => {
              const contact = contacts.get(it.id);
              return (
                <li key={it.id} className="panel !p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {it.ideas ? <Link href={`/ideas/${it.ideas.id}`} className="font-medium hover:underline">{it.ideas.title}</Link> : <span className="text-muted">Idea no longer open</span>}
                    <Status s={it.status} />
                  </div>
                  {contact && (
                    <p className="mt-2 text-sm">
                      Accepted! Reach the founder at <a href={`mailto:${contact.founder_email}`} className="font-semibold text-navy underline decoration-sky decoration-2">{contact.founder_email}</a>
                    </p>
                  )}
                  {it.status === "pending" && (
                    <form action={withdrawInterest} className="mt-2">
                      <input type="hidden" name="interest_id" value={it.id} />
                      <button className="text-sm text-muted underline hover:text-ink">Withdraw</button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="account-h" className="border-t border-line pt-8">
        <h2 id="account-h" className="text-2xl font-bold text-charcoal">Your data</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Signed in as {viewer.email}. Deleting your account removes your Skill Card, ideas and requests permanently.
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer font-sub text-sm font-semibold text-danger">Delete my data</summary>
          <form action={deleteMyAccount} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="confirm" className="sr-only">Type DELETE to confirm</label>
            <input id="confirm" name="confirm" required pattern="DELETE" placeholder="Type DELETE to confirm" className="field sm:max-w-xs" />
            <button className="btn-ghost !border-danger !text-danger hover:!bg-danger-soft">Delete permanently</button>
          </form>
        </details>
      </section>
    </div>
    </>
  );
}
