import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Shield, Users, Store, Star, LogOut, Loader2, AlertCircle,
  CheckCircle2, PlusCircle, Search, ArrowUpDown, ChevronDown, Eye, Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  // App tabs: 'stats' | 'provision' | 'users' | 'stores'
  const [activeTab, setActiveTab] = useState('stats');

  // Loaders & Errors
  const [statsLoading, setStatsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Stats Data
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  // Provisioning Form States
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

  // Listings Data
  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);

  // Search, Filter & Sort States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortField, setUserSortField] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('asc'); // 'asc' | 'desc'

  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortField, setStoreSortField] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Selected User for Detail View Modal
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform metrics.');
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Users List
  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const params = {
        search: userSearch,
        role: userRoleFilter,
        sort: userSortField,
        order: userSortOrder
      };
      const res = await API.get('/admin/users', { params });
      if (res.data?.success) {
        setUsersList(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load user listing.');
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch Stores List
  const fetchStores = async () => {
    setDataLoading(true);
    try {
      const params = {
        search: storeSearch,
        sort: storeSortField,
        order: storeSortOrder
      };
      const res = await API.get('/admin/stores', { params });
      if (res.data?.success) {
        setStoresList(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load store listing.');
    } finally {
      setDataLoading(false);
    }
  };

  // Initial loading trigger
  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
    }
  }, [activeTab, userSearch, userRoleFilter, userSortField, userSortOrder, storeSearch, storeSortField, storeSortOrder]);

  const showFeedback = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(msg);
      setError('');
      setTimeout(() => setSuccess(''), 4500);
    } else {
      setError(msg);
      setSuccess('');
      setTimeout(() => setError(''), 4500);
    }
  };

  // User Provisioning Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { name, email, password, address, role } = userForm;
    if (!name || !email || !password || !address || !role) {
      showFeedback('All user profile parameters are required.', false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/admin/users', userForm);
      showFeedback(`Account created successfully! User ID: ${res.data?.data?.id || 'Allocated'}`);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'USER' });
    } catch (err) {
      console.error(err);
      const errors = err.response?.data?.errors;
      const errorMsg = Array.isArray(errors) ? errors.join(' ') : err.response?.data?.message || 'Failed to provision user.';
      showFeedback(errorMsg, false);
    } finally {
      setSubmitting(false);
    }
  };

  // Store Provisioning Handler
  const handleCreateStore = async (e) => {
    e.preventDefault();
    const { name, email, address, ownerId } = storeForm;
    if (!name || !email || !address || !ownerId) {
      showFeedback('All store properties are required.', false);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...storeForm, ownerId: parseInt(ownerId, 10) };
      await API.post('/admin/stores', payload);
      showFeedback(`"${name}" has been registered successfully!`);
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      console.error(err);
      showFeedback(err.response?.data?.message || 'Failed to register store.', false);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle sorting logic
  const handleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  const handleStoreSort = (field) => {
    if (storeSortField === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortOrder('asc');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-sans">
      {/* Cyber Grid & Ambient Blur Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-0 left-[50%] -translate-x-[50%] h-[350px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] h-[250px] w-[250px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

      <div className="relative flex min-h-screen z-10">
        {/* Dynamic Sidebar Control Module */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/40 backdrop-blur-md p-6 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 px-2 pb-6 border-b border-slate-850">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-2 text-white shadow-lg shadow-indigo-500/15">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">ADMIN CONTROL</span>
            </div>

            <nav className="mt-6 space-y-1.5">
              <button
                onClick={() => { setActiveTab('stats'); setError(''); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'stats' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800'
                }`}
              >
                <Users className="h-4.5 w-4.5 text-cyan-400" /> Platform Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('provision'); setError(''); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'provision' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800'
                }`}
              >
                <PlusCircle className="h-4.5 w-4.5 text-cyan-400" /> Provision Store / Users
              </button>
              <button
                onClick={() => { setActiveTab('users'); setError(''); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'users' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800'
                }`}
              >
                <Users className="h-4.5 w-4.5 text-cyan-400" /> Users Registry
              </button>
              <button
                onClick={() => { setActiveTab('stores'); setError(''); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'stores' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800'
                }`}
              >
                <Store className="h-4.5 w-4.5 text-cyan-400" /> Stores Directory
              </button>
            </nav>
          </div>

          <div className="border-t border-slate-850 pt-4">
            <div className="px-3 py-3 mb-3 bg-slate-900/60 border border-slate-850 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
              <p className="text-xs font-black truncate text-slate-200 mt-1">{user?.name}</p>
              <span className="inline-flex items-center mt-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-black text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.05)] uppercase tracking-wider">
                Platform Admin
              </span>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/20 transition-all cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Workspace Frame */}
        <main className="flex-1 p-10 overflow-y-auto">
          
          {/* Banner Alert Prompts */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-400 animate-in fade-in duration-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-sm font-semibold text-red-400 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <p>{error}</p>
            </div>
          )}

          {/* 1. Tab: Dashboard Performance Stats */}
          {activeTab === 'stats' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200">System Performance Hub</h1>
                <p className="mt-1 text-xs text-slate-450 font-bold uppercase tracking-wider">Verify overall usage stats and ecosystem operations in real time.</p>
              </div>

              {statsLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400">Total Provisioned Users</span>
                      <div className="rounded-xl bg-indigo-500/10 p-2 text-cyan-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)]">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-black tracking-tight text-slate-100">{stats.totalUsers}</span>
                      <span className="text-xs font-bold text-slate-500">members</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400">Total Registered Stores</span>
                      <div className="rounded-xl bg-indigo-500/10 p-2 text-cyan-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)]">
                        <Store className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-black tracking-tight text-slate-100">{stats.totalStores}</span>
                      <span className="text-xs font-bold text-slate-500">establishments</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400">Total Ratings Submitted</span>
                      <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                        <Star className="h-5 w-5 fill-current" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-black tracking-tight text-slate-100">{stats.totalRatings}</span>
                      <span className="text-xs font-bold text-slate-500">reviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Tab: Provisioning & Node Allocation */}
          {activeTab === 'provision' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-in fade-in duration-300">
              
              {/* Form: Create User (Admin, Store Owner, Normal User) */}
              <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-8 shadow-md hover:border-indigo-500/30 transition-all duration-350">
                <h2 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-200 mb-2">Provision System User</h2>
                <p className="text-xs text-slate-400 mb-6">Create global login credentials configured with specific authorization roles.</p>
                
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Enter name (min 20 characters)"
                      className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                    />
                    <p className="mt-1 text-[10px] text-slate-500 font-medium">Must be between 20 and 60 characters.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="block w-full rounded-lg border border-slate-800 bg-slate-955/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-955 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Access Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="USER" className="bg-slate-950 text-slate-100">Normal User</option>
                        <option value="STORE_OWNER" className="bg-slate-950 text-slate-100">Store Owner</option>
                        <option value="ADMIN" className="bg-slate-950 text-slate-100">System Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Secure Password</label>
                    <input
                      type="password"
                      required
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                    />
                    <p className="mt-1 text-[10px] text-slate-500 font-medium">8-16 chars. Must contain 1 uppercase & 1 special character.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Physical Address</label>
                    <textarea
                      required
                      rows="3"
                      value={userForm.address}
                      onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                      placeholder="Provide full location reference (max 400 chars)"
                      className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-955 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-650/15 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Provision User'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Form: Register Store Entity */}
              <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-8 shadow-md hover:border-indigo-500/30 transition-all duration-350">
                <h2 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-200 mb-2">Register Store Entity</h2>
                <p className="text-xs text-slate-400 mb-6">Deploy a physical store entity inside the platform registry linked to a Store Owner.</p>
                
                <form onSubmit={handleCreateStore} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Store Brand Name</label>
                    <input
                      type="text"
                      required
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      placeholder="McDonald's, Starbucks, etc."
                      className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Store Public Email</label>
                      <input
                        type="email"
                        required
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        placeholder="store@example.com"
                        className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Owner Numeric ID</label>
                      <input
                        type="number"
                        required
                        value={storeForm.ownerId}
                        onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}
                        placeholder="e.g. 5"
                        className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Operating Address</label>
                    <textarea
                      required
                      rows="3"
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                      placeholder="Physical operating location details"
                      className="block w-full rounded-lg border border-slate-800 bg-slate-955/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-955 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-650/15 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register Store'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* 3. Tab: Users Registry Table */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200">Users Registry</h1>
                  <p className="mt-1 text-xs text-slate-450 font-bold uppercase tracking-wider">Filter, search, and sort platform participants.</p>
                </div>
                
                {/* Filter controls */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name, email..."
                      className="block w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-900/60 py-2 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2 pl-10 pr-10 text-xs text-slate-100 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="" className="bg-slate-950">All Roles</option>
                      <option value="USER" className="bg-slate-950">Normal User</option>
                      <option value="STORE_OWNER" className="bg-slate-950">Store Owner</option>
                      <option value="ADMIN" className="bg-slate-950">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none animate-pulse" />
                  </div>
                </div>
              </div>

              {dataLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-855 bg-slate-900/20 shadow-md hover:border-indigo-500/30 overflow-hidden transition-all duration-350">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${userSortField === 'name' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleUserSort('name')}>
                            <div className="flex items-center gap-1.5">
                              Name <ArrowUpDown className={`h-3.5 w-3.5 ${userSortField === 'name' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${userSortField === 'email' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleUserSort('email')}>
                            <div className="flex items-center gap-1.5">
                              Email <ArrowUpDown className={`h-3.5 w-3.5 ${userSortField === 'email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${userSortField === 'address' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleUserSort('address')}>
                            <div className="flex items-center gap-1.5">
                              Address <ArrowUpDown className={`h-3.5 w-3.5 ${userSortField === 'address' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${userSortField === 'role' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleUserSort('role')}>
                            <div className="flex items-center gap-1.5">
                              Role <ArrowUpDown className={`h-3.5 w-3.5 ${userSortField === 'role' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className="p-4 text-center">Store Rating</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 bg-slate-900/10">
                        {usersList.length > 0 ? (
                          usersList.map((usr) => (
                            <tr key={usr.id} className="hover:bg-slate-800/20 transition-colors text-slate-350 font-medium">
                              <td className="p-4 font-extrabold text-slate-200">{usr.name}</td>
                              <td className="p-4 text-slate-400">{usr.email}</td>
                              <td className="p-4 max-w-xs truncate text-slate-450">{usr.address}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                                  usr.role === 'ADMIN' 
                                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
                                    : usr.role === 'STORE_OWNER'
                                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.05)]'
                                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                                }`}>
                                  {usr.role}
                                </span>
                              </td>
                              <td className="p-4 text-center font-bold text-slate-200">
                                {usr.role === 'STORE_OWNER' ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-black text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                                    <Star className="h-3 w-3 fill-current text-amber-400" />
                                    {usr.averageRating !== null && usr.averageRating !== undefined ? usr.averageRating : '0.0'}
                                  </span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => setSelectedUser(usr)}
                                  className="inline-flex items-center gap-1 rounded-xl bg-slate-950 border border-slate-850 px-3 py-1.5 text-xs font-extrabold text-slate-300 hover:text-white hover:bg-slate-900 hover:border-indigo-500/30 transition-all cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 text-cyan-400" />
                                  <span>View Details</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-500 italic font-semibold">
                              No users match the active filters or query.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Tab: Stores Directory Table */}
          {activeTab === 'stores' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200">Stores Directory</h1>
                  <p className="mt-1 text-xs text-slate-450 font-bold uppercase tracking-wider">Explore physical store node allocations and aggregate overall reviews.</p>
                </div>

                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    placeholder="Search stores by name, address..."
                    className="block w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-900/60 py-2 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500/80 focus:bg-slate-955 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {dataLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-850 bg-slate-900/20 shadow-md hover:border-indigo-500/30 overflow-hidden transition-all duration-350">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${storeSortField === 'name' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleStoreSort('name')}>
                            <div className="flex items-center gap-1.5">
                              Store Name <ArrowUpDown className={`h-3.5 w-3.5 ${storeSortField === 'name' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${storeSortField === 'email' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleStoreSort('email')}>
                            <div className="flex items-center gap-1.5">
                              Public Email <ArrowUpDown className={`h-3.5 w-3.5 ${storeSortField === 'email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${storeSortField === 'address' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleStoreSort('address')}>
                            <div className="flex items-center gap-1.5">
                              Operating Address <ArrowUpDown className={`h-3.5 w-3.5 ${storeSortField === 'address' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className={`p-4 text-center cursor-pointer hover:bg-slate-900/80 transition-colors ${storeSortField === 'averageRating' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`} onClick={() => handleStoreSort('averageRating')}>
                            <div className="flex items-center gap-1.5 justify-center">
                              Overall Rating <ArrowUpDown className={`h-3.5 w-3.5 ${storeSortField === 'averageRating' ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                          </th>
                          <th className="p-4 text-center">Owner Numeric ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 bg-slate-900/10">
                        {storesList.length > 0 ? (
                          storesList.map((str) => (
                            <tr key={str.id} className="hover:bg-slate-800/20 transition-colors text-slate-350 font-medium">
                              <td className="p-4 font-extrabold text-slate-200">{str.name}</td>
                              <td className="p-4 text-slate-400">{str.email}</td>
                              <td className="p-4 text-slate-400">{str.address}</td>
                              <td className="p-4 text-center">
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-black text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                                  <Star className="h-3 w-3 fill-current text-amber-400" />
                                  {str.averageRating !== null && str.averageRating !== undefined ? str.averageRating : '0.0'}
                                </span>
                              </td>
                              <td className="p-4 text-center font-bold text-slate-400">
                                #{str.ownerId}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-500 italic font-semibold">
                              No stores match your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md scale-in rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">Participant Profile Details</h2>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="text-slate-500 hover:text-slate-350 text-lg font-bold focus:outline-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Name</span>
                <span className="text-sm font-extrabold text-slate-200">{selectedUser.name}</span>
              </div>
              
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Reference</span>
                <span className="text-sm font-semibold text-slate-400">{selectedUser.email}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Physical Address</span>
                <span className="text-sm font-medium text-slate-400 block whitespace-pre-wrap leading-relaxed">
                  {selectedUser.address}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Access Level Role</span>
                  <span className={`inline-flex items-center rounded-md mt-1.5 px-2.5 py-0.5 text-xs font-semibold ${
                    selectedUser.role === 'ADMIN' 
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
                      : selectedUser.role === 'STORE_OWNER'
                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.05)]'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>

                {selectedUser.role === 'STORE_OWNER' && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Store Rating Average</span>
                    <span className="inline-flex items-center mt-1.5 gap-1 rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-black text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                      <Star className="h-3 w-3 fill-current text-amber-400" />
                      {selectedUser.averageRating !== null && selectedUser.averageRating !== undefined ? selectedUser.averageRating : '0.0'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-850 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}