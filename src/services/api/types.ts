
import { Database } from "@/integrations/supabase/types";

// Export common types used across API services
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventParticipant = Database["public"]["Tables"]["event_participants"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Contract = Database["public"]["Tables"]["contracts"]["Row"];
export type FinancialTransaction = Database["public"]["Tables"]["financial_transactions"]["Row"];
export type Connection = Database["public"]["Tables"]["connections"]["Row"];

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type FinancialTransactionInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];
export type FinancialTransactionUpdate = Database["public"]["Tables"]["financial_transactions"]["Update"];
