
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: () => void;
}

export const SignUp: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Toggle between Sign In / Sign Up
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please accept the privacy policy to continue.");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      navigate('/onboarding');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl shadow-slate-200 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <i className="fas fa-rocket"></i>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 mt-2 font-light">Join the elite network of next-gen founders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-slate-50 focus:bg-white"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="text-sm">
              <label htmlFor="privacy" className="font-semibold text-slate-700 cursor-pointer">Privacy & Terms</label>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                I accept the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms</a>.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-xl shadow-blue-600/20 transform active:scale-95 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700'
            }`}
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'Sign In' : 'Get Started')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? "New to NextWave? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:text-blue-700 transition"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
