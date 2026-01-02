
import { supabase } from "../lib/supabase";

export default {
  requestCard: async (data) => {
    const { error } = await supabase.from("card_requests").insert([data]);
    console.log("Card Request Sent:", data);
    return !error;
  },

  getRequests: async (user_id) => {
    const { data } = await supabase
      .from("card_requests")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    return data;
  },
};
