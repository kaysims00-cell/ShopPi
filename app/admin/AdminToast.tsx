"use client";

import { useEffect, useState } from "react";

export default function AdminToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "admin_toast_message" && e.newValue) {
        setMessage(e.newValue);

        // Auto clear after 4 seconds
        setTimeout(() => {
          setMessage(null);
          localStorage.removeItem("admin_toast_message");
        }, 4000);
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded shadow-lg animate-in slide-in-from-top">
      {message}
    </div>
  );
}