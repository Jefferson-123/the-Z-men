import { supabase } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const { requestId, adminId } = req.body;

  const { data: requestData } = await supabase
    .from("card_requests")
    .select("user_id")
    .eq("id", requestId)
    .single();

  const { data: user } = await supabase
    .from("users")
    .select("push_token")
    .eq("id", requestData.user_id)
    .single();

  // update status
  await supabase
    .from("card_requests")
    .update({ status: "approved", admin_id: adminId })
    .eq("id", requestId);

  // send expo push notification
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: user.push_token,
      sound: "default",
      title: "Card Approved 🎉",
      body: "Your card request has been approved.",
    }),
  });

  res.status(200).json({ success: true });
}
