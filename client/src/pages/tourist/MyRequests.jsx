import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTouristRequests, updateRequestStatus } from '../../services/requestService';
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Loader2,
  Compass,
} from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getTouristRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your guide requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending tour request?')) return;
    try {
      const res = await updateRequestStatus(id, 'cancelled');
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const filteredRequests =
    filter === 'all'
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Awaiting Confirmation
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Accepted by Guide
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tour Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Tourist Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Guide Booking Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track confirmation status and contact information for your booked tours
          </p>
        </div>

        <Link
          to="/guides"
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition shadow-sm flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4" />
          Browse More Guides
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'pending', 'accepted', 'completed', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading your requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-500">
            You don't have any guide bookings in this category yet.
          </p>
          <Link
            to="/guides"
            className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
          >
            Find a Guide
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-300 transition"
            >
              {/* Destination & Guide Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={req.destination?.image}
                  alt={req.destination?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-100 shrink-0"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">
                      {req.destination?.name}
                    </h3>
                    {getStatusBadge(req.status)}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{req.destination?.district} District</span>
                    <span className="text-slate-300">&bull;</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {new Date(req.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.numberOfPeople} Tourists</span>
                  </p>

                  {/* Guide snippet */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <img
                      src={req.guide?.user?.profileImage}
                      alt={req.guide?.user?.name}
                      className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Guide: <strong className="text-slate-900">{req.guide?.user?.name}</strong> (₹{req.guide?.pricePerDay}/day)
                    </span>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg max-w-lg">
                      "{req.message}"
                    </p>
                  )}

                  {/* Contact Info (unlocked if accepted or completed) */}
                  {['accepted', 'completed'].includes(req.status) && req.guide?.user?.phone && (
                    <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {req.guide.user.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        {req.guide.user.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                {req.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-medium hover:bg-rose-50 transition cursor-pointer"
                  >
                    Cancel Request
                  </button>
                )}

                {req.status === 'completed' && (
                  <div>
                    {req.isReviewed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        Review Submitted
                      </span>
                    ) : (
                      <Link
                        to={`/tourist/write-review/${req._id}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Write a Review
                      </Link>
                    )}
                  </div>
                )}

                <Link
                  to={`/guides/${req.guide?._id}`}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium underline"
                >
                  View Guide Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
