"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRewards } from "@/app/context/RewardsContext";
import type { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CartDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addPoints } = useRewards();

  const [open, setOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const totalPoints = cart.reduce(
      (sum, item) => sum + item.quantity * 5,
      0
    );

    addPoints(totalPoints);
    clearCart();

    setCheckoutSuccess(true);

    setTimeout(() => {
      setCheckoutSuccess(false);
      setOpen(false);
    }, 2500);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={handleOverlayClick}
        />
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[60] h-full w-96 bg-card shadow-xl p-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>

        {checkoutSuccess && (
          <div className="flex flex-col items-center text-center py-10">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-bold">Checkout Successful!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              You earned reward points 🎉
            </p>
          </div>
        )}

        {!checkoutSuccess && (
          <>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center border-b pb-3"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{item.price}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="px-3 font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <p className="font-semibold text-lg">
                  Total: ₦
                  {cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}
                </p>

                <Button className="w-full mt-4" onClick={handleCheckout}>
                  Checkout & Earn Rewards
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}