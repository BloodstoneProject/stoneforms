-- Google Sheets integration
-- Stores one OAuth connection + target spreadsheet per form. Each form
-- submission is appended as a row to the connected sheet (best-effort).
--
-- Ownership model matches the rest of the app: owned via user_id -> auth.users.
-- Tokens are written server-side (service-role) during the OAuth callback; the
-- owner can read/manage their own connection rows through RLS.

CREATE TABLE IF NOT EXISTS public.google_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id         UUID REFERENCES public.forms(id) ON DELETE CASCADE UNIQUE,
  access_token    TEXT,
  refresh_token   TEXT,
  token_expiry    TIMESTAMPTZ,
  spreadsheet_id  TEXT,
  spreadsheet_url TEXT,
  sheet_name      TEXT DEFAULT 'Sheet1',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- One connection per form (also enforced by the UNIQUE on form_id above).
CREATE INDEX IF NOT EXISTS google_connections_user_id_idx ON public.google_connections (user_id);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Owner-only CRUD via user_id. (select auth.uid()) is evaluated once per
-- query, not once per row (auth_rls_initplan optimization).
-- =====================================================================
ALTER TABLE public.google_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "google_connections_select_own"
  ON public.google_connections FOR SELECT
  USING (user_id = (select auth.uid()));

CREATE POLICY "google_connections_insert_own"
  ON public.google_connections FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "google_connections_update_own"
  ON public.google_connections FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "google_connections_delete_own"
  ON public.google_connections FOR DELETE
  USING (user_id = (select auth.uid()));
