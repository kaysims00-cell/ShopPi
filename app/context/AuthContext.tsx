"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("current_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users: User[] = JSON.parse(
      localStorage.getItem("users_db") || "[]"
    );

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Invalid credentials");
    }

    setUser(found);
    localStorage.setItem("current_user", JSON.stringify(found));
  };

  const register = async (name: string, email: string, password: string) => {
    const users: User[] = JSON.parse(
      localStorage.getItem("users_db") || "[]"
    );

    if (users.find((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(users));
    localStorage.setItem("current_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};