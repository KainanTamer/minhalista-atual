
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithMetadata } from "./types";

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

export const followUser = async (followerId: string) => {
  const { data, error } = await supabase
    .from("connections")
    .insert({
      follower_id: (await supabase.auth.getUser()).data.user?.id as string,
      following_id: followerId
    })
    .select();

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followerId: string) => {
  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("follower_id", (await supabase.auth.getUser()).data.user?.id as string)
    .eq("following_id", followerId);

  if (error) throw error;
  return true;
};

// Add the missing function for getting following profiles
export const getFollowingProfiles = async (userId: string): Promise<ProfileWithMetadata[]> => {
  const { data, error } = await supabase
    .from("connections")
    .select("following_id, profiles!connections_following_id_fkey(id, username, full_name, avatar_url)")
    .eq("follower_id", userId);

  if (error) throw error;
  
  // Transform the data to match the ProfileWithMetadata type
  const profiles: ProfileWithMetadata[] = data.map(item => {
    const profile = item.profiles as any;
    return {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      isFollowing: true // Since these are profiles the user is following
    };
  });
  
  return profiles;
};
