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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          last_analyzed_at: string | null
          name: string
          status: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          name: string
          status?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          name?: string
          status?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_analyses: {
        Row: {
          analyzed_at: string
          canonical_url: string | null
          critical_issues: string[] | null
          external_links: number | null
          h1_count: number | null
          h1_tags: string[] | null
          h2_count: number | null
          has_schema_markup: boolean | null
          has_viewport_meta: boolean | null
          id: string
          images_total: number | null
          images_with_alt: number | null
          images_without_alt: number | null
          internal_links: number | null
          is_https: boolean | null
          meta_description: string | null
          meta_description_length: number | null
          mobile_friendly: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          overall_score: number
          page_load_time: number | null
          page_size_kb: number | null
          project_id: string
          raw_html: string | null
          recommendations: string[] | null
          robots_meta: string | null
          schema_types: string[] | null
          title: string | null
          title_length: number | null
          twitter_card: string | null
          warnings: string[] | null
          word_count: number | null
        }
        Insert: {
          analyzed_at?: string
          canonical_url?: string | null
          critical_issues?: string[] | null
          external_links?: number | null
          h1_count?: number | null
          h1_tags?: string[] | null
          h2_count?: number | null
          has_schema_markup?: boolean | null
          has_viewport_meta?: boolean | null
          id?: string
          images_total?: number | null
          images_with_alt?: number | null
          images_without_alt?: number | null
          internal_links?: number | null
          is_https?: boolean | null
          meta_description?: string | null
          meta_description_length?: number | null
          mobile_friendly?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          overall_score: number
          page_load_time?: number | null
          page_size_kb?: number | null
          project_id: string
          raw_html?: string | null
          recommendations?: string[] | null
          robots_meta?: string | null
          schema_types?: string[] | null
          title?: string | null
          title_length?: number | null
          twitter_card?: string | null
          warnings?: string[] | null
          word_count?: number | null
        }
        Update: {
          analyzed_at?: string
          canonical_url?: string | null
          critical_issues?: string[] | null
          external_links?: number | null
          h1_count?: number | null
          h1_tags?: string[] | null
          h2_count?: number | null
          has_schema_markup?: boolean | null
          has_viewport_meta?: boolean | null
          id?: string
          images_total?: number | null
          images_with_alt?: number | null
          images_without_alt?: number | null
          internal_links?: number | null
          is_https?: boolean | null
          meta_description?: string | null
          meta_description_length?: number | null
          mobile_friendly?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          overall_score?: number
          page_load_time?: number | null
          page_size_kb?: number | null
          project_id?: string
          raw_html?: string | null
          recommendations?: string[] | null
          robots_meta?: string | null
          schema_types?: string[] | null
          title?: string | null
          title_length?: number | null
          twitter_card?: string | null
          warnings?: string[] | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
