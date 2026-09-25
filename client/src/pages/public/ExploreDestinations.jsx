import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDestinations } from '../../services/destinationService';
import DestinationCard from '../../components/cards/DestinationCard';
import { Search, MapPin, Filter, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Waterfall', 'Wildlife', 'Historical', 'Nature', 'Adventure', 'Religious'];
const DISTRICTS = ['All', 'Bastar', 'Mahasamund', 'Kabirdham', 'Baloda Bazar', 'Surguja', 'Dantewada', 'Raipur'];

export default function ExploreDestinations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters from query params or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'All');

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory, selectedDistrict]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        search,
        category: selectedCategory,
        district: selectedDistrict,
      };
      const res = await getDestinations(filters);
      if (res.success) {
        setDestinations(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handleDistrictChange = (e) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    const newParams = new URLSearchParams(searchParams);
    if (dist === 'All') newParams.delete('district');
    else newParams.set('district', dist);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Chhattisgarh Tourism Explorer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Tourist Destinations in Chhattisgarh
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          From the thundering waters of Chitrakote to the ancient temples of Sirpur and Bhoramdeo, discover scenic treasures and historical monuments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by spot name, keywords (e.g. Chitrakote, caves, temple)..."
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Search
            </button>
          </form>

          {/* District Dropdown Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              <option value="All">All Districts of CG</option>
              {DISTRICTS.filter((d) => d !== 'All').map((dist) => (
                <option key={dist} value={dist}>
                  {dist} District
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid or States */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Discovering Chhattisgarh destinations...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
          <p className="font-semibold text-sm">{error}</p>
          <button
            onClick={fetchDestinations}
            className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-medium hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
          <p className="text-xs text-slate-500">
            No attractions matched your filter criteria. Try selecting another category or clearing your search.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedDistrict('All');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
