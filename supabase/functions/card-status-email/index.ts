import { serve } from "std/http/server.ts";

serve(async (req: Request) => {
  try {
    const { email, status, cardType, cardForm } = await req.json();

    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Kalmpay Card Request Update</h2>
        <p>Your request for a <strong>${cardType.toUpperCase()} (${cardForm})</strong> card has been:</p>
        <h3 style="color: ${status === "approved" ? "green" : "red"};">
          ${status.toUpperCase()}
        </h3>
        <p>Thank you for using Kalmpay.</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Kalmpay <no-reply@kalmpay.com>",
        to: email,
        subject: `Your Kalmpay Card Request Has Been ${status}`,
        html,
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});
