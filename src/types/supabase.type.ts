export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      app_stats: {
        Row: {
          created_at: string
          id: number
          total_laps: number
          total_sessions: number
          total_tracks: number
          total_users: number
        }
        Insert: {
          created_at?: string
          id?: number
          total_laps: number
          total_sessions: number
          total_tracks: number
          total_users: number
        }
        Update: {
          created_at?: string
          id?: number
          total_laps?: number
          total_sessions?: number
          total_tracks?: number
          total_users?: number
        }
        Relationships: []
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "session_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_messages: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          sender_id: string
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          sender_id: string
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "dm_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_participants: {
        Row: {
          created_at: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "dm_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_threads: {
        Row: {
          created_at: string
          created_by: string
          id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      laps: {
        Row: {
          created_at: string
          end_time: string
          id: string
          lap_number: number
          lap_time_seconds: number
          max_g_force_x: number
          max_g_force_z: number
          max_lean_angle: number
          max_speed_kmh: number
          min_g_force_x: number
          min_g_force_z: number
          min_speed_kmh: number
          sectors: number[]
          session_id: string | null
          start_time: string
          track_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          lap_number: number
          lap_time_seconds: number
          max_g_force_x: number
          max_g_force_z: number
          max_lean_angle: number
          max_speed_kmh: number
          min_g_force_x?: number
          min_g_force_z?: number
          min_speed_kmh?: number
          sectors: number[]
          session_id?: string | null
          start_time: string
          track_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          lap_number?: number
          lap_time_seconds?: number
          max_g_force_x?: number
          max_g_force_z?: number
          max_lean_angle?: number
          max_speed_kmh?: number
          min_g_force_x?: number
          min_g_force_z?: number
          min_speed_kmh?: number
          sectors?: number[]
          session_id?: string | null
          start_time?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "laps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laps_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      news_posts: {
        Row: {
          author_id: string | null
          content: string
          cover_url: string | null
          created_at: string
          id: string
          published_at: string
          slug: string
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published_at?: string
          slug: string
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published_at?: string
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      session_comments: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          parent_id: string | null
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "session_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_comments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          best_lap_time_seconds: number
          created_at: string
          data_source: string | null
          duration_seconds: number
          id: string
          session_date: string
          session_source: string | null
          session_type: string
          theoretical_best_lap_time_seconds: number
          total_laps: number
          track_id: string
          track_slug: string
          updated_at: string | null
          user_id: string
          vehicle: string | null
        }
        Insert: {
          best_lap_time_seconds: number
          created_at?: string
          data_source?: string | null
          duration_seconds: number
          id?: string
          session_date: string
          session_source?: string | null
          session_type?: string
          theoretical_best_lap_time_seconds?: number
          total_laps?: number
          track_id: string
          track_slug: string
          updated_at?: string | null
          user_id: string
          vehicle?: string | null
        }
        Update: {
          best_lap_time_seconds?: number
          created_at?: string
          data_source?: string | null
          duration_seconds?: number
          id?: string
          session_date?: string
          session_source?: string | null
          session_type?: string
          theoretical_best_lap_time_seconds?: number
          total_laps?: number
          track_id?: string
          track_slug?: string
          updated_at?: string | null
          user_id?: string
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_track_slug_fkey"
            columns: ["track_slug"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_points: {
        Row: {
          altitude: number
          g_force_x: number
          g_force_z: number
          gps_point: Json
          gyro_x: number
          gyro_y: number
          gyro_z: number
          id: string
          lap_id: string
          lap_number: number
          lean_angle: number
          record_number: number
          session_id: string
          speed_kmh: number
          timestamp: string
        }
        Insert: {
          altitude?: number
          g_force_x: number
          g_force_z: number
          gps_point: Json
          gyro_x: number
          gyro_y: number
          gyro_z: number
          id?: string
          lap_id: string
          lap_number: number
          lean_angle: number
          record_number: number
          session_id: string
          speed_kmh: number
          timestamp: string
        }
        Update: {
          altitude?: number
          g_force_x?: number
          g_force_z?: number
          gps_point?: Json
          gyro_x?: number
          gyro_y?: number
          gyro_z?: number
          id?: string
          lap_id?: string
          lap_number?: number
          lean_angle?: number
          record_number?: number
          session_id?: string
          speed_kmh?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_points_lap_id_fkey"
            columns: ["lap_id"]
            isOneToOne: false
            referencedRelation: "laps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_points_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          configuration: string | null
          country: string
          created_at: string
          description: string | null
          gps_point: Json | null
          id: string
          image_url: string | null
          length_meters: number
          name: string
          slug: string
          turns: number
          updated_at: string | null
        }
        Insert: {
          configuration?: string | null
          country: string
          created_at?: string
          description?: string | null
          gps_point?: Json | null
          id?: string
          image_url?: string | null
          length_meters?: number
          name: string
          slug: string
          turns?: number
          updated_at?: string | null
        }
        Update: {
          configuration?: string | null
          country?: string
          created_at?: string
          description?: string | null
          gps_point?: Json | null
          id?: string
          image_url?: string | null
          length_meters?: number
          name?: string
          slug?: string
          turns?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_team_or_admin: { Args: { _user_id: string }; Returns: boolean }
      is_thread_participant: {
        Args: { _thread_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "team" | "user"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "team", "user"],
    },
  },
} as const

