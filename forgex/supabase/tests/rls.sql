-- RLS regression tests. Each block raises if a rule is broken.
-- Run after supabase-stub.sql, the migration and the seed.

create function pg_temp.as_user(uid text) returns void language sql as $$
  select set_config('request.jwt.claim.sub', uid, false);
$$;

-- Expect the statement to fail.
create function pg_temp.denied(stmt text, why text) returns void language plpgsql as $$
begin
  execute stmt;
  raise exception 'NOT DENIED: %', why;
exception when others then
  if sqlerrm like 'NOT DENIED:%' then raise; end if;
end $$;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'stu@iitjammu.ac.in'),
  ('00000000-0000-0000-0000-00000000000b', 'founder@gmail.com');

do $$ begin
  assert (select i.slug from profiles p join institutes i on i.id = p.institute_id
           where p.user_id = '00000000-0000-0000-0000-00000000000a') = 'iit-jammu',
    'institute derived from college email domain';
end $$;

grant execute on function pg_temp.as_user(text), pg_temp.denied(text, text) to authenticated, anon;
set role authenticated;

-- Student
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
update users set name = 'Stu', handle = 'stu_a', consent_at = now() where id = auth.uid();
insert into roles values (auth.uid(), 'student');
insert into card_skills (user_id, skill_id) values (auth.uid(), 'video-editing');
select pg_temp.denied($$insert into roles values (auth.uid(), 'bec_admin')$$, 'self-grant admin');
select pg_temp.denied($$update users set email = 'x@y.z' where id = auth.uid()$$, 'edit own email');
select pg_temp.denied($$update profiles set institute_id = null where user_id = auth.uid()$$, 'edit own institute');
select pg_temp.denied($$update card_skills set tier = 'T2' where user_id = auth.uid()$$, 'self-verify');
do $$ begin assert (select count(*) from users) = 1, 'sees only own users row'; end $$;

-- Founder
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select pg_temp.denied($$insert into ideas (founder_id, title, summary, field, stage, comp_type)
  values (auth.uid(), 'Test idea', 'A long enough summary', 'edtech', 'idea', 'equity')$$, 'idea without founder role');
update users set name = 'Fou', handle = 'fou_b', consent_at = now() where id = auth.uid();
insert into roles values (auth.uid(), 'founder');
insert into ideas (id, founder_id, title, summary, field, stage, comp_type) values
  ('00000000-0000-0000-0000-0000000000c1', auth.uid(), 'Test idea', 'A long enough summary', 'edtech', 'idea', 'equity');
insert into idea_skills values ('00000000-0000-0000-0000-0000000000c1', 'video-editing', 'must');

-- Student expresses interest; cannot accept it or see contact yet
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
insert into interests (id, idea_id, student_id, message) values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000c1', auth.uid(), 'I can cut your reel');
select pg_temp.denied($$select respond_to_interest('00000000-0000-0000-0000-0000000000d1', true)$$, 'student accepts own interest');
do $$ begin
  assert not exists (select 1 from interest_contact('00000000-0000-0000-0000-0000000000d1')), 'contact hidden before accept';
end $$;

-- Founder accepts; both sides now see contact
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select respond_to_interest('00000000-0000-0000-0000-0000000000d1', true);
do $$ begin
  assert (select student_institute from interest_contact('00000000-0000-0000-0000-0000000000d1')) = 'IIT Jammu',
    'founder sees institute after accept';
end $$;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
do $$ begin
  assert (select founder_email from interest_contact('00000000-0000-0000-0000-0000000000d1')) = 'founder@gmail.com',
    'student sees founder contact after accept';
end $$;

-- Anonymous visitors
reset role;
select pg_temp.as_user('');
set role anon;
do $$ begin
  assert (select count(*) from public_cards) = 2, 'public cards visible to anon';
  assert (select count(*) from ideas) = 0, 'ideas hidden from anon';
end $$;
select pg_temp.denied($$select * from interest_contact('00000000-0000-0000-0000-0000000000d1')$$, 'anon reads contact');

-- Delete my data cascades
reset role;
set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
select delete_my_account();
reset role;
do $$ begin
  assert (select count(*) from users) = 1 and (select count(*) from card_skills) = 0 and (select count(*) from interests) = 0,
    'delete-my-data cascades';
end $$;

\echo 'RLS tests passed'
