import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { User, Mail, Lock, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, address } = formData;
    
    if (!name || !email || !password || !address) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      // Direct call to your public user registration endpoint
      await API.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        setError(serverErrors.join(' '));
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 overflow-hidden text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* High-Tech Grid & Glow Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute -top-[40%] left-[50%] -translate-x-[50%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[40%] right-[10%] h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-8 shadow-2xl hover:border-indigo-500/35 transition-all duration-500 my-8">
        
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 text-white shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <User className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">
            Create Account
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-semibold tracking-wide">
            REGISTERING NEW END-USER PROFILE NODE
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-xs font-semibold text-red-400 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400 animate-in fade-in slide-in-from-top-1">
            Account created successfully! Redirecting to auth center...
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="h-4.5 w-4.5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading || success}
                placeholder="Rajesh Kumar Singhal Gupta"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-450 font-medium tracking-wide">Must be between 20 and 60 characters long.</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || success}
                placeholder="name@example.com"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Secure Password
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || success}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-450 font-medium tracking-wide">8-16 chars. Must contain 1 uppercase & 1 special character.</p>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Physical Location
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading || success}
                placeholder="Delhi, India"
                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/15 hover:from-indigo-600 hover:to-cyan-600 hover:shadow-cyan-500/20 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Deploy Profile'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-all pl-1">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}