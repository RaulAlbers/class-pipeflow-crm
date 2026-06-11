/**
 * Tipos gerados manualmente a partir do schema em supabase/migrations/.
 * Substitua este arquivo pelo output de:
 *   npx supabase gen types typescript --project-id pnkvumszozzfsuwoknfx > types/supabase.ts
 * após aplicar as migrations e adicionar SUPABASE_ACCESS_TOKEN ao .env.local.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string
          email:      string
          full_name:  string | null
          updated_at: string
        }
        Insert: {
          id:          string
          email:       string
          full_name?:  string | null
          updated_at?: string
        }
        Update: {
          id?:         string
          email?:      string
          full_name?:  string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns:        ['id']
            referencedRelation: 'users'
            referencedColumns:  ['id']
          }
        ]
      }

      workspace_invites: {
        Row: {
          id:           string
          workspace_id: string
          email:        string
          role:         'admin' | 'member'
          token:        string
          invited_by:   string
          accepted_at:  string | null
          expires_at:   string
          created_at:   string
        }
        Insert: {
          id?:           string
          workspace_id:  string
          email:         string
          role?:         'admin' | 'member'
          token?:        string
          invited_by:    string
          accepted_at?:  string | null
          expires_at?:   string
          created_at?:   string
        }
        Update: {
          id?:           string
          workspace_id?: string
          email?:        string
          role?:         'admin' | 'member'
          token?:        string
          invited_by?:   string
          accepted_at?:  string | null
          expires_at?:   string
          created_at?:   string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_invites_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          }
        ]
      }

      workspaces: {
        Row: {
          id:         string
          name:       string
          slug:       string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?:        string
          name:       string
          slug:       string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?:        string
          name?:      string
          slug?:      string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      workspace_members: {
        Row: {
          id:           string
          workspace_id: string
          user_id:      string
          role:         'admin' | 'member'
          created_at:   string
        }
        Insert: {
          id?:           string
          workspace_id:  string
          user_id:       string
          role?:         'admin' | 'member'
          created_at?:   string
        }
        Update: {
          id?:           string
          workspace_id?: string
          user_id?:      string
          role?:         'admin' | 'member'
          created_at?:   string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'workspace_members_user_id_fkey'
            columns:        ['user_id']
            referencedRelation: 'users'
            referencedColumns:  ['id']
          }
        ]
      }

      leads: {
        Row: {
          id:           string
          workspace_id: string
          owner_id:     string | null
          name:         string
          company:      string | null
          email:        string | null
          phone:        string | null
          status:       'new' | 'contacted' | 'qualified' | 'lost' | 'won'
          source:       string | null
          notes:        string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          workspace_id:  string
          owner_id?:     string | null
          name:          string
          company?:      string | null
          email?:        string | null
          phone?:        string | null
          status?:       'new' | 'contacted' | 'qualified' | 'lost' | 'won'
          source?:       string | null
          notes?:        string | null
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          id?:           string
          workspace_id?: string
          owner_id?:     string | null
          name?:         string
          company?:      string | null
          email?:        string | null
          phone?:        string | null
          status?:       'new' | 'contacted' | 'qualified' | 'lost' | 'won'
          source?:       string | null
          notes?:        string | null
          created_at?:   string
          updated_at?:   string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'leads_owner_id_fkey'
            columns:        ['owner_id']
            referencedRelation: 'users'
            referencedColumns:  ['id']
          }
        ]
      }

      deals: {
        Row: {
          id:                  string
          workspace_id:        string
          lead_id:             string | null
          owner_id:            string | null
          title:               string
          value:               number
          stage:               'new_lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'
          position:            number
          expected_close_date: string | null
          created_at:          string
          updated_at:          string
        }
        Insert: {
          id?:                  string
          workspace_id:         string
          lead_id?:             string | null
          owner_id?:            string | null
          title:                string
          value?:               number
          stage?:               'new_lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'
          position?:            number
          expected_close_date?: string | null
          created_at?:          string
          updated_at?:          string
        }
        Update: {
          id?:                  string
          workspace_id?:        string
          lead_id?:             string | null
          owner_id?:            string | null
          title?:               string
          value?:               number
          stage?:               'new_lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'
          position?:            number
          expected_close_date?: string | null
          created_at?:          string
          updated_at?:          string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'deals_lead_id_fkey'
            columns:        ['lead_id']
            referencedRelation: 'leads'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'deals_owner_id_fkey'
            columns:        ['owner_id']
            referencedRelation: 'users'
            referencedColumns:  ['id']
          }
        ]
      }

      activities: {
        Row: {
          id:           string
          workspace_id: string
          deal_id:      string | null
          lead_id:      string | null
          user_id:      string | null
          type:         'call' | 'email' | 'meeting' | 'note' | 'task'
          title:        string
          notes:        string | null
          scheduled_at: string | null
          completed_at: string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          workspace_id:  string
          deal_id?:      string | null
          lead_id?:      string | null
          user_id?:      string | null
          type:          'call' | 'email' | 'meeting' | 'note' | 'task'
          title:         string
          notes?:        string | null
          scheduled_at?: string | null
          completed_at?: string | null
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          id?:           string
          workspace_id?: string
          deal_id?:      string | null
          lead_id?:      string | null
          user_id?:      string | null
          type?:         'call' | 'email' | 'meeting' | 'note' | 'task'
          title?:        string
          notes?:        string | null
          scheduled_at?: string | null
          completed_at?: string | null
          created_at?:   string
          updated_at?:   string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'activities_deal_id_fkey'
            columns:        ['deal_id']
            referencedRelation: 'deals'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'activities_lead_id_fkey'
            columns:        ['lead_id']
            referencedRelation: 'leads'
            referencedColumns:  ['id']
          },
          {
            foreignKeyName: 'activities_user_id_fkey'
            columns:        ['user_id']
            referencedRelation: 'users'
            referencedColumns:  ['id']
          }
        ]
      }

      subscriptions: {
        Row: {
          id:                     string
          workspace_id:           string
          stripe_customer_id:     string | null
          stripe_subscription_id: string | null
          plan:                   'free' | 'pro'
          status:                 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start:   string | null
          current_period_end:     string | null
          cancel_at_period_end:   boolean
          created_at:             string
          updated_at:             string
        }
        Insert: {
          id?:                     string
          workspace_id:            string
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          plan?:                   'free' | 'pro'
          status?:                 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?:   string | null
          current_period_end?:     string | null
          cancel_at_period_end?:   boolean
          created_at?:             string
          updated_at?:             string
        }
        Update: {
          id?:                     string
          workspace_id?:           string
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          plan?:                   'free' | 'pro'
          status?:                 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?:   string | null
          current_period_end?:     string | null
          cancel_at_period_end?:   boolean
          created_at?:             string
          updated_at?:             string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_workspace_id_fkey'
            columns:        ['workspace_id']
            referencedRelation: 'workspaces'
            referencedColumns:  ['id']
          }
        ]
      }
    }
    Views:          Record<never, never>
    Functions: {
      is_workspace_member: {
        Args: { p_workspace_id: string; p_role?: string }
        Returns: boolean
      }
    }
    Enums:          Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

// ── Helpers de conveniência (equivalente ao output do CLI) ────────────────────

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row']

export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

// ── Aliases das tabelas ───────────────────────────────────────────────────────

export type Profile          = Tables<'profiles'>
export type Workspace        = Tables<'workspaces'>
export type WorkspaceMember  = Tables<'workspace_members'>
export type WorkspaceInvite  = Tables<'workspace_invites'>
export type Lead             = Tables<'leads'>
export type Deal             = Tables<'deals'>
export type Activity         = Tables<'activities'>
export type Subscription     = Tables<'subscriptions'>

export type ProfileInsert         = TablesInsert<'profiles'>
export type WorkspaceInsert       = TablesInsert<'workspaces'>
export type WorkspaceMemberInsert = TablesInsert<'workspace_members'>
export type WorkspaceInviteInsert = TablesInsert<'workspace_invites'>
export type LeadInsert            = TablesInsert<'leads'>
export type DealInsert            = TablesInsert<'deals'>
export type ActivityInsert        = TablesInsert<'activities'>
export type SubscriptionInsert    = TablesInsert<'subscriptions'>

// ── Tipos de domínio extraídos do schema ─────────────────────────────────────

export type WorkspaceMemberRole = WorkspaceMember['role']
export type LeadStatus          = Lead['status']
export type DealStage           = Deal['stage']
export type ActivityType        = Activity['type']
export type SubscriptionPlan    = Subscription['plan']
export type SubscriptionStatus  = Subscription['status']
