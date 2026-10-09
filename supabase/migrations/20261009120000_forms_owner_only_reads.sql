-- NOT YET APPLIED (written 9 Oct 2026). Run in the Supabase SQL editor for
-- stoneforms (mbncmcwdaevukagidfbe) ONLY AFTER branch forms-gate-9oct is live:
-- that branch moves every public read and the events beacon to the
-- service-role client. Applied before the code, every public form 404s.
--
-- Why: "View published or own forms" let anon read every published form's
-- settings straight from PostgREST, including settings.access.password, the
-- sha256 the password gate compares (the browser sends the hash, so knowing
-- the hash IS knowing the password). "View fields of published or own forms"
-- let anon read every question of a password-protected form without even
-- that. "Anyone can log events for published forms" let anyone write unlimited
-- fake analytics, skipping the route's per-IP limit.
--
-- After this, forms and form_fields are readable by their owner only, and
-- form_events is written only by /api/public/forms/[id]/events and
-- /api/forms/[id]/submit with the service role.
--
-- Rollback:
--   create policy "View published or own forms" on public.forms for select
--     using (((status)::text = 'published'::text) or (user_id = (select auth.uid())));
--   create policy "View fields of published or own forms" on public.form_fields for select
--     using (exists (select 1 from forms f where f.id = form_fields.form_id
--       and (((f.status)::text = 'published'::text) or (f.user_id = (select auth.uid())))));
--   create policy "Anyone can log events for published forms" on public.form_events for insert
--     with check (exists (select 1 from forms f where f.id = form_events.form_id
--       and ((f.status)::text = 'published'::text)));

begin;

drop policy if exists "View published or own forms" on public.forms;
create policy "Users can view own forms" on public.forms
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "View fields of published or own forms" on public.form_fields;
create policy "Users can view fields of own forms" on public.form_fields
  for select to authenticated
  using (exists (select 1 from public.forms f
                 where f.id = form_fields.form_id and f.user_id = (select auth.uid())));

drop policy if exists "Anyone can log events for published forms" on public.form_events;

commit;
