-- ForgeX starter schema (Dev Guide §10), with RLS on every table (§11).
-- Run with `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- L1 Identity
-- ---------------------------------------------------------------------------

create type role_kind as enum ('student', 'founder', 'institute_admin', 'bec_admin');

create table institutes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  domain     citext unique,               -- college email domain, e.g. iitjammu.ac.in
  status     text not null default 'active' check (status in ('active', 'paused')),
  created_at timestamptz not null default now()
);

-- One row per auth user. Email lives here and is never exposed publicly.
create table users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      citext not null,
  name       text,
  handle     citext unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  headline   text check (char_length(headline) <= 120),   -- one-line "I can ship"
  created_at timestamptz not null default now(),
  consent_at timestamptz                                 -- DPDP Act 2023 consent
);

-- One user, many roles (§4).
create table roles (
  user_id uuid not null references users (id) on delete cascade,
  role    role_kind not null,
  primary key (user_id, role)
);

create table profiles (
  user_id        uuid primary key references users (id) on delete cascade,
  institute_id   uuid references institutes (id),
  discipline     text,
  year           text,
  city           text,
  availability   text check (availability in ('now', 'soon', 'busy')) default 'now',
  hours_per_week smallint check (hours_per_week between 0 and 60),
  comp_pref      text[] not null default '{}',   -- any of: paid, equity, learning
  wants_fields   text[] not null default '{}',   -- e.g. health, edtech, fashion
  bio            text check (char_length(bio) <= 500)
);

-- Create the users row as soon as someone signs in for the first time.
-- Institute is derived from the college email domain when it matches (§6 L1).
create function handle_new_auth_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  inst uuid;
begin
  insert into users (id, email) values (new.id, new.email);
  select id into inst from institutes
   where domain = split_part(new.email, '@', 2) and status = 'active';
  insert into profiles (user_id, institute_id) values (new.id, inst);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

create function has_role(r role_kind) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from roles where user_id = auth.uid() and role = r);
$$;

-- ---------------------------------------------------------------------------
-- L2 Data: the Skill Vault
-- ---------------------------------------------------------------------------

create table skills (
  id            text primary key,              -- slug, e.g. 'video-editing'
  name          text not null,
  category      text not null,
  one_hour_test text not null,
  active        boolean not null default true
);

create table skill_questions (
  id           text primary key,               -- e.g. 'video-editing-q1'
  skill_id     text not null references skills (id) on delete cascade,
  prompt       text not null,
  type         text not null check (type in ('multi', 'single', 'link', 'single_link')),
  options_json jsonb not null default '[]',
  "order"      smallint not null
);

create type trust_tier as enum ('T0', 'T1', 'T2');

create table card_skills (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users (id) on delete cascade,
  skill_id     text not null references skills (id),
  answers_json jsonb not null default '{}',
  tier         trust_tier not null default 'T0',
  verified_at  timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now(),
  unique (user_id, skill_id)
);

create table evidence (
  id             uuid primary key default gen_random_uuid(),
  card_skill_id  uuid not null references card_skills (id) on delete cascade,
  url            text not null,
  source         text not null default 'student',   -- student | crawler
  extracted_json jsonb,
  fetched_at     timestamptz
);

-- ---------------------------------------------------------------------------
-- Ideas and interest
-- ---------------------------------------------------------------------------

create table ideas (
  id         uuid primary key default gen_random_uuid(),
  founder_id uuid not null references users (id) on delete cascade,
  title      text not null check (char_length(title) between 4 and 90),
  summary    text not null check (char_length(summary) between 20 and 1200),
  field      text not null,
  stage      text not null check (stage in ('idea', 'prototype', 'launched')),
  comp_type  text not null check (comp_type in ('paid', 'equity', 'learning')),
  status     text not null default 'open' check (status in ('open', 'paused', 'closed', 'removed')),
  created_at timestamptz not null default now()
);

create table idea_skills (
  idea_id  uuid not null references ideas (id) on delete cascade,
  skill_id text not null references skills (id),
  priority text not null check (priority in ('must', 'nice')),
  primary key (idea_id, skill_id)
);

create table interests (
  id         uuid primary key default gen_random_uuid(),
  idea_id    uuid not null references ideas (id) on delete cascade,
  student_id uuid not null references users (id) on delete cascade,
  message    text not null check (char_length(message) between 10 and 500),
  status     text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (idea_id, student_id)
);

-- ---------------------------------------------------------------------------
-- L3 Trust, outreach tracking, audit
-- ---------------------------------------------------------------------------

create table verifications (
  id            uuid primary key default gen_random_uuid(),
  card_skill_id uuid not null references card_skills (id) on delete cascade,
  method        text not null check (method in ('crawler', 'micro_task', 'referral')),
  reviewer_id   uuid references users (id),
  result        text not null check (result in ('pending', 'approved', 'rejected', 'appealed')),
  notes         text,
  created_at    timestamptz not null default now()
);

create table referrals (
  id          uuid primary key default gen_random_uuid(),
  source_type text not null,          -- institute | founders | demo
  source_id   text,
  utm         jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create table audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references users (id),
  action     text not null,
  entity     text not null,
  entity_id  text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table institutes      enable row level security;
alter table users           enable row level security;
alter table roles           enable row level security;
alter table profiles        enable row level security;
alter table skills          enable row level security;
alter table skill_questions enable row level security;
alter table card_skills     enable row level security;
alter table evidence        enable row level security;
alter table ideas           enable row level security;
alter table idea_skills     enable row level security;
alter table interests       enable row level security;
alter table verifications   enable row level security;
alter table referrals       enable row level security;
alter table audit_log       enable row level security;

create policy "institutes readable" on institutes for select using (status = 'active');

create policy "own user row" on users for select using (id = auth.uid());
create policy "update own user row" on users for update using (id = auth.uid()) with check (id = auth.uid());

create policy "own roles" on roles for select using (user_id = auth.uid());
-- Users may grant themselves student/founder only; admin roles are set by BEC.
create policy "self-assign basic roles" on roles for insert
  with check (user_id = auth.uid() and role in ('student', 'founder'));

create policy "own profile" on profiles for select using (user_id = auth.uid());
-- institute_id is not editable by the user (derived from email or institute link).
create policy "update own profile" on profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "skills readable" on skills for select using (true);
create policy "questions readable" on skill_questions for select using (true);

create policy "card skills public" on card_skills for select using (true);
-- Students can only ever write T0 (self-declared). Higher tiers come from BEC.
create policy "insert own T0 skill" on card_skills for insert
  with check (user_id = auth.uid() and tier = 'T0' and verified_at is null);
create policy "update own T0 skill" on card_skills for update
  using (user_id = auth.uid()) with check (user_id = auth.uid() and tier = 'T0' and verified_at is null);
create policy "delete own skill" on card_skills for delete using (user_id = auth.uid());

create policy "evidence public" on evidence for select using (true);
create policy "add own evidence" on evidence for insert with check (
  source = 'student' and exists (select 1 from card_skills c where c.id = card_skill_id and c.user_id = auth.uid())
);

create policy "open ideas readable" on ideas for select
  using (auth.uid() is not null and (status = 'open' or founder_id = auth.uid()));
create policy "founders post ideas" on ideas for insert
  with check (founder_id = auth.uid() and has_role('founder') and status = 'open');
create policy "founders edit own ideas" on ideas for update
  using (founder_id = auth.uid()) with check (founder_id = auth.uid() and status <> 'removed');

create policy "idea skills readable" on idea_skills for select using (auth.uid() is not null);
create policy "founders tag own ideas" on idea_skills for insert
  with check (exists (select 1 from ideas i where i.id = idea_id and i.founder_id = auth.uid()));
create policy "founders untag own ideas" on idea_skills for delete
  using (exists (select 1 from ideas i where i.id = idea_id and i.founder_id = auth.uid()));

create policy "interest parties read" on interests for select using (
  student_id = auth.uid()
  or exists (select 1 from ideas i where i.id = idea_id and i.founder_id = auth.uid())
);
create policy "students express interest" on interests for insert with check (
  student_id = auth.uid() and status = 'pending' and has_role('student')
  and exists (select 1 from ideas i where i.id = idea_id and i.status = 'open' and i.founder_id <> auth.uid())
);
-- Status changes go through respond_to_interest() / withdraw_interest() below.

-- verifications, referrals, audit_log: no client policies. Server/admin only.

-- Column-level limits RLS can't express: email and institute are not user-editable.
revoke update on users, profiles from anon, authenticated;
grant update (name, handle, headline, consent_at) on users to authenticated;
grant update (discipline, year, city, availability, hours_per_week, comp_pref, wants_fields, bio)
  on profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Public Skill Card view (bias control, §8): no email, no institute, no
-- discipline, no year. Owned by postgres, so it reads past RLS on purpose.
-- ---------------------------------------------------------------------------

create view public_cards as
  select u.id as user_id, u.handle, u.name, u.headline,
         p.availability, p.hours_per_week, p.comp_pref, p.wants_fields, p.bio
    from users u join profiles p on p.user_id = u.id
   where u.handle is not null and u.consent_at is not null;

grant select on public_cards to anon, authenticated;

-- Founder-facing view of a student who expressed interest. Still hides the
-- institute until the founder accepts (§6 L3 "no bias").
create function interest_contact(p_interest uuid)
returns table (student_email text, student_institute text, founder_email text)
language sql stable security definer set search_path = public as $$
  select su.email::text, inst.name, fu.email::text
    from interests it
    join ideas i       on i.id = it.idea_id
    join users su      on su.id = it.student_id
    join users fu      on fu.id = i.founder_id
    join profiles sp   on sp.user_id = su.id
    left join institutes inst on inst.id = sp.institute_id
   where it.id = p_interest
     and it.status = 'accepted'
     and auth.uid() in (it.student_id, i.founder_id);
$$;

create function respond_to_interest(p_interest uuid, p_accept boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  update interests it set status = case when p_accept then 'accepted' else 'declined' end
    from ideas i
   where it.id = p_interest and i.id = it.idea_id
     and i.founder_id = auth.uid() and it.status = 'pending';
  if not found then raise exception 'interest not found or not pending'; end if;
  insert into audit_log (actor_id, action, entity, entity_id)
    values (auth.uid(), case when p_accept then 'accept' else 'decline' end, 'interest', p_interest::text);
end $$;

create function withdraw_interest(p_interest uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update interests set status = 'withdrawn'
   where id = p_interest and student_id = auth.uid() and status = 'pending';
  if not found then raise exception 'interest not found or not pending'; end if;
end $$;

-- DPDP: delete-my-data. Removes the auth user; everything cascades.
create function delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  delete from auth.users where id = auth.uid();
end $$;

revoke execute on function interest_contact(uuid), respond_to_interest(uuid, boolean),
  withdraw_interest(uuid), delete_my_account() from public, anon;
grant execute on function interest_contact(uuid), respond_to_interest(uuid, boolean),
  withdraw_interest(uuid), delete_my_account() to authenticated;
