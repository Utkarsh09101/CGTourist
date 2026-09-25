import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGuideDetails } from '../../services/guideService';
import RequestGuideModal from '../../components/modals/RequestGuideModal';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  ShieldCheck,
  MapPin,
  Languages,
  Award,
  Calendar,
  IndianRupee,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Compass,
} from 'lucide-react';

export default function GuideDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      try {
        const res = await getGuideDetails(id);
        if (res.success) {
          setGuideData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load guide profile');
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading guide profile...</p>
      </div>
    );
  }

  if (error || !guideData?.guide) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Guide Profile Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This guide does not exist.'}</p>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guide Directory
        </Link>
      </div>
    );
  }

  const { guide, reviews } = guideData;
  const guideUser = guide.user || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <Link
        to="/guides"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Guides
      </Link>

      {/* Guide Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={guideUser.profileImage}
              alt={guideUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-400 shadow-md"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {guide.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                <ShieldCheck className="w-5 h-5 fill-white text-emerald-600" />
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {guideUser.name}
              </h1>
              {guide.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Verified Guide
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{guide.rating > 0 ? guide.rating.toFixed(1) : 'New'}</span>
                <span className="text-slate-400 font-normal">
                  ({guide.reviewCount} {guide.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <span className="font-medium text-slate-700">{guide.experience} Years Field Experience</span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {guide.locationsServed?.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* CTA in header */}
        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider md:text-right">
              Guide Fee
            </span>
            <span className="text-2xl font-black text-slate-900">
              ₹{guide.pricePerDay}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Request Guide
          </button>
        </div>
      </div>

      {/* Main Grid: Info on Left, Booking Box on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About {guideUser.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {guide.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Languages */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-emerald-600" /> Languages Spoken
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.languages?.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" /> Tour Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.specializations?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg text-xs font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Verified Tourist Reviews</h3>
              </div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {guide.rating ? guide.rating.toFixed(1) : 'New'} ({reviews?.length || 0})
              </span>
            </div>

            {reviews?.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No reviews yet for this guide. Be the first tourist to complete a tour with {guideUser.name}!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.tourist?.profileImage}
                          alt={rev.tourist?.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">
                            {rev.tourist?.name}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Booking Card & Security */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900">Guide Availability</h3>

            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${guide.availability ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="font-semibold text-slate-700">
                {guide.availability ? 'Available for Tours' : 'Currently Unavailable'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Daily Rate:</span>
                <span className="font-bold text-slate-900">₹{guide.pricePerDay}</span>
              </div>
              <div className="flex justify-between">
                <span>Locations:</span>
                <span className="font-semibold text-slate-700">{guide.locationsServed?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <span className="font-semibold text-emerald-700">State Verified</span>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Guide for a Tour
            </button>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Zero upfront commission charged</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Guide confirms booking on their dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <RequestGuideModal
        guide={guide}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
