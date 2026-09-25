import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationDetails } from '../../services/destinationService';
import {
  MapPin,
  Calendar,
  Ticket,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Star,
  User,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DestinationDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getDestinationDetails(slug);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load destination details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading destination details...</p>
      </div>
    );
  }

  if (error || !data?.destination) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Destination Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This tourist place is not registered.'}</p>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Destinations
        </Link>
      </div>
    );
  }

  const { destination, localGuides } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <Link
        to="/destinations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Destinations
      </Link>

      {/* Hero Visual Card */}
      <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-slate-900">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
              {destination.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {destination.district} District
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            {destination.location}
          </p>
        </div>
      </div>

      {/* Highlights & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Background */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About this Destination</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>
          </div>

          {/* Practical Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Best Time To Visit
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {destination.bestTimeToVisit}
                </span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Entry Ticket Fee
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {destination.entryFee === 0 ? 'Free Entry' : `₹${destination.entryFee} per person`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Local Guides Recommendation */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Guides in {destination.district}</h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                {localGuides.length} Available
              </span>
            </div>

            {localGuides.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                <p>No verified guides currently active in {destination.district}.</p>
                <Link
                  to="/guides"
                  className="mt-2 inline-block font-semibold text-emerald-600 hover:underline"
                >
                  Browse all guides
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {localGuides.map((guide) => (
                  <div
                    key={guide._id}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={guide.user?.profileImage}
                        alt={guide.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div>
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition">
                          {guide.user?.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{guide.rating ? guide.rating.toFixed(1) : 'New'}</span>
                          <span className="text-slate-400 font-normal">({guide.experience} yrs exp)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-bold text-slate-900">
                        ₹{guide.pricePerDay}
                        <span className="text-[10px] text-slate-400 font-normal">/day</span>
                      </span>
                      <Link
                        to={`/guides/${guide._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 mt-0.5"
                      >
                        Profile <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={`/guides?location=${destination.district}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-700 transition shadow-sm"
            >
              <Compass className="w-4 h-4" />
              Find All Guides for {destination.district}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
