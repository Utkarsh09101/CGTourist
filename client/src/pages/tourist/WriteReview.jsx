import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTouristRequests } from '../../services/requestService';
import { createReview } from '../../services/reviewService';
import {
  Star,
  MapPin,
  Calendar,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const RATING_LABELS = {
  1: '1 Star - Poor Experience',
  2: '2 Stars - Fair Experience',
  3: '3 Stars - Good & Informative',
  4: '4 Stars - Very Good & Professional',
  5: '5 Stars - Outstanding & Memorable!',
};

export default function WriteReview() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchTargetRequest = async () => {
      setLoading(true);
      try {
        const res = await getTouristRequests();
        if (res.success) {
          const found = res.data.find((r) => r._id === requestId);
          if (!found) {
            setError('Booking request not found or not belonging to you.');
          } else if (found.status !== 'completed') {
            setError('You can only review a tour after it has been marked as completed.');
          } else if (found.isReviewed) {
            setError('You have already submitted a review for this tour.');
          } else {
            setRequest(found);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not verify booking request');
      } finally {
        setLoading(false);
      }
    };

    fetchTargetRequest();
  }, [requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter a short comment about your experience with the guide.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview({
        requestId,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/tourist/requests');
        }, 1800);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <p className="text-xs text-slate-400">Loading tour details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Cannot Review Tour</h3>
        <p className="text-xs text-slate-500">{error}</p>
        <Link
          to="/tourist/requests"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/tourist/requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Requests
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Header Summary */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <img
            src={request.guide?.user?.profileImage}
            alt={request.guide?.user?.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
              Rate Your Tour Experience
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {request.guide?.user?.name}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{request.destination?.name}</span>
              <span>&bull;</span>
              <span>
                {new Date(request.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        {submitSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Review Submitted!</h3>
            <p className="text-xs text-slate-500">
              Thank you for supporting Chhattisgarh local tourism. Redirecting back to your requests...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Interactive Stars */}
            <div className="space-y-2 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">
                How would you rate your guide's guidance and hospitality?
              </span>

              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(rating)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        starVal <= hoverRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="inline-block px-3 py-1 bg-amber-100/70 text-amber-900 rounded-full text-xs font-bold">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Detailed Feedback</span>
                <span className="text-[11px] font-normal text-slate-400">
                  {comment.length} / 500 characters
                </span>
              </label>
              <textarea
                rows={4}
                required
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like about the tour? Did the guide explain local legends, nature, or tribal traditions well? Would you recommend them to other tourists?"
                className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700 resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Review...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Verified Review
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
