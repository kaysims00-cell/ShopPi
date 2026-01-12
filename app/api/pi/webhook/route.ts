import { NextResponse } from "next/server";
import crypto from "crypto";

/**
* Pi Webhook Auto-Confirm
* Called directly by Pi Network servers
*/
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("X-Pi-Signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Pi signature" },
        { status: 401 }
      );
    }

    // 🔐 VERIFY SIGNATURE
    const expectedSignature = crypto
      .createHmac("sha256", process.env.PI_API_KEY!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid Pi signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    /**
     * event example:
     * {
     *   type: "payment_completed",
     *   data: {
     *     identifier: "...",
     *     metadata: { orderId: "..." }
     *   }
     * }
     */

    if (event.type !== "payment_completed") {
      return NextResponse.json({ received: true });
    }

    const paymentId = event.data.identifier;
    const orderId = event.data.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID missing" },
        { status: 400 }
      );
    }

    // ⚠ TEMP STORAGE (until DB)
    const orders = JSON.parse(
      (global as any).orders_db || "[]"
    );

    const updatedOrders = orders.map((o: any) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: "Paid",
            paymentMethod: "pi",
            paymentRef: paymentId,
          }
        : o
    );

    (global as any).orders_db = JSON.stringify(updatedOrders);

    // 🔔 ADMIN NOTIFICATION
    const count = Number(
      (global as any).admin_new_orders_count || 0
    );
    (global as any).admin_new_orders_count = count + 1;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pi webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}