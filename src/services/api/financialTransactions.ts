
import { supabase } from "@/integrations/supabase/client";
import { FinancialTransaction, FinancialTransactionInsert, FinancialTransactionUpdate } from "./types";

// Financial Transactions API
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
