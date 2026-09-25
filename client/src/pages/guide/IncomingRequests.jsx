import React, { useState, useEffect } from 'react';
import { getGuideRequests, updateRequestStatus } from '../../services/requestService';
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
  Loader2,
  Check,
  X,
  Compass,
} from 'lucide-react';

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getGuideRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load incoming requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await updateRequestStatus(id, status);
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests =
    filter === 'all'
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div>
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Guide Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Incoming Tourist Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, accept, or complete guided tour requests from travelers
        </p>
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
          <p className="text-xs text-slate-400">Loading incoming requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No requests in this category</h3>
          <p className="text-xs text-slate-500">
            When tourists book a tour with you, their requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-300 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={req.tourist?.profileImage}
                  alt={req.tourist?.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-emerald-400 shrink-0"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                  }}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{req.tourist?.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {req.destination?.name} ({req.destination?.district})
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(req.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      {req.numberOfPeople} People
                    </span>
                  </p>

                  {/* Tourist Contact Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    {req.tourist?.phone && (
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600" /> {req.tourist.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-emerald-600" /> {req.tourist?.email}
                    </span>
                  </div>

                  {/* Message from tourist */}
                  {req.message && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-lg mt-2">
                      "{req.message}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                {req.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(req._id, 'accepted')}
                      disabled={actionLoading === req._id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, 'rejected')}
                      disabled={actionLoading === req._id}
                      className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange(req._id, 'completed')}
                    disabled={actionLoading === req._id}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mark Tour Completed
                  </button>
                )}

                {req.status === 'completed' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tour Finished
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
