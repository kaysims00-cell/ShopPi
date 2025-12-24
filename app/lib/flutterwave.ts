export const flutterwaveConfig = (email: string, amount: number) => ({
  public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY!,
  tx_ref: "TX-" + Date.now(),
  amount,
  currency: "NGN",
  payment_options: "card, banktransfer, ussd",
  customer: {
    email,
  },
  customizations: {
    title: "ShopPi Payment",
    description: "Payment for items",
    logo: "/icon.svg",
  },
});
