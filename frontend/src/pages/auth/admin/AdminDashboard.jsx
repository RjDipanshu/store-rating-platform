import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { UserPlus, Store, LogOut, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('owners');
  const [ownerForm, setOwnerForm] = useState({ name: '', email: '', password: '', address: '', role: 'STORE_OWNER' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    if (!ownerForm.name || !ownerForm.email || !ownerForm.password || !ownerForm.address) {
      showFeedback('error', 'All owner profile fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/admin/users', ownerForm);
      showFeedback('success', `Owner account created successfully! Allocated User ID: ${res.data?.id || 'Saved'}`);
      setOwnerForm({ name: '', email: '', password: '', address: '', role: 'STORE_OWNER' });
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to create store owner.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!storeForm.name || !storeForm.email || !storeForm.address || !storeForm.ownerId) {
      showFeedback('error', 'All store registration properties are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...storeForm, ownerId: parseInt(storeForm.ownerId, 10) };
      await API.post('/admin/stores', payload);
      showFeedback('success', `"${storeForm.name}" has been cleanly provisioned and assigned!`);
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to initialize store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 px-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold tracking-tight text-lg">Admin Control</span>
        </div>
        <nav className="mt-6 space-y-1.5">
          <button onClick={() => setActiveTab('owners')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === 'owners' ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
            <UserPlus className="h-4 w-4" /> Provision Store Owner
          </button>
          <button onClick={() => setActiveTab('stores')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === 'stores' ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
            <Store className="h-4 w-4" /> Register Store Entity
          </button>
        </nav>
        <div className="absolute bottom-6 w-52 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className="px-2 py-2 mb-3">
            <p className="text-xs text-zinc-400 font-medium truncate">{user?.email}</p>
            <span className="inline-flex items-center mt-1 rounded-md bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">System Admin</span>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10 max-w-4xl">
        {feedback.message && (
          <div className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium border shadow-xs ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400'}`}>
            {feedback.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <p>{feedback.message}</p>
          </div>
        )}
        {activeTab === 'owners' && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h1 className="text-xl font-bold tracking-tight">Step 6 — Provision Store Owner</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6">Create global operator accounts configured directly under the `STORE_OWNER` role.</p>
            <form onSubmit={handleCreateOwner} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <input type="text" value={ownerForm.name} onChange={(e) => setOwnerForm({...ownerForm, name: e.target.value})} placeholder="Store Owner User" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input type="email" value={ownerForm.email} onChange={(e) => setOwnerForm({...ownerForm, email: e.target.value})} placeholder="owner@gmail.com" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Secure Password</label>
                  <input type="password" value={ownerForm.password} onChange={(e) => setOwnerForm({...ownerForm, password: e.target.value})} placeholder="••••••••" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                  <input type="text" value={ownerForm.address} onChange={(e) => setOwnerForm({...ownerForm, address: e.target.value})} placeholder="Delhi, India" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Store Owner'}
                </button>
              </div>
            </form>
          </div>
        )}
        {activeTab === 'stores' && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h1 className="text-xl font-bold tracking-tight">Step 7 — Register Store Entity</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6">Deploy a physical store node into the ecosystem mapped to an Owner ID.</p>
            <form onSubmit={handleCreateStore} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Store Brand Name</label>
                  <input type="text" value={storeForm.name} onChange={(e) => setStoreForm({...storeForm, name: e.target.value})} placeholder="Dominos Pizza" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Store Public Email</label>
                  <input type="email" value={storeForm.email} onChange={(e) => setStoreForm({...storeForm, email: e.target.value})} placeholder="dominos@gmail.com" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Operating Address</label>
                  <input type="text" value={storeForm.address} onChange={(e) => setStoreForm({...storeForm, address: e.target.value})} placeholder="Mumbai, India" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Owner Numeric ID</label>
                  <input type="number" value={storeForm.ownerId} onChange={(e) => setStoreForm({...storeForm, ownerId: e.target.value})} placeholder="2" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register Store'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}