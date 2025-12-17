export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      laps: {
        Row: {
          created_at: string | null;
          end_time: string | null;
          id: string;
          lap_number: number;
          lap_time_seconds: number | null;
          max_g_force_x: number | null;
          max_g_force_z: number | null;
          max_lean_angle: number | null;
          max_speed_kmh: number | null;
          min_g_force_x: number | null;
          min_g_force_z: number | null;
          min_speed_kmh: number | null;
          sector_1: number | null;
          sector_2: number | null;
          sector_3: number | null;
          session_id: string | null;
          start_time: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_time?: string | null;
          id?: string;
          lap_number: number;
          lap_time_seconds?: number | null;
          max_g_force_x?: number | null;
          max_g_force_z?: number | null;
          max_lean_angle?: number | null;
          max_speed_kmh?: number | null;
          min_g_force_x?: number | null;
          min_g_force_z?: number | null;
          min_speed_kmh?: number | null;
          sector_1?: number | null;
          sector_2?: number | null;
          sector_3?: number | null;
          session_id?: string | null;
          start_time?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_time?: string | null;
          id?: string;
          lap_number?: number;
          lap_time_seconds?: number | null;
          max_g_force_x?: number | null;
          max_g_force_z?: number | null;
          max_lean_angle?: number | null;
          max_speed_kmh?: number | null;
          min_g_force_x?: number | null;
          min_g_force_z?: number | null;
          min_speed_kmh?: number | null;
          sector_1?: number | null;
          sector_2?: number | null;
          sector_3?: number | null;
          session_id?: string | null;
          start_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'laps_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          best_lap_time_seconds: number | null;
          created_at: string | null;
          data_source: string | null;
          duration_seconds: number | null;
          id: string;
          session_date: string;
          session_source: string | null;
          session_type: string | null;
          total_laps: number | null;
          track_id: string | null;
          updated_at: string | null;
          user_id: string | null;
          vehicle: string | null;
        };
        Insert: {
          best_lap_time_seconds?: number | null;
          created_at?: string | null;
          data_source?: string | null;
          duration_seconds?: number | null;
          id?: string;
          session_date: string;
          session_source?: string | null;
          session_type?: string | null;
          total_laps?: number | null;
          track_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          vehicle?: string | null;
        };
        Update: {
          best_lap_time_seconds?: number | null;
          created_at?: string | null;
          data_source?: string | null;
          duration_seconds?: number | null;
          id?: string;
          session_date?: string;
          session_source?: string | null;
          session_type?: string | null;
          total_laps?: number | null;
          track_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          vehicle?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_track_id_fkey';
            columns: ['track_id'];
            isOneToOne: false;
            referencedRelation: 'tracks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      telemetry_points: {
        Row: {
          altitude: number | null;
          g_force_x: number | null;
          g_force_z: number | null;
          gps_point: Json | null;
          gyro_x: number | null;
          gyro_y: number | null;
          gyro_z: number | null;
          id: string;
          lap_id: string | null;
          lap_number: number | null;
          lean_angle: number | null;
          record_number: number;
          session_id: string | null;
          speed_kmh: number | null;
          timestamp: string;
        };
        Insert: {
          altitude?: number | null;
          g_force_x?: number | null;
          g_force_z?: number | null;
          gps_point?: Json | null;
          gyro_x?: number | null;
          gyro_y?: number | null;
          gyro_z?: number | null;
          id?: string;
          lap_id?: string | null;
          lap_number?: number | null;
          lean_angle?: number | null;
          record_number: number;
          session_id?: string | null;
          speed_kmh?: number | null;
          timestamp: string;
        };
        Update: {
          altitude?: number | null;
          g_force_x?: number | null;
          g_force_z?: number | null;
          gps_point?: Json | null;
          gyro_x?: number | null;
          gyro_y?: number | null;
          gyro_z?: number | null;
          id?: string;
          lap_id?: string | null;
          lap_number?: number | null;
          lean_angle?: number | null;
          record_number?: number;
          session_id?: string | null;
          speed_kmh?: number | null;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'telemetry_points_lap_id_fkey';
            columns: ['lap_id'];
            isOneToOne: false;
            referencedRelation: 'laps';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'telemetry_points_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      tracks: {
        Row: {
          configuration: string | null;
          country: string | null;
          created_at: string | null;
          description: string | null;
          gps_point: Json | null;
          id: string;
          image_url: string | null;
          length_meters: number | null;
          name: string;
          turns: number | null;
          updated_at: string | null;
        };
        Insert: {
          configuration?: string | null;
          country?: string | null;
          created_at?: string | null;
          description?: string | null;
          gps_point?: Json | null;
          id?: string;
          image_url?: string | null;
          length_meters?: number | null;
          name: string;
          turns?: number | null;
          updated_at?: string | null;
        };
        Update: {
          configuration?: string | null;
          country?: string | null;
          created_at?: string | null;
          description?: string | null;
          gps_point?: Json | null;
          id?: string;
          image_url?: string | null;
          length_meters?: number | null;
          name?: string;
          turns?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calc_min_g_force_x: {
        Args: { session_id_input: string };
        Returns: {
          lap_number: number;
          min_g_force_x: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
