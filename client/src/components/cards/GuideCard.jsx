import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Languages, Award, ArrowRight } from 'lucide-react';

export default function GuideCard({ guide }) {
  const user = guide.user || {};

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        {/* Top: Avatar, Name, Rating & Verified */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {guide.isVerified && (
              <span
                title="Verified Chhattisgarh Tourist Guide"
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md"
              >
                <ShieldCheck className="w-4 h-4 fill-white text-emerald-600" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                {user.name}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-0.5">
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{guide.rating > 0 ? guide.rating.toFixed(1) : 'New'}</span>
              </div>
              <span className="text-slate-400 font-normal">
                ({guide.reviewCount} {guide.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500 font-medium">{guide.experience} yrs exp</span>
            </div>

            {/* Locations Served */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{guide.locationsServed?.join(', ') || 'Chhattisgarh'}</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {guide.bio}
        </p>

        {/* Specialization Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {guide.specializations?.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Spoken Languages */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{guide.languages?.join(', ')}</span>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
            Daily Guide Rate
          </span>
          <span className="text-base font-extrabold text-slate-900">
            ₹{guide.pricePerDay}
            <span className="text-xs text-slate-400 font-normal"> / day</span>
          </span>
        </div>

        <Link
          to={`/guides/${guide._id}`}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition shadow-sm"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
