
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './screens/LandingPage';
import { SignUp } from './screens/SignUp';
import { Onboarding } from './screens/Onboarding';
import { VoiceMentor } from './screens/VoiceMentor';
import { TrainingScreen } from './screens/Training';
import { OpportunitiesScreen } from './screens/OpportunitiesScreen';
import { PlanScreen } from './screens/PlanScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { AdminScreen } from './screens/AdminScreen';
import { UserProfile, Opportunity, PlanJSON } from './types';
import { AppState } from './context';

// --- Layout Component ---

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Opportunities', path: '/opportunities', icon: 'fa-lightbulb' },
    { label: 'My Plan', path: '/plan', icon: 'fa-calendar-check' },
    { label: 'Documents', path: '/documents', icon: 'fa-file-contract' },
    { label: 'Training', path: '/training', icon: 'fa-graduation-cap' },
    { label: 'Voice Mentor', path: '/voice', icon: 'fa-microphone-lines' },
    { label: 'Admin', path: '/admin', icon: 'fa-cog' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 pb-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <i className="fas fa-rocket text-white text-lg"></i>
          </div>
          NextWave
        </Link>
        {/* Close button for mobile */}
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <i className="fas fa-times text-2xl"></i>
        </button>
      </div>
      
      <div className="mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-8">Menu</div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}></i> 
              <span className="font-medium tracking-wide">{item.label}</span>
              {isActive && <i className="fas fa-chevron-right ml-auto text-xs opacity-70"></i>}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            US
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-white truncate text-sm">User Profile</div>
            <div className="text-slate-400 text-xs truncate">Entrepreneur</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl z-20 relative">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-72 bg-slate-900 text-white flex flex-col shadow-2xl h-full animate-slide-in-left">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-rocket text-white text-xs"></i>
            </div>
            <span className="font-bold text-lg text-slate-900">NextWave</span>
          </div>
          <button 
            className="text-slate-600 p-2 rounded-lg hover:bg-slate-100" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Opportunity | null>(null);
  const [plan, setPlan] = useState<PlanJSON | null>(null);

  const stateValue = {
    user, setUser,
    opportunities, setOpportunities,
    selectedIdea, setSelectedIdea,
    plan, setPlan
  };

  return (
    <AppState.Provider value={stateValue}>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp onLogin={() => setIsAuthenticated(true)} />} />

          {/* Authenticated Flow */}
          <Route path="/onboarding" element={
            isAuthenticated ? <Onboarding onComplete={setUser} /> : <Navigate to="/signup" />
          } />

          {/* Protected Dashboard Routes */}
          <Route element={
            isAuthenticated ? (
              user ? (
                <Layout>
                  <Outlet />
                </Layout>
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/" />
            )
          }>
            <Route path="/opportunities" element={<OpportunitiesScreen />} />
            <Route path="/plan" element={<PlanScreen />} />
            <Route path="/documents" element={<DocumentsScreen />} />
            <Route path="/training" element={<TrainingScreen />} />
            <Route path="/voice" element={<VoiceMentor />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppState.Provider>
  );
}
