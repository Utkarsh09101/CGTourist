import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Ticket, ArrowRight } from 'lucide-react';

const categoryColors = {
  Waterfall: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  Wildlife: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Historical: 'bg-amber-50 text-amber-800 border-amber-200/80',
  Religious: 'bg-purple-50 text-purple-700 border-purple-200/80',
  Adventure: 'bg-orange-50 text-orange-700 border-orange-200/80',
  Nature: 'bg-teal-50 text-teal-700 border-teal-200/80',
  Cultural: 'bg-rose-50 text-rose-700 border-rose-200/80',
};

export default function DestinationCard({ destination }) {
  const badgeClass =
    categoryColors[destination.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Category Pill */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-sm ${badgeClass}`}
        >
          {destination.category}
        </span>
        {/* District Tag */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
          <MapPin className="w-3 h-3 text-emerald-400" />
          {destination.district}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
            {destination.name}
          </h3>
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Info Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{destination.bestTimeToVisit}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Ticket className="w-3.5 h-3.5 text-emerald-600" />
              <span>{destination.entryFee === 0 ? 'Free Entry' : `₹${destination.entryFee}`}</span>
            </span>
          </div>

          <Link
            to={`/destinations/${destination.slug}`}
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition"
          >
            Explore Spot & Guides
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
