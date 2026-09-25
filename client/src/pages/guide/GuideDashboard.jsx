import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyGuideProfile, updateGuideProfile } from '../../services/guideService';
import { getGuideRequests, updateRequestStatus } from '../../services/requestService';
import {
  ShieldCheck,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  IndianRupee,
  MapPin,
  Save,
  Loader2,
  Check,
  X,
  Languages,
  Award,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function GuideDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [bio, setBio] = useState('');
  const [pricePerDay, setPricePerDay] = useState(1500);
  const [experience, setExperience] = useState(1);
  const [languages, setLanguages] = useState('');
  const [locationsServed, setLocationsServed] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [availability, setAvailability] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState('');

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    setLoading(true);
    try {
      const [profRes, reqRes] = await Promise.all([
        getMyGuideProfile(),
        getGuideRequests(),
      ]);

      if (profRes.success && profRes.data) {
        const p = profRes.data;
        setProfile(p);
        setBio(p.bio || '');
        setPricePerDay(p.pricePerDay || 1500);
        setExperience(p.experience || 1);
        setLanguages(p.languages ? p.languages.join(', ') : '');
        setLocationsServed(p.locationsServed ? p.locationsServed.join(', ') : '');
        setSpecializations(p.specializations ? p.specializations.join(', ') : '');
        setAvailability(p.availability !== undefined ? p.availability : true);
      }

      if (reqRes.success) {
        setRequests(reqRes.data);
      }
    } catch (err) {
      console.error('Error loading guide data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    const newStatus = !availability;
    setAvailability(newStatus);
    try {
      await updateGuideProfile({ availability: newStatus });
    } catch (err) {
      alert('Failed to update availability status');
      setAvailability(!newStatus);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback('');

    try {
      const res = await updateGuideProfile({
        bio,
        pricePerDay: Number(pricePerDay),
        experience: Number(experience),
        languages: languages.split(',').map((s) => s.trim()),
        locationsServed: locationsServed.split(',').map((s) => s.trim()),
        specializations: specializations.split(',').map((s) => s.trim()),
        availability,
      });

      if (res.success) {
        setProfile(res.data);
        setProfileFeedback('Profile details & rate saved successfully!');
        setTimeout(() => setProfileFeedback(''), 3000);
      }
    } catch (err) {
      setProfileFeedback('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateRequestStatus(id, status);
      if (res.success) {
        // Refresh requests
        const fresh = await getGuideRequests();
        if (fresh.success) setRequests(fresh.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');
  const completedRequests = requests.filter((r) => r.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <p className="text-xs text-slate-400">Loading guide dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner with Availability Switch */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-heading">{user?.name}</h1>
              {profile?.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official Chhattisgarh Local Guide Portal &bull; {profile?.experience || 1} Years Experience
            </p>
          </div>
        </div>

        {/* Live Availability Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Booking Status
            </span>
            <span className={`text-xs font-bold ${availability ? 'text-emerald-400' : 'text-rose-400'}`}>
              {availability ? 'Available for Tours' : 'Offline / Busy'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleAvailability}
            className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
          >
            {availability ? (
              <ToggleRight className="w-9 h-9 text-emerald-500 fill-emerald-500/20" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            {profile?.rating ? profile.rating.toFixed(1) : 'New'}
          </span>
          <span className="block text-[10px] text-slate-400 mt-1">({profile?.reviewCount || 0} reviews)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Requests</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{requests.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-amber-600">{pendingRequests.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600">{completedRequests.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Daily Rate</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">₹{profile?.pricePerDay}</span>
          <span className="block text-[10px] text-slate-400 mt-1">per day tour</span>
        </div>
      </div>

      {/* Main Grid: Incoming Requests on Left, Manage Profile Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Incoming Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Incoming Tourist Bookings</h2>
            <Link
              to="/guide/requests"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All ({requests.length}) &rarr;
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
              <Calendar className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-500">No booking requests received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={req.tourist?.profileImage}
                      alt={req.tourist?.name}
                      className="w-12 h-12 rounded-xl object-cover border"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{req.tourist?.name}</h4>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : req.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        <strong className="text-emerald-700">{req.destination?.name}</strong> &bull;{' '}
                        {new Date(req.date).toLocaleDateString()} &bull; {req.numberOfPeople} People
                      </p>
                      {req.message && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-1">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="shrink-0 flex items-center gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req._id, 'accepted')}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'rejected')}
                          className="px-2.5 py-1.5 border border-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-50 transition"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(req._id, 'completed')}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition"
                      >
                        Complete Tour
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Manage Profile Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Manage Guide Profile & Pricing
          </h3>

          {profileFeedback && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200">
              {profileFeedback}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Daily Rate (₹)
                </label>
                <input
                  type="number"
                  required
                  min="200"
                  max="10000"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Experience (Yrs)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bio & Experience Story
              </label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Languages Spoken (comma separated)
              </label>
              <input
                type="text"
                required
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="Hindi, Chhattisgarhi, English, Halbi"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Locations Served (comma separated)
              </label>
              <input
                type="text"
                required
                value={locationsServed}
                onChange={(e) => setLocationsServed(e.target.value)}
                placeholder="Bastar, Dantewada, Jagdalpur"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Specialties (comma separated)
              </label>
              <input
                type="text"
                required
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="Waterfalls, Caves, Tribal Culture"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Profile Updates
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
