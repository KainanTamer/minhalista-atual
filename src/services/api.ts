import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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

// Eventos
export const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data;
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createEvent = async (event: EventInsert) => {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, event: EventUpdate) => {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Transações Financeiras com cache otimizado
export const getFinancialTransactions = async () => {
  // Add cache control headers to improve performance
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data;
};

// Obter transações financeiras com filtros para melhorar performance
export const getRecentFinancialTransactions = async (limit = 20) => {
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getFinancialTransactionById = async (id: string) => {
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createFinancialTransaction = async (transaction: FinancialTransactionInsert) => {
  const { data, error } = await supabase
    .from("financial_transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFinancialTransaction = async (id: string, transaction: FinancialTransactionUpdate) => {
  const { data, error } = await supabase
    .from("financial_transactions")
    .update(transaction)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFinancialTransaction = async (id: string) => {
  const { error } = await supabase
    .from("financial_transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Perfil
export const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, profile: Partial<Profile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Conexões
export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from("connections")
    .select("following_id, profiles!connections_following_id_fkey(*)")
    .eq("follower_id", userId);

  if (error) throw error;
  return data;
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from("connections")
    .select("follower_id, profiles!connections_follower_id_fkey(*)")
    .eq("following_id", userId);

  if (error) throw error;
  return data;
};

export const followUser = async (followingId: string) => {
  const { data, error } = await supabase
    .from("connections")
    .insert({
      follower_id: (await supabase.auth.getUser()).data.user?.id as string,
      following_id: followingId
    })
    .select();

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followingId: string) => {
  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("follower_id", (await supabase.auth.getUser()).data.user?.id as string)
    .eq("following_id", followingId);

  if (error) throw error;
  return true;
};

// Buscar perfis de músicos
export const searchProfiles = async (query: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%, username.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
};
