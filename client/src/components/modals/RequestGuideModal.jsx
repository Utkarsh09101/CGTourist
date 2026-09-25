import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDestinations } from '../../services/destinationService';
import { createGuideRequest } from '../../services/requestService';
import {
  X,
  Calendar,
  Users,
  MapPin,
  MessageSquare,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';

export default function RequestGuideModal({ guide, initialDestinationId, isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState(initialDestinationId || '');
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      // Fetch destinations for the dropdown
      getDestinations()
        .then((res) => {
          if (res.success) {
            setDestinations(res.data);
            if (!destinationId && res.data.length > 0) {
              setDestinationId(res.data[0]._id);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Minimum date today (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'tourist') {
      setError('Only registered tourists can send guide booking requests.');
      return;
    }

    if (!destinationId || !date) {
      setError('Please select a destination and valid tour date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createGuideRequest({
        guideId: guide._id,
        destinationId,
        date,
        numberOfPeople: Number(numberOfPeople),
        message,
      });

      if (res.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Request Sent Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your tour request has been delivered to <span className="font-semibold text-slate-700">{guide.user?.name}</span>. You can monitor the confirmation status in your dashboard.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/tourist/requests"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
              >
                View My Requests
              </Link>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Book a Local Guide
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Request {guide.user?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Rate: <span className="font-semibold text-slate-700">₹{guide.pricePerDay}/day</span> &bull; {guide.experience} Years Experience
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Destination Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Destination *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
                  >
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.district} District)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Group size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tour Date *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    No. of People
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Special Requirements
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. We want to visit tribal weekly markets and photograph Chitrakote waterfall at sunset..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-slate-700"
                  ></textarea>
                </div>
              </div>

              {/* Price estimate notice */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs flex items-center justify-between text-emerald-900">
                <span className="font-medium">Estimated Daily Guide Fee:</span>
                <span className="font-extrabold text-sm text-emerald-700">₹{guide.pricePerDay}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request to Guide
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
