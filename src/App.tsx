
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { LandingPage } from './screens/LandingPage';
import { SignUp } from './screens/SignUp';
import { Onboarding } from './screens/Onboarding';
import { VoiceMentor } from './screens/VoiceMentor';
import { TrainingScreen } from './screens/Training';
import { MentorService } from './services/mentorService';
import { Exporter } from './utils/exporter';
import { UserProfile, Opportunity, PlanJSON } from './types';
import { AppState } from './context';

// --- Components ---

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Opportunities', path: '/opportunities', icon: 'fa-lightbulb' },
    { label: 'My Plan', path: '/plan', icon: 'fa-calendar-check' },
    { label: 'Documents', path: '/documents', icon: 'fa-file-contract' },
    { label: 'Training', path: '/training', icon: 'fa-graduation-cap' },
    { label: 'Voice Mentor', path: '/voice', icon: 'fa-microphone-lines' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl z-10">
        <div className="p-8 pb-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <i className="fas fa-rocket text-white text-lg"></i>
            </div>
            NextWave
          </Link>
          <div className="mt-8 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Menu</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
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
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between z-20 shadow-sm">
          <span className="font-bold text-xl text-slate-900 flex items-center gap-2">
             <i className="fas fa-rocket text-blue-600"></i> NextWave
          </span>
          <button className="text-slate-600 p-2"><i className="fas fa-bars text-xl"></i></button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Screens (Refined Styles) ---

const OpportunitiesScreen = () => {
  const { user, opportunities, setOpportunities, setSelectedIdea } = React.useContext(AppState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ops = await MentorService.generateOpportunities(user);
      setOpportunities(ops);
    } catch (e) {
      console.error(e);
      alert("Failed to generate ideas. Ensure API Key is set.");
    } finally {
      setLoading(false);
    }
  };

  const selectIdea = (op: Opportunity) => {
    setSelectedIdea(op);
    navigate('/plan');
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Business Opportunities</h2>
          <p className="text-slate-500 text-lg font-light">Curated high-potential ventures based on your profile.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 duration-200"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles text-yellow-400"></i>}
          <span className="font-semibold">{opportunities.length > 0 ? 'Regenerate Ideas' : 'Generate Ideas'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {opportunities.map((op, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            <div className="mb-4">
              <div className="inline-block p-2 rounded-lg bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <i className="fas fa-lightbulb text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">{op.title}</h3>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">{op.description}</p>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 p-3 rounded-lg">
                <i className="fas fa-coins text-emerald-500 w-5 text-center"></i> 
                <span>Cap: <span className="text-slate-700">{op.starting_capital_band}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 p-3 rounded-lg">
                <i className="fas fa-chart-line text-blue-500 w-5 text-center"></i> 
                <span>Pot: <span className="text-slate-700">{op.earning_potential_band}</span></span>
              </div>
              
              <button 
                onClick={() => selectIdea(op)}
                className="w-full mt-4 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Build Execution Plan <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </div>
          </div>
        ))}
        {opportunities.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fas fa-seedling text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No ideas generated yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">Click the generate button above to let our AI analyze your profile and suggest tailored business opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanScreen = () => {
  const { user, selectedIdea, plan, setPlan } = React.useContext(AppState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedIdea && !plan && !loading) {
      setLoading(true);
      MentorService.generatePlan(user, selectedIdea)
        .then(p => setPlan(p))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [user, selectedIdea]);

  if (!selectedIdea) return <Navigate to="/opportunities" />;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="mb-10 pb-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">90-Day Roadmap</h2>
          <p className="text-slate-500 mt-1">Step-by-step execution plan for <span className="font-semibold text-slate-800">{selectedIdea.title}</span></p>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 px-4 py-2 rounded-lg text-sm text-slate-600 flex items-center gap-2">
           <i className="fas fa-bullseye text-red-500"></i> Goal: Launch in 13 Weeks
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
          <p className="text-lg font-medium text-slate-600">Architecting your success plan...</p>
        </div>
      )}

      {!loading && plan && (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {plan.weeks.map((week, index) => (
            <div key={week.weekNumber} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Icon / Bullet */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="font-bold text-sm">W{week.weekNumber}</span>
              </div>
              
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Week {week.weekNumber} Objectives
                </h3>
                <div className="space-y-4">
                  {week.tasks.map((task, ti) => (
                    <div key={ti} className="group/task flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="mt-1">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-slate-800 text-sm group-hover/task:text-blue-700 transition-colors">{task.title}</h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            task.difficulty > 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {task.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.detail}</p>
                        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                          <i className="far fa-clock"></i> {task.estimated_hours}h est.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentsScreen = () => {
  const { selectedIdea } = React.useContext(AppState);
  const [loading, setLoading] = useState<string | null>(null);

  if (!selectedIdea) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-folder-open text-3xl text-slate-400"></i>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Project</h2>
      <p className="text-slate-500 mb-8 max-w-md">Select a business opportunity to unlock the document generator suite.</p>
      <Link to="/opportunities" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
        Browse Opportunities
      </Link>
    </div>
  );

  const handleExport = async (type: 'pdf' | 'ppt' | 'excel') => {
    setLoading(type);
    try {
      if (type === 'pdf') {
        const data = await MentorService.generateConceptNote(selectedIdea);
        await Exporter.exportPDF(data, `${selectedIdea.title.replace(/\s+/g, '_')}_Concept_Note`);
      } else if (type === 'ppt') {
        const data = await MentorService.generatePitchDeck(selectedIdea);
        await Exporter.exportPPTX(data, `${selectedIdea.title.replace(/\s+/g, '_')}_Pitch`);
      } else if (type === 'excel') {
        const data = await MentorService.generateFinancials(selectedIdea);
        await Exporter.exportExcel(data, `${selectedIdea.title.replace(/\s+/g, '_')}_Financials`);
      }
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      setLoading(null);
    }
  };

  const DocCard = ({ icon, color, title, desc, type, btnText }: any) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">{desc}</p>
      <button 
        onClick={() => handleExport(type)}
        disabled={!!loading}
        className="mt-auto w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
      >
        {loading === type ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-download"></i>}
        <span>{loading === type ? 'Generating...' : btnText}</span>
      </button>
    </div>
  );

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Professional Documents</h2>
        <p className="text-slate-500 text-lg font-light">
          Instantly generate investor-ready materials for <span className="font-semibold text-slate-900">{selectedIdea.title}</span> using our advanced AI engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DocCard 
          icon="fa-file-pdf" 
          color="bg-red-50 text-red-600"
          title="Concept Note"
          desc="A comprehensive 3-5 page strategic overview detailing your problem, solution, and execution strategy."
          type="pdf"
          btnText="Download PDF"
        />
        <DocCard 
          icon="fa-file-powerpoint" 
          color="bg-orange-50 text-orange-600"
          title="Pitch Deck"
          desc="A compelling 10-slide presentation outline designed to captivate investors and partners."
          type="ppt"
          btnText="Download PPT"
        />
        <DocCard 
          icon="fa-file-excel" 
          color="bg-emerald-50 text-emerald-600"
          title="Financial Model"
          desc="Detailed spreadsheets covering startup costs, unit economics, and 6-month cash flow projections."
          type="excel"
          btnText="Download Excel"
        />
      </div>
    </div>
  );
};

const AdminScreen = () => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h2>
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mb-8 flex items-start gap-4">
        <i className="fas fa-exclamation-triangle text-amber-500 mt-1"></i>
        <div>
           <h3 className="font-bold text-amber-800 text-lg">Debug Mode Active</h3>
           <p className="text-amber-700 mt-1">System calls are routed to Gemini 2.5 Flash for optimization.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-xl mb-6">Prompt Registry</h3>
        <div className="space-y-4">
          {['generateOpportunities', 'generatePlan', 'voiceChatHandler'].map((prompt, i) => (
             <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between mb-3">
                <span className="font-mono text-sm font-bold text-slate-700">{prompt}</span>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">v1.2</span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate bg-white p-2 rounded border border-slate-100">SYSTEM: You are NextWave Mentor...</p>
            </div>
          ))}
        </div>
      </div>
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
