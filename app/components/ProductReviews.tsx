"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type Review = {
  productId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const allReviews: Review[] = JSON.parse(
      localStorage.getItem("reviews_db") || "[]"
    );

    setReviews(allReviews.filter(r => r.productId === productId));
  }, [productId]);

  const hasReviewed =
    user && reviews.some(r => r.userEmail === user.email);

  const submitReview = () => {
    if (!user) {
      alert("Login required to review");
      return;
    }

    const newReview: Review = {
      productId,
      userEmail: user.email,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem("reviews_db", JSON.stringify(updated));

    setComment("");
  };

  return (
    <div className="border-t pt-8 mt-10">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      {/* Review Form */}
      {!user ? (
        <p className="text-gray-500">Login to write a review.</p>
      ) : hasReviewed ? (
        <p className="text-green-600">You already reviewed this product.</p>
      ) : (
        <div className="space-y-3 mb-6">
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="border p-2 rounded w-32"
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review..."
            className="border p-2 w-full rounded"
          />

          <button
            onClick={submitReview}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="border p-3 rounded">
              <p className="font-semibold">
                {r.userEmail} — {r.rating} ⭐
              </p>
              <p>{r.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}