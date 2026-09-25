import React, { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminGuides,
  toggleGuideVerification,
  getAdminReviews,
  deleteAdminReview,
} from '../../services/adminService';
import { getDestinations, deleteDestination } from '../../services/destinationService';
import AddDestinationModal from '../../components/modals/AddDestinationModal';
import {
  LayoutDashboard,
  Users,
  Compass,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Star,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Search,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [addDestModalOpen, setAddDestModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, dRes, gRes, uRes, rRes] = await Promise.all([
        getAdminStats(),
        getDestinations(),
        getAdminGuides(),
        getAdminUsers(),
        getAdminReviews(),
      ]);

      if (sRes.success) setStats(sRes.data);
      if (dRes.success) setDestinations(dRes.data);
      if (gRes.success) setGuides(gRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (rRes.success) setReviews(rRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Guide verification toggle
  const handleToggleGuideVerify = async (guideId) => {
    try {
      const res = await toggleGuideVerification(guideId);
      if (res.success) {
        setGuides(
          guides.map((g) => (g._id === guideId ? { ...g, isVerified: !g.isVerified } : g))
        );
      }
    } catch (err) {
      alert('Failed to update guide verification status');
    }
  };

  // Destination delete
  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to remove this destination?')) return;
    try {
      const res = await deleteDestination(id);
      if (res.success) {
        setDestinations(destinations.filter((d) => d._id !== id));
      }
    } catch (err) {
      alert('Failed to delete destination');
    }
  };

  // User delete
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their records?')) return;
    try {
      const res = await deleteAdminUser(id);
      if (res.success) {
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Review delete
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this inappropriate review? Guide rating will be recalculated.')) return;
    try {
      const res = await deleteAdminReview(id);
      if (res.success) {
        setReviews(reviews.filter((r) => r._id !== id));
        // refresh guide stats
        const gRes = await getAdminGuides();
        if (gRes.success) setGuides(gRes.data);
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredUsers = userSearch
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    : users;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading admin control center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            State Tourism Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chhattisgarh Platform Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor platform usage, manage destinations, verify local guides, and moderate content
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            System Live
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
          { id: 'destinations', label: `Destinations (${destinations.length})`, icon: MapPin },
          { id: 'guides', label: `Guides (${guides.length})`, icon: Compass },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Tourists
              </span>
              <span className="text-3xl font-black text-slate-900">
                {stats?.counts?.totalUsers || 0}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Local Guides
              </span>
              <span className="text-3xl font-black text-emerald-600">
                {stats?.counts?.totalGuides || 0}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Destinations
              </span>
              <span className="text-3xl font-black text-slate-900">
                {stats?.counts?.totalDestinations || 0}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Tour Requests
              </span>
              <span className="text-3xl font-black text-indigo-600">
                {stats?.counts?.totalRequests || 0}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Reviews
              </span>
              <span className="text-3xl font-black text-amber-500">
                {stats?.counts?.totalReviews || 0}
              </span>
            </div>
          </div>

          {/* Request Status Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-800 font-bold block">Pending Requests</span>
                <span className="text-2xl font-black text-amber-900">
                  {stats?.requestStatus?.pending || 0}
                </span>
              </div>
              <Clock className="w-8 h-8 text-amber-500/50" />
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-800 font-bold block">Confirmed Tours</span>
                <span className="text-2xl font-black text-blue-900">
                  {stats?.requestStatus?.accepted || 0}
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500/50" />
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold block">Completed Tours</span>
                <span className="text-2xl font-black text-emerald-900">
                  {stats?.requestStatus?.completed || 0}
                </span>
              </div>
              <Star className="w-8 h-8 text-emerald-500/50" />
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-800 font-bold block">Declined Requests</span>
                <span className="text-2xl font-black text-rose-900">
                  {stats?.requestStatus?.rejected || 0}
                </span>
              </div>
              <XCircle className="w-8 h-8 text-rose-500/50" />
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Recent Booking Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5">Tourist</th>
                    <th className="py-2.5">Destination</th>
                    <th className="py-2.5">Assigned Guide</th>
                    <th className="py-2.5">Tour Date</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentRequests?.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="py-3 font-semibold text-slate-900">{r.tourist?.name}</td>
                      <td className="py-3 text-emerald-700 font-medium">{r.destination?.name}</td>
                      <td className="py-3 text-slate-600">{r.guide?.user?.name || 'Guide'}</td>
                      <td className="py-3 text-slate-500">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : r.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE DESTINATIONS */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chhattisgarh Destinations Catalog</h2>
              <p className="text-xs text-slate-500">Manage attractions, ticket fees, and image showcases</p>
            </div>
            <button
              onClick={() => setAddDestModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Destination
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Name & Slug</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Entry Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{dest.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/{dest.slug}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{dest.district}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {dest.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {dest.entryFee === 0 ? 'Free' : `₹${dest.entryFee}`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDestination(dest._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Delete destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE GUIDES */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered Local Guides</h2>
            <p className="text-xs text-slate-500">
              Verify local guides to display the official State Tourism Badge on their profile
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Guide</th>
                    <th className="py-3 px-4">Districts Served</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Daily Rate</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-center">Verified Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guides.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={g.user?.profileImage}
                            alt={g.user?.name}
                            className="w-10 h-10 rounded-xl object-cover border"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{g.user?.name}</span>
                            <span className="text-[10px] text-slate-400">{g.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {g.locationsServed?.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{g.experience} Years</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{g.pricePerDay}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {g.rating ? g.rating.toFixed(1) : 'New'} ({g.reviewCount})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleGuideVerify(g._id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 mx-auto ${
                            g.isVerified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                          title="Click to toggle verification status"
                        >
                          {g.isVerified ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Verified
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" /> Unverified
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">All Registered Accounts</h2>
              <p className="text-xs text-slate-500">Manage tourists, guides, and administrator profiles</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800'
                              : u.role === 'guide'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MODERATE REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Review Moderation</h2>
            <p className="text-xs text-slate-500">
              Remove spam, offensive comments, or inappropriate reviews
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tourist</th>
                    <th className="py-3 px-4">Guide</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Comment</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map((rev) => (
                    <tr key={rev._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {rev.tourist?.name}
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-700">
                        {rev.guide?.user?.name || 'Guide'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm truncate italic">
                        "{rev.comment}"
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Remove review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      <AddDestinationModal
        isOpen={addDestModalOpen}
        onClose={() => setAddDestModalOpen(false)}
        onDestinationAdded={(newDest) => setDestinations([newDest, ...destinations])}
      />
    </div>
  );
}
