import { NextResponse } from "next/server";

const PI_API_URL = "https://api.minepi.com/v2/payments";
const PI_API_KEY = process.env.PI_API_KEY!;

export async function POST(req: Request) {
  try {
    const { paymentId, orderId } = await req.json();

    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: "Missing paymentId or orderId" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error verifying Pi payment" },
      { status: 500 }
    );
  }
}