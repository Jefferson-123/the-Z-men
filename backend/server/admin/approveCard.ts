import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function approveOrRejectCard(
  requestId: string,
  status: "approved" | "rejected"
) {
  // 1️⃣ Get request details
  const { data, error } = await supabase
    .from("card_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) throw error;

  // 2️⃣ Update status
  await supabase
    .from("card_requests")
    .update({ status })
    .eq("id", requestId);

  // 3️⃣ Call Edge Function
  await fetch(
    `${process.env.SUPABASE_FUNCTION_URL}/card-status-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email: data.email,
        status,
        cardType: data.card_type,
        cardForm: data.card_form,
      }),
    }
  );
}
