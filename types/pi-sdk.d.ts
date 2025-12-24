// types/pi-sdk.d.ts
interface PiSDK {
  init(options: { version: string }): void;
  createPayment(options: {
    amount: number;
    memo: string;
    metadata?: any;
  }): Promise<any>;
}

interface Window {
  Pi?: PiSDK;
}
