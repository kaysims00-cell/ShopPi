import { NextResponse } from "next/server";
import { incrementAdminOrders } from "@/lib/adminNotifications";

const PI_API_KEY = process.env.PI_API_KEY!;
const PI_API_URL = "https://api.minepi.com/v2/payments";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { paymentId } = payload;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing paymentId" },
        { status: 400 }
      );
    }

    // 🔐 VERIFY PAYMENT WITH PI
    const res = await fetch(`${PI_API_URL}/${paymentId}`, {
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Pi verification failed" },
        { status: 401 }
      );
    }

    const payment = await res.json();

    if (payment.status !== "completed") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // 🔔 ADMIN NOTIFICATION
    incrementAdminOrders();

    return NextResponse.json({
      success: true,
      message: "Payment verified & admin notified",
      paymentId: payment.identifier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook server error" },
      { status: 500 }
    );
  }
}