"use client";

import React from "react";

type Props = {
  rating: number;
  onRate?: (value: number) => void;
  size?: number;
};

export default function StarRating({
  rating,
  onRate,
  size = 24,
}: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          className="focus:outline-none"
        >
          <span
            style={{ fontSize: size }}
            className={
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
