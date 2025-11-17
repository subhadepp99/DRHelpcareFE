"use client";

import { useState, useEffect } from "react";
import { Star, Send, Edit2, Trash2, User } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewSection({ entityType, entityId, entityName }) {
  const { get, post, put, del } = useApi();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [entityId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await get(`/reviews/${entityType}/${entityId}`);
      if (response.data?.success) {
        setReviews(response.data.data.reviews || []);
        setStats(
          response.data.data.stats || { averageRating: 0, totalReviews: 0 }
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await get(`/reviews/user/${entityType}/${entityId}`);
      if (response.data?.success && response.data.data) {
        setUserReview(response.data.data);
        setRating(response.data.data.rating);
        setComment(response.data.data.comment);
      }
    } catch (error) {
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    setSubmitting(true);

    try {
      if (editMode && userReview) {
        // Update existing review
        const response = await put(`/reviews/${userReview._id}`, {
          rating,
          comment,
        });
        if (response.data?.success) {
          toast.success("Review updated successfully!");
          setEditMode(false);
          setShowReviewForm(false);
          fetchReviews();
          fetchUserReview();
        }
      } else {
        // Create new review
        const response = await post("/reviews", {
          entityType,
          entityId,
          rating,
          comment,
        });
        if (response.data?.success) {
          toast.success("Review submitted successfully!");
          setShowReviewForm(false);
          setComment("");
          setRating(5);
          fetchReviews();
          fetchUserReview();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = () => {
    setEditMode(true);
    setShowReviewForm(true);
    setRating(userReview.rating);
    setComment(userReview.comment);
  };

  const handleDeleteReview = async () => {
    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      const response = await del(`/reviews/${userReview._id}`);
      if (response.data?.success) {
        toast.success("Review deleted successfully!");
        setUserReview(null);
        setRating(5);
        setComment("");
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const StarRating = ({ value, onChange, readonly = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            className={`focus:outline-none ${
              !readonly ? "cursor-pointer" : "cursor-default"
            }`}
            disabled={readonly}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (readonly ? value : hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ratings & Reviews
        </h2>
        <div className="flex items-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating value={Math.round(stats.averageRating)} readonly />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stats.totalReviews}{" "}
              {stats.totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        {user && !userReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Write a Review
          </button>
        )}

        {/* User's Existing Review */}
        {user && userReview && !showReviewForm && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Your Review
                </div>
                <StarRating value={userReview.rating} readonly />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditReview}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {userReview.comment && (
              <p className="text-gray-700 dark:text-gray-300">
                {userReview.comment}
              </p>
            )}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={`Share your experience with ${entityName}... (Optional)`}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {comment.length}/1000 characters
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitting
                    ? "Submitting..."
                    : editMode
                    ? "Update Review"
                    : "Submit Review"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditMode(false);
                  if (userReview) {
                    setRating(userReview.rating);
                    setComment(userReview.comment);
                  } else {
                    setRating(5);
                    setComment("");
                  }
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <StarRating value={review.rating} readonly />
              </div>
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
