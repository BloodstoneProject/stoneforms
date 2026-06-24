// Integration dispatcher. Called best-effort by the submit route after a
// submission is stored. Reads enabled `form_integrations` rows via the admin
// client (dispatch runs in the public submit path, so RLS-bypassing reads of
// owner-owned config are required) and fans out to Slack / Notion / Mailchimp.
//
// CONTRACT: this function must NEVER throw. Every integration is wrapped in its
// own try/catch so one failing target can't break the others or the submit.

import { createAdminClient } from '@/lib/supabase-server'
import { buildAnswerPairs, detectContact, type FieldLike } from './format'
import { sendSlackMessage, type SlackConfig } from './slack'
import { createNotionPage, type NotionConfig } from './notion'
import { syncMailchimpMember, type MailchimpConfig } from './mailchimp'
import { createAirtableRecord, type AirtableConfig } from './airtable'

interface DispatchArgs {
  formId: string
  submissionId: string
  form: any
  fields: any[]
  responses: Record<string, any>
}

export async function dispatchIntegrations(args: DispatchArgs): Promise<void> {
  try {
    const { formId, form, fields, responses } = args
    const formTitle = form?.title || 'Untitled form'
    const fieldList: FieldLike[] = Array.isArray(fields) ? fields : []
    const pairs = buildAnswerPairs(fieldList, responses || {})

    const admin = createAdminClient()
    const { data: integrations, error } = await admin
      .from('form_integrations')
      .select('type, config, enabled')
      .eq('form_id', formId)
      .eq('enabled', true)

    if (error) {
      console.error('[integrations] failed to load form_integrations:', error.message)
      return
    }
    if (!integrations || integrations.length === 0) return

    // Run each integration independently and in parallel; isolate failures.
    await Promise.allSettled(
      integrations.map(async (row: { type: string; config: any }) => {
        try {
          if (row.type === 'crm') {
            // Internal CRM upsert is owner-scoped, not an outbound transport.
            await upsertCrmContact({
              ownerId: form?.user_id,
              fields: fieldList,
              responses: responses || {},
            })
            return
          }
          await runOne(row.type, row.config || {}, {
            formTitle,
            fields: fieldList,
            responses: responses || {},
            pairs,
          })
        } catch (err: any) {
          console.error(`[integrations] ${row.type} dispatch failed:`, err?.message || err)
        }
      })
    )
  } catch (err: any) {
    // Absolute backstop — never throw to the caller.
    console.error('[integrations] dispatch fatal error:', err?.message || err)
  }
}

interface RunContext {
  formTitle: string
  fields: FieldLike[]
  responses: Record<string, any>
  pairs: ReturnType<typeof buildAnswerPairs>
}

async function runOne(type: string, config: any, ctx: RunContext): Promise<void> {
  switch (type) {
    case 'slack': {
      const c = config as SlackConfig
      if (!c.webhookUrl) throw new Error('Slack webhookUrl not configured')
      await sendSlackMessage({ webhookUrl: c.webhookUrl, formTitle: ctx.formTitle, pairs: ctx.pairs })
      return
    }
    case 'notion': {
      const c = config as NotionConfig
      if (!c.token || !c.databaseId) throw new Error('Notion token or databaseId not configured')
      await createNotionPage({
        token: c.token,
        databaseId: c.databaseId,
        titleProperty: c.titleProperty,
        formTitle: ctx.formTitle,
        pairs: ctx.pairs,
      })
      return
    }
    case 'mailchimp': {
      const c = config as MailchimpConfig
      if (!c.apiKey || !c.audienceId) throw new Error('Mailchimp apiKey or audienceId not configured')
      await syncMailchimpMember({
        apiKey: c.apiKey,
        audienceId: c.audienceId,
        tags: c.tags,
        fields: ctx.fields,
        responses: ctx.responses,
        pairs: ctx.pairs,
      })
      return
    }
    case 'airtable': {
      const c = config as AirtableConfig
      if (!c.token || !c.baseId || !c.tableName) {
        throw new Error('Airtable token, baseId or tableName not configured')
      }
      await createAirtableRecord({
        token: c.token,
        baseId: c.baseId,
        tableName: c.tableName,
        formTitle: ctx.formTitle,
        pairs: ctx.pairs,
      })
      return
    }
    default:
      // Unknown/no-transport types (e.g. zapier uses the existing webhooks table).
      return
  }
}

interface CrmUpsertArgs {
  ownerId?: string | null
  fields: FieldLike[]
  responses: Record<string, any>
}

// Upsert the respondent into the form owner's internal `contacts` CRM. Contacts
// are scoped by workspace_id with UNIQUE(workspace_id, email), so we resolve (or
// create) the owner's workspace exactly as /api/contacts does, then upsert on
// (workspace_id, email). Best-effort and never throws to the caller.
async function upsertCrmContact({ ownerId, fields, responses }: CrmUpsertArgs): Promise<void> {
  if (!ownerId) {
    console.error('[integrations] crm upsert skipped: missing form owner')
    return
  }

  const contact = detectContact(fields, responses)
  if (!contact.email) {
    // No email captured — nothing to dedupe on. Not an error.
    return
  }

  const admin = createAdminClient()

  // Resolve the owner's workspace (mirrors the contacts API owner scoping).
  let workspaceId: string | null = null
  const { data: workspace } = await admin
    .from('workspaces')
    .select('id')
    .eq('owner_id', ownerId)
    .single()

  if (workspace) {
    workspaceId = workspace.id
  } else {
    const { data: newWorkspace, error: wsError } = await admin
      .from('workspaces')
      .insert({ name: 'My Workspace', owner_id: ownerId })
      .select('id')
      .single()
    if (wsError || !newWorkspace) {
      console.error('[integrations] crm upsert: failed to resolve workspace:', wsError?.message)
      return
    }
    workspaceId = newWorkspace.id
  }

  const row: Record<string, any> = {
    workspace_id: workspaceId,
    email: contact.email,
    updated_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  }
  if (contact.first) row.first_name = contact.first
  if (contact.last) row.last_name = contact.last
  if (contact.phone) row.phone = contact.phone
  if (contact.company) row.company = contact.company

  const { error } = await admin
    .from('contacts')
    .upsert(row, { onConflict: 'workspace_id,email' })

  if (error) {
    console.error('[integrations] crm upsert failed:', error.message)
  }
}
