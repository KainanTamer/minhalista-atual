
import { Profile } from "@/integrations/supabase/types";

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

// Exportando o tipo Profile para uso em outros módulos
export type { Profile };
