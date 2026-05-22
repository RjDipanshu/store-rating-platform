import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Store, Star, Users, LogOut, Loader2, AlertCircle, MessageSquare,
  Lock, ShieldAlert, CheckCircle2, ArrowUpDown, ChevronDown
} from 'lucide-react';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();

  // State management for API data
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Table Sorting States (for usersWhoRated)
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [sortedUsersList, setSortedUsersList] = useState([]);

  // Password Update Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState([]);

  // Fetch aggregated metrics from the owner endpoint
  const fetchOwnerMetrics = async () => {
    try {
      const res = await API.get('/owner/dashboard');
      if (res.data?.success) {
        setDashboardData(res.data.data);
      } else {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to sync with the owner metrics server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerMetrics();
  }, []);

  // Update sorted users list whenever dashboardData or sorting states change
  useEffect(() => {
    if (!dashboardData?.usersWhoRated) return;

    const list = [...dashboardData.usersWhoRated];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle cases like rating which are numbers
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedUsersList(list);
  }, [dashboardData, sortField, sortOrder]);

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

  // Toggle table sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
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
      triggerFeedback('Your store owner access password was updated successfully!');
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 font-sans">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Compiling Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-sans">
      {/* Cyber Grid & Ambient Blur Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-0 left-[50%] -translate-x-[50%] h-[350px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] h-[250px] w-[250px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

      {/* Sidebar Layout Frame */}
      <div className="relative flex min-h-screen z-10">
        <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950/40 backdrop-blur-md p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5 px-2 pb-6 border-b border-slate-850">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-2 text-white shadow-lg shadow-indigo-500/15">
                <Store className="h-5 w-5 fill-current" />
              </div>
              <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">PARTNER PORTAL</span>
            </div>

            <nav className="mt-6 space-y-1.5">
              <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2.5 text-sm font-semibold text-cyan-400 flex items-center gap-3">
                <Store className="h-4.5 w-4.5 text-cyan-400" />
                Store Performance
              </div>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
              >
                <Lock className="h-4.5 w-4.5 text-cyan-400" />
                Update Password
              </button>
            </nav>
          </div>

          <div className="border-t border-slate-850 pt-4">
            <div className="px-3 py-3 mb-3 bg-slate-900/60 border border-slate-850 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
              <p className="text-xs font-black truncate text-slate-200 mt-1">{user?.name}</p>
              <span className="inline-flex items-center mt-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.05)] uppercase tracking-wider">
                Store Owner
              </span>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/20 transition-all cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Workspace Center Grid */}
        <main className="flex-1 p-10 overflow-y-auto">
          
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

          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200">
              {dashboardData?.storeName || 'Store Dashboard'}
            </h1>
            <p className="mt-1 text-xs text-slate-450 font-bold uppercase tracking-wider">
              Ecosystem diagnostics and client feedback evaluation logs for Store Node Entity: #{dashboardData?.storeId || 'N/A'}
            </p>
          </div>

          {/* Performance analytics metrics card list */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {/* Average Rating Score Card */}
            <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">Store Average Rating</span>
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-slate-100">
                  {dashboardData?.averageRating || '0.0'}
                </span>
                <span className="text-xs font-bold text-slate-500">/ 5.0</span>
              </div>
            </div>

            {/* Total Review Submissions count */}
            <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-6 shadow-md hover:shadow-indigo-500/5 hover:border-indigo-500/40 hover:bg-slate-900/30 transition-all duration-350">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">Total Evaluations</span>
                <div className="rounded-xl bg-indigo-500/10 p-2 text-cyan-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)]">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-black tracking-tight text-slate-100">
                  {dashboardData?.totalRatings || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-2">customer reviews</span>
              </div>
            </div>
          </div>

          {/* Feed List Table: Users Who Rated (Supports sorting column criteria) */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/20 shadow-md hover:border-indigo-500/30 overflow-hidden transition-all duration-350">
            <div className="p-6 border-b border-slate-850 bg-slate-900/30 backdrop-blur-xs flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <h2 className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-200">Customer Evaluation Logs</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                    <th 
                      onClick={() => handleSort('name')}
                      className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${sortField === 'name' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        Customer Name 
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === 'name' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('email')}
                      className={`p-4 cursor-pointer hover:bg-slate-900/80 transition-colors ${sortField === 'email' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        Email Reference 
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === 'email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('rating')}
                      className={`p-4 text-right cursor-pointer hover:bg-slate-900/80 transition-colors ${sortField === 'rating' ? 'text-cyan-400 font-black bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-1.5 justify-end">
                        Score Given 
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === 'rating' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-900/10">
                  {sortedUsersList.length > 0 ? (
                    sortedUsersList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20 transition-colors text-slate-350 font-medium">
                        <td className="p-4 font-extrabold text-slate-200">{item.name}</td>
                        <td className="p-4 text-slate-400">{item.email}</td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-black text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                            <Star className="h-3 w-3 fill-current text-amber-400" />
                            {item.rating}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-10 text-center text-slate-500 italic font-semibold">
                        No customer evaluation logs found for this store node entry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md scale-in rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">Update Partner Password</h2>
              <button 
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