import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';


import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 overflow-hidden text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* High-Tech Grid & Glow Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute -top-[40%] left-[50%] -translate-x-[50%] h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 rounded-2xl border border-red-500/20 bg-slate-900/40 backdrop-blur-md p-8 shadow-2xl text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500 p-2.5 text-white shadow-lg shadow-red-500/20 mb-2 animate-pulse">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-400 to-purple-400">
          Access Denied
        </h2>
        <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
          403 - Unauthorized Access Blocked
        </p>
        <p className="text-sm text-slate-350 leading-relaxed">
          You do not have the required permissions to access this secure directory node.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-violet-650 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/15 hover:from-red-500 hover:to-cyan-500 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Guest Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 1. General Protected Routes (Any Authenticated User) */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* 2. Strict Store Owner Gated Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>

        {/* 3. Strict Administrator Gated Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}