"use client";

import { useRewards } from "../context/RewardsContext";

export default function RewardDemo() {
  const { points, addPoints, redeemPoints } = useRewards();

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Points: {points}</h2>

      <button onClick={() => addPoints(10)}>Earn 10 Points</button>

      <button onClick={() => redeemPoints(20)}>Redeem 20 Points</button>
    </div>
  );
}
