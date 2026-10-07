-- Applied to production (mbncmcwdaevukagidfbe) on 7 Oct 2026.
-- Submissions are now written only by /api/forms/[id]/submit with the service
-- role, so the route's rate limit, reCAPTCHA, password gate, schedule, response
-- cap and required-field checks can no longer be skipped by posting straight to
-- the REST API with the public anon key.
-- Rollback: create policy "Anyone can submit to published forms" on public.submissions
--   for insert with check (exists (select 1 from forms f where f.id = form_id and f.status = 'published'));
drop policy if exists "Anyone can submit to published forms" on public.submissions;
