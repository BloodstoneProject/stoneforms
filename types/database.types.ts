// Auto-generated from the live Supabase schema (project mbncmcwdaevukagidfbe).
// Regenerate with the Supabase CLI / MCP `generate_typescript_types` after schema changes.
// Import `Database` to type the Supabase client: createClient<Database>(url, key).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_activity_at: string | null
          last_name: string | null
          phone: string | null
          properties: Json | null
          tags: string[] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_activity_at?: string | null
          last_name?: string | null
          phone?: string | null
          properties?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>
        Relationships: []
      }
      deals: {
        Row: {
          actual_close_date: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          expected_close_date: string | null
          id: string
          notes: string | null
          pipeline_id: string | null
          probability: number | null
          stage: string
          status: string | null
          title: string
          updated_at: string | null
          value: number | null
          workspace_id: string
        }
        Insert: {
          actual_close_date?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          pipeline_id?: string | null
          probability?: number | null
          stage: string
          status?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
          workspace_id: string
        }
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>
        Relationships: []
      }
      file_uploads: {
        Row: {
          created_at: string | null
          field_id: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          submission_id: string | null
        }
        Insert: {
          created_at?: string | null
          field_id: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          submission_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["file_uploads"]["Insert"]>
        Relationships: []
      }
      form_events: {
        Row: {
          created_at: string
          event_type: string
          form_id: string
          id: string
          metadata: Json
          position: number | null
          question_id: string | null
          session_id: string | null
          submission_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          form_id: string
          id?: string
          metadata?: Json
          position?: number | null
          question_id?: string | null
          session_id?: string | null
          submission_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["form_events"]["Insert"]>
        Relationships: []
      }
      form_fields: {
        Row: {
          created_at: string | null
          field_type: string
          form_id: string
          id: string
          label: string
          options: string[] | null
          placeholder: string | null
          position: number
          required: boolean | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_type: string
          form_id: string
          id?: string
          label: string
          options?: string[] | null
          placeholder?: string | null
          position?: number
          required?: boolean | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["form_fields"]["Insert"]>
        Relationships: []
      }
      forms: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          logic: Json | null
          questions: Json
          settings: Json | null
          status: string | null
          theme: Json
          title: string
          updated_at: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logic?: Json | null
          questions?: Json
          settings?: Json | null
          status?: string | null
          theme?: Json
          title: string
          updated_at?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["forms"]["Insert"]>
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          email_subject: string | null
          email_template: string | null
          form_id: string | null
          id: string
          notification_emails: string[] | null
          notify_on_submission: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_subject?: string | null
          email_template?: string | null
          form_id?: string | null
          id?: string
          notification_emails?: string[] | null
          notify_on_submission?: boolean | null
          updated_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["notification_settings"]["Insert"]>
        Relationships: []
      }
      pipelines: {
        Row: {
          created_at: string | null
          id: string
          name: string
          stages: Json
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          stages?: Json
          updated_at?: string | null
          workspace_id: string
        }
        Update: Partial<Database["public"]["Tables"]["pipelines"]["Insert"]>
        Relationships: []
      }
      submissions: {
        Row: {
          answers: Json
          contact_id: string | null
          created_at: string | null
          form_id: string
          id: string
          metadata: Json | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          answers?: Json
          contact_id?: string | null
          created_at?: string | null
          form_id: string
          id?: string
          metadata?: Json | null
          status?: string | null
          tags?: string[] | null
        }
        Update: Partial<Database["public"]["Tables"]["submissions"]["Insert"]>
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          invited_email: string | null
          role: string
          status: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_email?: string | null
          role?: string
          status?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>
        Relationships: []
      }
      usage_tracking: {
        Row: {
          created_at: string | null
          forms_count: number | null
          id: string
          period_end: string
          period_start: string
          responses_count: number | null
          storage_used_mb: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          forms_count?: number | null
          id?: string
          period_end: string
          period_start: string
          responses_count?: number | null
          storage_used_mb?: number | null
          user_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["usage_tracking"]["Insert"]>
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempts: number | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          response_body: string | null
          response_code: number | null
          status: string
          submission_id: string | null
          webhook_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          response_body?: string | null
          response_code?: number | null
          status: string
          submission_id?: string | null
          webhook_id: string
        }
        Update: Partial<Database["public"]["Tables"]["webhook_deliveries"]["Insert"]>
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[] | null
          form_id: string
          id: string
          is_active: boolean | null
          secret: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          form_id: string
          id?: string
          is_active?: boolean | null
          secret?: string | null
          updated_at?: string | null
          url: string
        }
        Update: Partial<Database["public"]["Tables"]["webhooks"]["Insert"]>
        Relationships: []
      }
      workflows: {
        Row: {
          actions: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger: Json
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          actions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger: Json
          updated_at?: string | null
          workspace_id: string
        }
        Update: Partial<Database["public"]["Tables"]["workflows"]["Insert"]>
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
          workspace_id: string
        }
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>
        Relationships: []
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
