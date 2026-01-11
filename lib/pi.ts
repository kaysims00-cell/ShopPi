// lib/pi.ts
declare global {
  interface Window {
    Pi?: any;
  }
}

export function isPiBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.Pi !== "undefined";
}

export async function piPayment({
  amount,
  memo,
  metadata,
}: {
  amount: number;
  memo: string;
  metadata: any;
}) {
  if (!window.Pi) {
    throw new Error("Pi SDK not available");
  }

  const payment = await window.Pi.createPayment({
    amount,
    memo,
    metadata,
  });

  return payment;
}