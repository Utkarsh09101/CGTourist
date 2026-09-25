import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGuides } from '../../services/guideService';
import GuideCard from '../../components/cards/GuideCard';
import {
  Search,
  MapPin,
  Languages,
  Award,
  Star,
  IndianRupee,
  SlidersHorizontal,
  Loader2,
  Users,
  RotateCcw,
} from 'lucide-react';

const LOCATIONS = ['All', 'Bastar', 'Raipur', 'Surguja', 'Dantewada', 'Mahasamund', 'Kabirdham', 'Baloda Bazar'];
const LANGUAGES = ['All', 'Hindi', 'Chhattisgarhi', 'English', 'Halbi'];
const SPECIALIZATIONS = [
  'All',
  'Waterfalls & Trekking',
  'Historical & Heritage',
  'Wildlife & Nature',
  'Cultural & Tribal',
  'Adventure',
];

export default function FindGuides() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || 'All');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  useEffect(() => {
    fetchGuides();
  }, [location, language, specialization, minRating, maxPrice, sort]);

  const fetchGuides = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        search,
        location,
        language,
        specialization,
        minRating,
        maxPrice,
        sort,
      };
      const res = await getGuides(filters);
      if (res.success) {
        setGuides(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch guides');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGuides();
  };

  const resetFilters = () => {
    setSearch('');
    setLocation('All');
    setLanguage('All');
    setSpecialization('All');
    setMinRating('');
    setMaxPrice('');
    setSort('rating');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Local Guide Discovery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Certified Guides in Chhattisgarh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Filter by district, local language, price per day, and real tourist ratings to choose the best companion for your journey.
        </p>
      </div>

      {/* Main Grid: Filters on Left, Guide Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter Guides
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Location / District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              District / Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Districts' : `${loc} District`}
                </option>
              ))}
            </select>
          </div>

          {/* Spoken Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Language Spoken
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'Any Language' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tour Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'All' ? 'All Specialties' : spec}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'All', val: '' },
                { label: '4.0+ ★', val: '4.0' },
                { label: '4.5+ ★', val: '4.5' },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  className={`py-1.5 rounded-lg border text-center font-medium transition ${
                    minRating === r.val
                      ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Max Daily Rate
              </label>
              <span className="text-xs font-bold text-emerald-600">
                {maxPrice ? `₹${maxPrice}` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="3500"
              step="200"
              value={maxPrice || 3500}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1,000</span>
              <span>₹3,500</span>
            </div>
          </div>
        </div>

        {/* Right Content: Search & Guides Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Search & Sort Row */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guide by name or keyword..."
                className="w-full pl-10 pr-20 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition"
              >
                Search
              </button>
            </form>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-slate-400">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer font-medium"
              >
                <option value="rating">Highest Rated</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              Showing <strong className="text-slate-800">{guides.length}</strong> verified local guides
            </span>
          </div>

          {/* Guides Grid / Loading / Empty State */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading verified guides...</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No guides found</h3>
              <p className="text-xs text-slate-500">
                No tourist guides matched your selected filters. Try broadening your criteria or reset the filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <GuideCard key={guide._id} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
