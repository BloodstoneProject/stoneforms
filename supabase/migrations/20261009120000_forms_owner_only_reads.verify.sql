-- Run after 20261009120000_forms_owner_only_reads.sql. Read-only.
-- Expect: 0 rows from each anon read, and the anon insert rejected.
begin;
set local role anon;
select count(*) as anon_visible_forms from public.forms;              -- expect 0
select count(*) as anon_visible_fields from public.form_fields;       -- expect 0
do $$
begin
  insert into public.form_events (form_id, event_type)
  select id, 'view' from public.forms limit 1;  -- anon sees no forms now, so also try a literal id
  insert into public.form_events (form_id, event_type)
  values ('00000000-0000-4000-8000-000000000000', 'view');
  raise notice 'FAIL: anon insert into form_events succeeded';
exception when insufficient_privilege then
  raise notice 'PASS: anon insert into form_events rejected (%)', sqlerrm;
end $$;
rollback;

select tablename, policyname, cmd, roles from pg_policies
where schemaname = 'public' and tablename in ('forms','form_fields','form_events')
order by 1, 2;
