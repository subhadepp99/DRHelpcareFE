"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";

export default function DoctorReviewForm({ doctorId, onSubmitted }) {
  const { post } = useApi();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hover, setHover] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (!doctorId) return;
    try {
      setSubmitting(true);
      const { data } = await post(`/doctors/${doctorId}/reviews`, {
        rating,
        comment,
      });
      onSubmitted && onSubmitted(data.data || data);
      setComment("");
    } catch (err) {
      // optionally surface error
    } finally {
      setSubmitting(false);
    }
  };

  const Star = ({ index }) => {
    const filled = (hover || rating) >= index;
    return (
      <button
        type="button"
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(0)}
        onClick={() => setRating(index)}
        aria-label={`${index} star`}
        className="p-0.5"
      >
        <span className={filled ? "text-yellow-500" : "text-gray-300"}>★</span>
      </button>
    );
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center"
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} index={i} />
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {rating} / 5
        </div>
      </div>
      <div className="flex items-start gap-3">
        <textarea
          className="input-field flex-1 min-h-[80px] resize-y"
          placeholder="Share details of your experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary h-10 self-start"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
