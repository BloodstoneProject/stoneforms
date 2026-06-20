-- Stoneforms database schema
-- This file documents the LIVE schema of the Supabase project (public schema).
-- Ownership model: single-user. Forms and all form-scoped data are owned via
-- forms.user_id -> auth.users.id. Workspaces/CRM tables remain workspace-scoped
-- (secondary, owner_id based) and are reserved for future multi-seat support.
--
-- Source of truth = the live database. Keep this in sync when applying migrations.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- WORKSPACES (reserved for future teams; CRM tables key off these today)
-- =====================================================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL,
  settings JSONB DEFAULT '{"allowSignups": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- team_members: invite-based collaborators (parallel to workspace_members)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  invited_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- FORMS  (owned by user_id; workspace_id nullable/legacy)
-- =====================================================================
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- nullable, legacy
  title VARCHAR(500) NOT NULL,
  description TEXT,
  -- questions JSONB is legacy; canonical fields live in form_fields.
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  logic JSONB DEFAULT '[]'::jsonb,
  theme JSONB NOT NULL DEFAULT '{
    "id": "default", "name": "Default",
    "colors": {"primary":"#3B82F6","background":"#FFFFFF","text":"#1F2937","button":"#3B82F6","buttonText":"#FFFFFF"},
    "fonts": {"heading":"Inter","body":"Inter"}
  }'::jsonb,
  settings JSONB DEFAULT '{"showProgressBar":true,"allowMultipleSubmissions":true,"requireEmail":false}'::jsonb,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_forms_user ON forms(user_id);
CREATE INDEX idx_forms_status ON forms(status);

-- Canonical, normalized fields/questions for a form.
CREATE TABLE form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL,            -- see lib/field-types.ts FieldType
  label TEXT NOT NULL,
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  options TEXT[],                      -- choices for choice-type fields
  position INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,  -- min/max/pattern/description/etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_form_fields_form ON form_fields(form_id);

-- =====================================================================
-- SUBMISSIONS
-- =====================================================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,   -- keyed by form_fields.id
  metadata JSONB DEFAULT '{}'::jsonb,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','completed','incomplete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_submissions_form ON submissions(form_id);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);

CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID UNIQUE REFERENCES forms(id) ON DELETE CASCADE,
  notify_on_submission BOOLEAN DEFAULT true,
  notification_emails TEXT[],
  email_subject TEXT DEFAULT 'New form submission',
  email_template TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ANALYTICS  (append-only event log; no UPDATE policy => immutable)
-- =====================================================================
CREATE TABLE form_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view','start','step','submit')),
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  session_id TEXT,
  question_id UUID,
  position INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_form_events_form ON form_events(form_id);
CREATE INDEX idx_form_events_form_type ON form_events(form_id, event_type);
CREATE INDEX idx_form_events_created ON form_events(created_at DESC);
-- RLS: anon INSERT only for published forms; owner SELECT/DELETE only; no UPDATE.

-- =====================================================================
-- CRM (workspace-scoped)
-- =====================================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  properties JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ,
  UNIQUE(workspace_id, email)
);

CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  value NUMERIC(12,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  stage VARCHAR(255) NOT NULL,
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open','won','lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- INTEGRATIONS & AUTOMATION
-- =====================================================================
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  events TEXT[] DEFAULT ARRAY['submission.created']::TEXT[],
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending','success','failed')),
  response_code INTEGER,
  response_body TEXT,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger JSONB NOT NULL,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- BILLING (user-scoped) — Stage 5
-- =====================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  currency TEXT DEFAULT 'GBP',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  forms_count INTEGER DEFAULT 0,
  responses_count INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (live policy summary)
-- =====================================================================
-- forms:        owner CRUD; consolidated SELECT = (status='published' OR own)
-- form_fields:  owner CRUD; consolidated SELECT covers published-or-own parent form
-- submissions:  anyone may INSERT to a published form; owner may SELECT/DELETE
-- form_events:  anon INSERT for published forms only; owner SELECT/DELETE; no UPDATE
-- file_uploads / notification_settings / webhooks / webhook_deliveries: owner via parent form
-- subscriptions / usage_tracking: user via (user_id = auth.uid())
-- contacts / deals / pipelines: owner via workspaces.owner_id = auth.uid()
-- workflows / workspace_members: RLS enabled, NO policies = deny-all (reserved)
-- NOTE: all policies use (select auth.uid()) so it is evaluated once per query,
--       not once per row (Supabase auth_rls_initplan optimization).
-- All tables have RLS ENABLED. See migrations for exact policy definitions.

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- On new auth user: provision a free subscription row.
-- (Trigger: on_user_created_subscription -> create_free_subscription)
