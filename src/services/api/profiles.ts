
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

// Profile API
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

// Search profiles
export const searchProfiles = async (query: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%, username.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
};
