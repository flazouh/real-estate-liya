import { NextResponse } from "next/server";

// This should be set in your environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Format the message for Telegram
    const message = [
      "🏠 New Apartment Viewing Request",
      "",
      "👤 Name: " + data.name,
      "📧 Email: " + data.email,
      "📱 Phone: " + data.phone,
      "📅 Age: " + data.age,
      "💼 Job: " + data.job,
      "👥 Living Arrangement: " + data.livingArrangement,
      "📅 Calendly Event: " + data.calendlyEventUrl,
      "✅ Agreed to Terms: Yes",
      "",
      "Please check your Calendly dashboard for the scheduled viewing time.",
    ].join("\n");

    // Send to Telegram
    const telegramUrl =
      "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error("Failed to send Telegram message");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
