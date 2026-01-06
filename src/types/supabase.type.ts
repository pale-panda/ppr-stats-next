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
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "sessions_tracks_slug_fkey"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

