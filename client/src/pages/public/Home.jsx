import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../../services/destinationService';
import DestinationCard from '../../components/cards/DestinationCard';
import {
  Compass,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TreePine,
  Landmark,
  Waves,
} from 'lucide-react';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestinations()
      .then((res) => {
        if (res.success) {
          // Show top 6 destinations on home page
          setDestinations(res.data.slice(0, 6));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-20 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Official Chhattisgarh Tourist Guide Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white font-heading">
            Discover Chhattisgarh with a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Local Guide
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Explore the waterfalls, dense forests, ancient heritage temples, and vibrant tribal culture of Chhattisgarh with certified, knowledgeable local guides.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/destinations"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Explore Destinations
            </Link>
            <Link
              to="/guides"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Find a Local Guide
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-slate-800">
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400 font-heading">44%+</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Forest Cover</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400 font-heading">30+</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Waterfalls</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400 font-heading">100%</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Verified Guides</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400 font-heading">52</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Tribal Communities</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Must-Visit Places
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Chhattisgarh Destinations
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Why Choose Us */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              The Chhattisgarh Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Explore with Our Local Guides?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Unlike generic travel apps, we connect you directly with native inhabitants of Bastar, Surguja, and Raipur who know every legend and forest trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Verified Local Guides</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guides are verified by admin with credentials, language capabilities, and police records.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Discover Hidden Places</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Access sacred groves, unmapped waterfall trails, and traditional weekly tribal haats safely.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Easy Guide Booking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose dates, number of people, send requests, and track confirmation status in real time.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Deep Cultural Heritage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Learn the authentic history of South Kosala, Nagavanshi kings, and tribal art like Bell Metal Dhokra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-base shadow-md">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Explore Spots</h3>
            <p className="text-xs text-slate-500">
              Browse popular destinations in Bastar, Surguja, Raipur, or Mahasamund.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-base shadow-md">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Choose a Guide</h3>
            <p className="text-xs text-slate-500">
              Filter by spoken language, budget, specialization, and real tourist ratings.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-base shadow-md">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Send Request</h3>
            <p className="text-xs text-slate-500">
              Select your travel dates, specify group size, and request confirmation.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-base shadow-md">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Experience CG</h3>
            <p className="text-xs text-slate-500">
              Meet your verified guide and immerse yourself in the natural paradise.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Become a Guide CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white uppercase tracking-wider inline-block">
              For Local Residents & Historians
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              Are you from Chhattisgarh? Become a Certified Guide
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-light">
              Share the culture of your homeland, meet travelers from all around the world, and earn a dignified livelihood on your own terms.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/register?role=guide"
              className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm shadow-xl hover:bg-emerald-50 transition"
            >
              Register as a Guide Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
