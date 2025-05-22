
import { Tables } from "@/integrations/supabase/types";

// Using the Profile type from Supabase's generated types
export type Profile = Tables<"profiles">;

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  event_type: "ensaio" | "show" | "gravacao" | "outro";
  status: "planejado" | "confirmado" | "cancelado" | "realizado";
  location: string | null;
  venue_name: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Add insert and update types for Event
export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type EventUpdate = Partial<EventInsert>;

export interface FinancialTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  transaction_type: "receita" | "despesa";
  category: "show" | "venda_merch" | "equipamento" | "transporte" | "estudio" | "marketing" | "outro";
  transaction_date: string;
  related_event_id: string | null;
  related_contract_id: string | null;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

// Add insert and update types for FinancialTransaction
export type FinancialTransactionInsert = Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>;
export type FinancialTransactionUpdate = Partial<FinancialTransactionInsert>;

export interface EventParticipant {
  event_id: string;
  profile_id: string;
  role: string | null;
  added_at: string;
}

export interface Connection {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface ProfileWithMetadata extends Profile {
  isFollowing?: boolean;
}
