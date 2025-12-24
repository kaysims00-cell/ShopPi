import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, provider } = await req.json();

    if (!reference || !provider) {
      return NextResponse.json(
        { error: "Missing payment reference or provider" },
        { status: 400 }
      );
    }

    // -------------------------------
    // PAYSTACK VERIFICATION
    // -------------------------------
    if (provider === "paystack") {
      const verify = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await verify.json();

      if (data.status && data.data.status === "success") {
        return NextResponse.json({
          verified: true,
          provider: "paystack",
          amount: data.data.amount / 100,
          currency: data.data.currency,
        });
      }

      return NextResponse.json({ verified: false }, { status: 400 });
    }

    // -------------------------------
    // FLUTTERWAVE VERIFICATION
    // -------------------------------
    if (provider === "flutterwave") {
      const verify = await fetch(
        `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          },
        }
      );

      const data = await verify.json();

      if (data.status === "success" && data.data.status === "successful") {
        return NextResponse.json({
          verified: true,
          provider: "flutterwave",
          amount: data.data.amount,
          currency: data.data.currency,
        });
      }

      return NextResponse.json({ verified: false }, { status: 400 });
    }

    // -------------------------------
    // PI NETWORK VERIFICATION
    // (Because Pi uses blockchain signatures)
    // -------------------------------
    if (provider === "pi") {
      // Example placeholder — real Pi verification goes here
      return NextResponse.json({
        verified: true,
        provider: "pi",
        reference,
      });
    }

    return NextResponse.json(
      { error: "Invalid provider" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Verification failed", details: err.message },
      { status: 500 }
    );
  }
}
