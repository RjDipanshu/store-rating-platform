import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Store, Star, MapPin, Mail, LogOut, Loader2, CheckCircle2,
  AlertCircle, Search, ArrowUpDown, ChevronDown, Lock, ShieldAlert
} from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  // App States
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Rating Modal/Form States
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [hoverValue, setHoverValue] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Password Update Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState([]);

  // Fetch all registered stores with query parameters for search/sorting
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const params = {
        search: searchQuery,
        sort: sortField,
        order: sortOrder
      };
      const res = await API.get('/stores', { params });
      setStores(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch store listings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchQuery, sortField, sortOrder]);

  const triggerFeedback = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setError('');
      setTimeout(() => setSuccessMessage(''), 4500);
    } else {
      setError(msg);
      setSuccessMessage('');
      setTimeout(() => setError(''), 4500);
    }
  };

  // Submit/Modify star rating handler
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    setSubmitLoading(true);
    try {
      await API.post(`/stores/${selectedStore.id}/rating`, {
        rating: ratingValue
      });

      triggerFeedback(`Successfully saved a ${ratingValue}-star rating for "${selectedStore.name}"!`);
      setSelectedStore(null); // Close modal sheet
      setRatingValue(5);
      fetchStores(); // Reload listings to show computed ratings and current user's rating!
    } catch (err) {
      console.error(err);
      triggerFeedback(err.response?.data?.message || 'Could not submit rating.', false);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Password Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdErrors([]);

    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdErrors(['All password parameters are required.']);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdErrors(['New password does not match confirmation password.']);
      return;
    }

    setPwdLoading(true);
    try {
      await API.post('/auth/update-password', { oldPassword, newPassword });
      triggerFeedback('Your personal access password was updated successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err);
      const errorsList = err.response?.data?.errors;
      const errorMsg = Array.isArray(errorsList) ? errorsList : [err.response?.data?.message || err.response?.data?.error || 'Password update failed.'];
      setPwdErrors(errorMsg);
    } finally {
      setPwdLoading(false);
    }
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    // If the user already submitted a rating, pre-populate the modal!
    setRatingValue(store.userSubmittedRating || 5);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-sans">
      {/* Cyber Grid & Ambient Blur Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-0 left-[50%] -translate-x-[50%] h-[350px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] h-[250px] w-[250px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

      {/* Premium Glassmorphic Universal Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-2 text-white shadow-lg shadow-indigo-500/15">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">STOREPULSE</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-850 bg-slate-900/60 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>Update Password</span>
            </button>
            <div className="hidden text-right sm:block border-l border-slate-850 pl-4">
              <p className="text-xs font-bold text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-650/15 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Banner Alert Prompts */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-400 animate-in fade-in duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-sm font-semibold text-red-400 animate-in fade-in duration-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Dashboard Title & Dynamic Filter Headers */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200">Registered Stores</h1>
            <p className="mt-1 text-xs text-slate-450 font-bold uppercase tracking-wider">PLATFORM REGISTRY DIRECTORY NODES</p>
          </div>

          {/* Filtering and Sorting control stack */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store name, address..."
                className="block w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-900/60 py-2 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500/80 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/10 focus:outline-none transition-all"
              />
            </div>

            {/* Futuristic Custom Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-850 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-200 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all cursor-pointer min-w-48"
              >
                <span className="text-[9px] text-indigo-400 uppercase font-black tracking-wider">Sort:</span>
                <span>
                  {sortField === 'name' ? (sortOrder === 'asc' ? 'Name (A-Z)' : 'Name (Z-A)') :
                   sortField === 'address' ? (sortOrder === 'asc' ? 'Address (A-Z)' : 'Address (Z-A)') :
                   (sortOrder === 'desc' ? 'Rating (High-Low)' : 'Rating (Low-High)')}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-1.5 shadow-xl z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                    {[
                      { field: 'name', order: 'asc', label: 'Name (A-Z)' },
                      { field: 'name', order: 'desc', label: 'Name (Z-A)' },
                      { field: 'address', order: 'asc', label: 'Address (A-Z)' },
                      { field: 'address', order: 'desc', label: 'Address (Z-A)' },
                      { field: 'averageRating', order: 'desc', label: 'Overall Rating (High-Low)' },
                      { field: 'averageRating', order: 'asc', label: 'Overall Rating (Low-High)' },
                    ].map((opt) => (
                      <button
                        key={`${opt.field}-${opt.order}`}
                        type="button"
                        onClick={() => {
                          setSortField(opt.field);
                          setSortOrder(opt.order);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                          sortField === opt.field && sortOrder === opt.order
                            ? 'bg-indigo-500/10 text-cyan-400 border border-indigo-500/20'
                            : 'text-slate-350 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortField === opt.field && sortOrder === opt.order && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Loading Grid Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl border border-slate-800 bg-slate-900/10 p-6 animate-pulse" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 py-16 text-center">
            <Store className="h-12 w-12 text-slate-650 mb-3" />
            <h3 className="text-sm font-bold text-slate-350">No stores found</h3>
            <p className="mt-1 text-xs text-slate-500">Try broadening your search term or contact your administrator.</p>
          </div>
        ) : (
          /* Premium Store Cards Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-slate-950 p-2.5 text-slate-400 border border-slate-800 group-hover:bg-indigo-950/40 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                      <Store className="h-6 w-6" />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-black text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                        <Star className="h-3 w-3 fill-current text-amber-400" />
                        {store.averageRating !== null && store.averageRating !== undefined ? store.averageRating : '0.0'}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 font-extrabold text-lg tracking-tight text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {store.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="truncate">{store.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
                  
                  {/* Displays personalized submitted ratings status inline */}
                  <div className="text-[10px]">
                    <span className="block text-slate-500 uppercase font-black tracking-wider">Your Submitted Rating</span>
                    {store.userSubmittedRating ? (
                      <span className="inline-flex items-center gap-0.5 mt-1 font-bold text-indigo-400 text-xs">
                        {Array.from({ length: store.userSubmittedRating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current text-indigo-400 filter drop-shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
                        ))}
                      </span>
                    ) : (
                      <span className="block mt-1 text-slate-500 italic font-semibold">Not evaluated yet</span>
                    )}
                  </div>

                  <button
                    onClick={() => openRatingModal(store)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-850 px-4 py-2 text-xs font-extrabold text-slate-300 hover:text-white hover:bg-slate-900 hover:border-indigo-500/30 transition-all cursor-pointer shrink-0"
                  >
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-450/20" />
                    {store.userSubmittedRating ? 'Modify' : 'Evaluate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modern Dialog Star Feedback Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md scale-in rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-100">
            <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">Evaluate "{selectedStore.name}"</h2>
            <p className="text-xs text-slate-400 mt-1 leading-normal">
              {selectedStore.userSubmittedRating 
                ? `You previously rated this store ${selectedStore.userSubmittedRating} stars. Update your feedback score below.` 
                : 'Select the rating score between 1 and 5 that fits your genuine client experience.'}
            </p>
            
            <form onSubmit={handleRatingSubmit} className="mt-6 space-y-6">
              {/* Star Selection module */}
              <div className="flex justify-center gap-3 py-4 border border-slate-800 bg-slate-950/50 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(null)}
                    className="transition-transform active:scale-90 text-slate-700 hover:text-amber-400 focus:outline-none"
                  >
                    <Star
                      className={`h-9 w-9 cursor-pointer transition-colors ${
                        star <= (hoverValue || ratingValue)
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  disabled={submitLoading}
                  className="w-1/2 rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-1/2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-650/15 hover:from-indigo-500 hover:to-cyan-500 transition-all cursor-pointer"
                >
                  {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md scale-in rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">Update Personal Password</h2>
              <button 
                type="button"
                onClick={() => { setShowPasswordModal(false); setPwdErrors([]); }}
                className="text-slate-500 hover:text-slate-350 text-lg font-bold focus:outline-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {pwdErrors.length > 0 && (
              <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-xs font-semibold text-red-400">
                <div className="flex items-center gap-2 mb-0.5">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
                  <p>Validation errors:</p>
                </div>
                <ul className="list-disc list-inside space-y-0.5 font-medium pl-1">
                  {pwdErrors.map((errText, i) => (
                    <li key={i}>{errText}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">New Secure Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                />
                <p className="mt-1 text-[10px] text-slate-450 font-medium tracking-wide">8-16 chars. Must contain 1 uppercase & 1 special character.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 px-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-2 border-t border-slate-850 flex gap-3">
                <button
                  type="button"
                  disabled={pwdLoading}
                  onClick={() => { setShowPasswordModal(false); setPwdErrors([]); }}
                  className="w-1/2 rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer text-center transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-1/2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-650/15 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {pwdLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}