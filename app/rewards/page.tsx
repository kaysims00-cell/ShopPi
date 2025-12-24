"use client";

import { useRewards } from "@/app/context/RewardsContext";

export default function RewardsPage() {
  const { points, level, streak, history } = useRewards();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎉 Your Rewards</h1>

      {/* Level */}
      <div className="mt-4 p-4 bg-purple-600 text-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">Level: {level}</h2>
        <p>Keep earning to reach the next level!</p>
      </div>

      {/* Streak */}
      <div className="mt-4 p-4 bg-blue-600 text-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">🔥 Daily Streak: {streak} days</h2>
        <p>Open the app daily to increase your streak bonus.</p>
      </div>

      {/* Points */}
      <div className="mt-4 p-4 bg-green-600 text-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">Total Points: {points}</h2>
      </div>

      {/* History */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Reward History</h2>

        {history.length === 0 ? (
          <p className="text-muted-foreground">No reward activity yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-card"
              >
                <p className="font-bold text-lg">+{entry.points} pts</p>
                <p className="text-sm">{entry.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
