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
      Categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: number
          created_at: string
          id: number
          product_id: number
        }
        Insert: {
          category_id: number
          created_at?: string
          id?: never
          product_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          id?: never
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_details: {
        Row: {
          created_at: string
          development_challenges: string | null
          future_roadmap: string | null
          id: number
          key_features: string[] | null
          problem_statement: string | null
          product_details: string | null
          product_id: number
          product_images: string[] | null
          Product_link: string | null
          solution_description: string | null
          target_audience: string | null
          technical_details: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          development_challenges?: string | null
          future_roadmap?: string | null
          id?: never
          key_features?: string[] | null
          problem_statement?: string | null
          product_details?: string | null
          product_id: number
          product_images?: string[] | null
          Product_link?: string | null
          solution_description?: string | null
          target_audience?: string | null
          technical_details?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          development_challenges?: string | null
          future_roadmap?: string | null
          id?: never
          key_features?: string[] | null
          problem_statement?: string | null
          product_details?: string | null
          product_id?: number
          product_images?: string[] | null
          Product_link?: string | null
          solution_description?: string | null
          target_audience?: string | null
          technical_details?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "Products"
            referencedColumns: ["id"]
          },
        ]
      }
      Products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          github_link: string | null
          id: number
          product_link: string | null
          product_video: string | null
          sub_title: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          github_link?: string | null
          id?: never
          product_link?: string | null
          product_video?: string | null
          sub_title?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          github_link?: string | null
          id?: never
          product_link?: string | null
          product_video?: string | null
          sub_title?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_icons: {
        Row: {
          created_at: string
          icon_link: string | null
          id: number
          name: string | null
          URL: string | null
        }
        Insert: {
          created_at?: string
          icon_link?: string | null
          id?: number
          name?: string | null
          URL?: string | null
        }
        Update: {
          created_at?: string
          icon_link?: string | null
          id?: number
          name?: string | null
          URL?: string | null
        }
        Relationships: []
      }
      video_page: {
        Row: {
          created_at: string
          id: number
          name: string | null
          thumbnail_url: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      Videos: {
        Row: {
          created_at: string
          id: number
          Name: string | null
          thumbnail_url: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          Name?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          Name?: string | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_product_details: {
        Args: { p_product_id: number }
        Returns: boolean
      }
      get_product_details: {
        Args: { p_product_id: number }
        Returns: {
          created_at: string
          development_challenges: string | null
          future_roadmap: string | null
          id: number
          key_features: string[] | null
          problem_statement: string | null
          product_details: string | null
          product_id: number
          product_images: string[] | null
          Product_link: string | null
          solution_description: string | null
          target_audience: string | null
          technical_details: string | null
          updated_at: string | null
        }[]
      }
      insert_product_details: {
        Args: {
          p_product_id: number
          p_problem_statement?: string
          p_target_audience?: string
          p_development_challenges?: string
          p_solution_description?: string
          p_future_roadmap?: string
          p_key_features?: string[]
          p_technical_details?: string
          p_product_images?: string[]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_product_details: {
        Args: {
          p_product_id: number
          p_problem_statement?: string
          p_target_audience?: string
          p_development_challenges?: string
          p_solution_description?: string
          p_future_roadmap?: string
          p_key_features?: string[]
          p_technical_details?: string
          p_product_images?: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
