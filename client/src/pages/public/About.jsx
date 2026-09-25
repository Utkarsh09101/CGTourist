import React from 'react';
import { Compass, MapPin, Award, Users, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          About the Initiative
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Chhattisgarh Tourism & Local Communities
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-600 leading-relaxed">
          Chhattisgarh, formed in the year 2000, is one of India's richest states in terms of bio-diversity, ancient archaeological marvels, and indigenous tribal traditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Our Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            To provide tourists with reliable, verified, and friendly local guides while giving tribal and local youth a direct digital platform for sustainable tourism employment.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified & Safe</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every tourist guide on our platform is evaluated, verified, and reviewed only after legitimate completed tours to guarantee visitor safety and satisfaction.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Cultural Respect</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We honor the unique customs of Gond, Maria, Muria, and Baiga communities, ensuring tourism fosters mutual respect without commercial exploitation.
          </p>
        </div>
      </div>
    </div>
  );
}
