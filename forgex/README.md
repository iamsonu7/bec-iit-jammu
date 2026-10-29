# ForgeX

> You have a skill. Someone has an idea. Forge it.

ForgeX, by the Budding Entrepreneurs Club (BEC), connects any student with any skill to
any idea, and proves the skill in one hour. This folder is the web app, built from the
**ForgeX Project Development Guide v0.1**.

Stack (Dev Guide §11): Next.js 15 (App Router) + TypeScript + Tailwind 4, on Supabase
(Postgres, Auth, Row Level Security).

---

## What's built so far

**Phase 0 — Foundations**

- [x] Agenda line: *"Stop learning skills for nothing. Put them on a real idea."* (§7.1 recommendation; change in `src/app/page.tsx` if you lock a different one)
- [x] Skill taxonomy v0: 40 cross-discipline skills, each with a 1-hour test → `supabase/skill-vault.json`
- [x] Repo, CI (`.github/workflows/forgex-ci.yml`), design tokens (`src/app/globals.css`)
- [ ] Royalty model (A or B) — a decision, not code. Guide recommends A for v1.

**Phase 1 — MVP core**

- [x] Landing page + Layer Link (`/start`): one smart flow for new and returning users
- [x] Auth: Google + email magic link, no passwords. Roles: student / founder (one user, many roles)
- [x] Student onboarding + Skill Vault (40 skills × 3–4 questions)
- [x] Public Skill Card `/card/[handle]` + share image (OpenGraph) + PDF export (print)
- [x] Founder: post idea + tag skills as must / nice
- [x] Idea browse (`/ideas`) + "Express interest"; founder accepts → both see contact

**Also in already** (because they are cheap now and painful to retrofit):

- RLS on every table, tested in CI (`supabase/tests/rls.sql`)
- Bias control: public cards never show email, institute, discipline or year;
  institute is revealed to the founder only after they accept
- Institute auto-linked from college email domain (§6 L1)
- DPDP basics: explicit consent at onboarding, "Delete my data" on the dashboard
- Simple transparent match % on ideas (L4 v1 preview: must-have skills weigh 2×)

**Next up:** Phase 2 (`/i/[institute-slug]` links + UTM tracking, brochure),
Phase 3 (T1/T2 verification queue, `/admin`, web-card crawler), Phase 4 (matching,
notifications). See §12 of the guide.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Landing: one message, two buttons |
| `/start` | Layer Link: pick a role, sign in with Google or email link |
| `/onboarding/student` | About you → availability → pick skills → Skill Vault questions → Skill Card |
| `/onboarding/founder` | Post an idea and tag the skills it needs |
| `/card/[handle]` | Public Skill Card (shareable, SEO-friendly, PDF export) |
| `/demo` | Sample Skill Card from §8 and how it works |
| `/ideas`, `/ideas/[id]` | Browse ideas (signed in), express interest |
| `/dashboard` | Founder: interested students, accept/decline. Student: request status. Delete my data |

---

## Run it locally

1. **Create a Supabase project** (free tier is fine) at supabase.com.
2. **Create the database.** In the Supabase SQL editor, run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`

   (Or with the Supabase CLI: `supabase link` then `supabase db push`, and run the seed.)
3. **Turn on sign-in** in Supabase → Authentication → Providers:
   - Email: enabled (magic link).
   - Google: add a Google OAuth client ID/secret.
   - URL configuration: add `http://localhost:3000/auth/callback` (and your production URL) to the redirect allow-list.
4. **Configure and start:**

   ```bash
   cp .env.example .env.local   # fill in the Supabase URL and anon key
   npm install
   npm run dev
   ```

   Open http://localhost:3000. `/` and `/demo` work even before Supabase is configured.

### Make someone a BEC admin

Admin roles can't be self-assigned (RLS blocks it). In the SQL editor:

```sql
insert into roles (user_id, role)
select id, 'bec_admin' from users where email = 'someone@iitjammu.ac.in';
```

### Add an institute

```sql
insert into institutes (name, slug, domain) values ('NIT Srinagar', 'nit-srinagar', 'nitsri.ac.in');
```

Anyone who signs in with an `@nitsri.ac.in` email is linked to it automatically.

---

## Editing the Skill Vault

`supabase/skill-vault.json` is the single source of truth. Each skill has an `id`, `name`,
`category`, `one_hour_test` and optional `tools`. Every skill gets the same precise
question set, mirroring the guide's Graphic Design example:

1. Which tools can you use without a tutorial? *(multi-select, if `tools` given)*
2. Link one piece of work you made in the last 6 months.
3. Could you *{one_hour_test}* in 1 hour? *(Yes / With help / No)*
4. Have you delivered this for a real client, club or event? *(Yes / No + link)*

After editing, regenerate the seed and re-run it (it upserts, so it's safe to re-run):

```bash
npm run seed:build
```

CI fails if `seed.sql` is out of date with the JSON.

---

## Project layout

```
forgex/
├─ supabase/
│  ├─ migrations/0001_init.sql   schema (§10), RLS, helper functions
│  ├─ skill-vault.json           Skill Vault source of truth
│  ├─ seed.sql                   generated from the JSON
│  └─ tests/                     RLS regression tests (run in CI)
├─ scripts/build-seed.mjs
└─ src/
   ├─ app/                       routes (see Pages)
   ├─ components/                Skill Card, tier badge, question inputs…
   ├─ lib/                       Supabase clients, session, vault validation, matching
   └─ middleware.ts              session refresh + auth gate
```

## Security notes

- Every table has RLS. Role checks happen in Postgres and in server actions, never only in the UI.
- Students can only ever write trust tier **T0**. T1/T2 come from BEC (Phase 3).
- Email and institute are column-locked: users can't edit them from the client.
- Contact details are only returned by `interest_contact()` after a founder accepts.
- Secrets live only in env vars; `.env.local` is git-ignored.

## Decisions taken from the guide's open questions (§13)

These follow the guide's recommendations. Change them if you decide otherwise.

| Question | What the code does now |
|---|---|
| Chat place | No in-app chat. Express interest → founder accepts → both see email |
| Sign in vs Login | One smart flow at `/start` that routes new vs returning users |
| "Info for ForgeX" | Name, handle, discipline, year (optional), city, role, consent |
| Royalty, verification reviewers, IP template, founder safety, institute MoU | Still open — not in code yet |
