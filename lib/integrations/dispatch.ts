// Integration dispatcher. Called best-effort by the submit route after a
// submission is stored. Reads enabled `form_integrations` rows via the admin
// client (dispatch runs in the public submit path, so RLS-bypassing reads of
// owner-owned config are required) and fans out to Slack / Notion / Mailchimp.
//
// CONTRACT: this function must NEVER throw. Every integration is wrapped in its
// own try/catch so one failing target can't break the others or the submit.

import { createAdminClient } from '@/lib/supabase-server'
import { buildAnswerPairs, type FieldLike } from './format'
import { sendSlackMessage, type SlackConfig } from './slack'
import { createNotionPage, type NotionConfig } from './notion'
import { syncMailchimpMember, type MailchimpConfig } from './mailchimp'

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
    default:
      // Unknown/no-transport types (e.g. zapier uses the existing webhooks table).
      return
  }
}
