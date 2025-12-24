"use client";

import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem("users_db") || "[]");
    setUsers(db);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      {users.length === 0 ? (
        <p>No users registered.</p>
      ) : (
        users.map((u) => (
          <div key={u.id} className="border p-3 mb-2 rounded">
            <p><b>Name:</b> {u.name}</p>
            <p><b>Email:</b> {u.email}</p>
            <p><b>Role:</b> {u.role}</p>
          </div>
        ))
      )}
    </div>
  );
}
