
import { supabase } from "@/integrations/supabase/client";

// Connections API
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
