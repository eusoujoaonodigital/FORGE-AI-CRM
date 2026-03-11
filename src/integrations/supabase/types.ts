export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_type: string
          created_at: string
          end_time: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          notes: string | null
          price: number
          room_id: string
          source: string
          start_time: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_type?: string
          created_at?: string
          end_time: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          price: number
          room_id: string
          source?: string
          start_time: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_type?: string
          created_at?: string
          end_time?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          price?: number
          room_id?: string
          source?: string
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_sections: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_visible: boolean
          order: number
          page_id: string
          section_type: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          order?: number
          page_id: string
          section_type: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          order?: number
          page_id?: string
          section_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          created_at: string
          created_by: string | null
          custom_css: string | null
          favicon_url: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          pixel_google_id: string | null
          pixel_meta_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          custom_css?: string | null
          favicon_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          pixel_google_id?: string | null
          pixel_meta_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          custom_css?: string | null
          favicon_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          pixel_google_id?: string | null
          pixel_meta_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          quiz_responses: Json | null
          score: number | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          quiz_responses?: Json | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          quiz_responses?: Json | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_id: string
          referrer: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_id: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_id?: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_cards: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          order: number
          stage_id: string
          updated_at: string
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          order?: number
          stage_id: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          order?: number
          stage_id?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_cards_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_cards_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          order: number
          pipeline_type: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          order?: number
          pipeline_type: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          order?: number
          pipeline_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          completed_at: string
          id: string
          lead_id: string | null
          quiz_id: string
          responses: Json
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          lead_id?: string | null
          quiz_id: string
          responses?: Json
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          lead_id?: string | null
          quiz_id?: string
          responses?: Json
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          questions: Json
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          questions?: Json
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          questions?: Json
          slug?: string
          title?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price_daily: number
          price_monthly: number
          price_online: number
          price_walkin: number
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price_daily?: number
          price_monthly?: number
          price_online?: number
          price_walkin?: number
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price_daily?: number
          price_monthly?: number
          price_online?: number
          price_walkin?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          plan_name: string
          price: number
          room_id: string | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_name: string
          price: number
          room_id?: string | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_name?: string
          price?: number
          room_id?: string | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
