"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type RewardEntry = {
  points: number;
  reason: string;
  date: string;
};

type RewardsContextType = {
  points: number;
  level: string;
  streak: number;
  history: RewardEntry[];
  addPoints: (amount: number, reason?: string) => void;
  redeemPoints: (amount: number, reason?: string) => void;
  clearRewards: () => void;
};

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<RewardEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState("Bronze");

  // Load from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("rewardPoints");
    const savedHistory = localStorage.getItem("rewardHistory");
    const savedStreak = localStorage.getItem("rewardStreak");
    const savedLevel = localStorage.getItem("rewardLevel");
    const lastActive = localStorage.getItem("lastActiveDate");

    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLevel) setLevel(savedLevel);

    const today = new Date().toDateString();

    if (lastActive !== today) {
      setStreak((prev) => prev + 1);
      localStorage.setItem("rewardStreak", (streak + 1).toString());
    }

    localStorage.setItem("lastActiveDate", today);
  }, []);

  // Auto save
  useEffect(() => {
    localStorage.setItem("rewardPoints", points.toString());
    localStorage.setItem("rewardHistory", JSON.stringify(history));
    localStorage.setItem("rewardStreak", streak.toString());
    localStorage.setItem("rewardLevel", level);
  }, [points, history, streak, level]);

  // Level logic
  useEffect(() => {
    if (points >= 5000) setLevel("Diamond");
    else if (points >= 2500) setLevel("Platinum");
    else if (points >= 1000) setLevel("Gold");
    else if (points >= 500) setLevel("Silver");
    else setLevel("Bronze");
  }, [points]);

  const addPoints = (amount: number, reason: string = "Reward Earned") => {
    const entry: RewardEntry = {
      points: amount,
      reason,
      date: new Date().toISOString(),
    };

    setPoints((prev) => prev + amount);
    setHistory((prev) => [entry, ...prev]);
  };

  const redeemPoints = (amount: number, reason: string = "Points Redeemed") => {
    setPoints((prev) => {
      if (prev < amount) return prev;
      return prev - amount;
    });

    const entry: RewardEntry = {
      points: -amount,
      reason,
      date: new Date().toISOString(),
    };

    setHistory((prev) => [entry, ...prev]);
  };

  const clearRewards = () => {
    setPoints(0);
    setHistory([]);
    setStreak(0);
    setLevel("Bronze");

    localStorage.removeItem("rewardPoints");
    localStorage.removeItem("rewardHistory");
    localStorage.removeItem("rewardStreak");
    localStorage.removeItem("rewardLevel");
  };

  return (
    <RewardsContext.Provider
      value={{
        points,
        level,
        streak,
        history,
        addPoints,
        redeemPoints,
        clearRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used inside RewardsProvider");
  return ctx;
};