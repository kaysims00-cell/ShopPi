// lib/pi.ts

export function isPiBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return typeof (window as any).Pi !== "undefined";
}

type PiPaymentParams = {
  amount: number;
  memo: string;
  metadata: any;
};

export async function piPayment({
  amount,
  memo,
  metadata,
}: PiPaymentParams) {
  if (typeof window === "undefined") {
    throw new Error("Not running in browser");
  }

  const Pi = (window as any).Pi;

  if (!Pi) {
    throw new Error("Pi SDK not available");
  }

  const payment = await Pi.createPayment({
    amount,
    memo,
    metadata,
  });

  return payment;
}