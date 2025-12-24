import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { RewardsProvider } from "@/app/context/RewardsContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { OrdersProvider } from "@/app/context/OrdersContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <RewardsProvider>{children}</RewardsProvider>
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}