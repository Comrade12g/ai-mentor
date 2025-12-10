
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <i className="fas fa-rocket"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">NextWave</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#about" className="hover:text-blue-600 transition">Mission</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          </div>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 text-sm transform hover:scale-105 duration-200"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          AI-Powered Mentorship
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 max-w-5xl text-slate-900 leading-[1.1]">
          Launch your empire <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">with precision.</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed font-light">
          NextWave Mentor uses advanced generative AI to architect locally grounded business opportunities, execution plans, and financial models tailored to your context.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto z-10">
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transform hover:-translate-y-1 duration-200"
          >
            Get Started Free <i className="fas fa-arrow-right"></i>
          </button>
          <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
            <i className="fas fa-play text-slate-400"></i> Watch Demo
          </button>
        </div>

        {/* Abstract Deco */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">The Entrepreneur's Toolkit</h2>
            <p className="text-slate-500 text-lg">Everything you need to go from zero to one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-lightbulb" 
              color="bg-amber-500"
              title="Opportunity Generation"
              desc="AI analyzes your skills, budget, and location to suggest high-viability business concepts."
            />
            <FeatureCard 
              icon="fa-chess-knight" 
              color="bg-indigo-500"
              title="Execution Roadmaps"
              desc="Get detailed 90-day plans broken down into weekly tasks with estimated hours and difficulty."
            />
            <FeatureCard 
              icon="fa-file-contract" 
              color="bg-emerald-500"
              title="Instant Documentation"
              desc="One-click generation of professional PDF Concept Notes, Pitch Decks, and Excel Financials."
            />
            <FeatureCard 
              icon="fa-microphone-lines" 
              color="bg-rose-500"
              title="Voice Mentorship"
              desc="Have real conversations with an AI mentor to brainstorm, troubleshoot, and practice pitching."
            />
            <FeatureCard 
              icon="fa-graduation-cap" 
              color="bg-blue-500"
              title="Skill Acquisition"
              desc="Interactive micro-lessons and quizzes to bridge your knowledge gaps instantly."
            />
            <FeatureCard 
              icon="fa-chart-pie" 
              color="bg-cyan-500"
              title="Market Intelligence"
              desc="Data-driven insights tailored to African markets and local economic conditions."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3 text-white font-bold text-2xl tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-rocket text-sm"></i>
              </div>
              NextWave
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fab fa-twitter text-xl"></i></a>
              <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fab fa-linkedin text-xl"></i></a>
              <a href="#" className="hover:text-white transition transform hover:scale-110"><i className="fab fa-instagram text-xl"></i></a>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm flex flex-col md:flex-row justify-between text-slate-500">
            <p>&copy; {new Date().getFullYear()} NextWave Mentor. Crafted with precision.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, color: string, title: string, desc: string}> = ({ icon, color, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl mb-6 text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-light">{desc}</p>
  </div>
);
