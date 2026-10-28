import React, { useState } from 'react';
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, DEMO_USERS } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(username, password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const quickLogin = (userType) => {
    const demoUser = DEMO_USERS[userType];
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    
    setTimeout(() => {
      const result = login(demoUser.username, demoUser.password);
      if (result.success) {
        onClose();
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-sm text-slate-400">Sign in to access your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email / Username</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-cyan-500 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-cyan-500 text-white"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-400">Demo Accounts</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => quickLogin('customer')}
            className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Customer Account</div>
                <div className="text-xs text-slate-400">Browse & purchase products</div>
              </div>
              <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Customer</div>
            </div>
          </button>

          <button
            onClick={() => quickLogin('manager')}
            className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Manager Account</div>
                <div className="text-xs text-slate-400">Manage orders & inventory</div>
              </div>
              <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Manager</div>
            </div>
          </button>

          <button
            onClick={() => quickLogin('owner')}
            className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Owner Account</div>
                <div className="text-xs text-slate-400">Full system access & analytics</div>
              </div>
              <div className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">Owner</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
