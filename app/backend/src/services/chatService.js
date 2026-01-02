import { supabase } from "../lib/supabase";

export default {
  // Fetch chats with a specific user
  getMessages: async (sender_id, receiver_id) => {
    let { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${sender_id},receiver_id.eq.${sender_id}`)
      .order("created_at", { ascending: true });

    return data;
  },

  sendMessage: async (sender_id, receiver_id, message) => {
    await supabase.from("messages").insert([
      {
        sender_id,
        receiver_id,
        message,
      },
    ]);
  },

  searchUsers: async (query) => {
    let { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .ilike("username", `%${query}%`);

    return data;
  },
};
