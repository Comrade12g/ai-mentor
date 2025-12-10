import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Onboarding } from './screens/Onboarding';
import { VoiceMentor } from './screens/VoiceMentor';
import { MentorService } from './services/mentorService';
import { Exporter } from './utils/exporter';
import { UserProfile, Opportunity, PlanJSON } from './types';

// --- Shared State Context (Simplified for file count limit) ---
// In a larger app, this would be in a Context Provider file.
const AppState = React.createContext<{
  user: UserProfile | null;
  setUser: (u: UserProfile) => void;
  opportunities: Opportunity[];
  setOpportunities: (ops: Opportunity[]) => void;
  selectedIdea: Opportunity | null;
  setSelectedIdea: (op: Opportunity) => void;
  plan: PlanJSON | null;
  setPlan: (p: PlanJSON) => void;
}>({
  user: null, setUser: () => {},
  opportunities: [], setOpportunities: () => {},
  selectedIdea: null, setSelectedIdea: () => {},
  plan: null, setPlan: () => {}
});

// --- Components ---

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Opportunities', path: '/opportunities', icon: 'fa-lightbulb' },
    { label: 'My Plan', path: '/plan', icon: 'fa-calendar-check' },
    { label: 'Documents', path: '/documents', icon: 'fa-file-lines' },
    { label: 'Voice Mentor', path: '/voice', icon: 'fa-microphone' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <i className="fas fa-rocket"></i> NextWave
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">US</div>
            <div className="text-sm">
              <div className="font-medium text-slate-900">User Profile</div>
              <div className="text-slate-500 text-xs">Entrepreneur</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
          <span className="font-bold text-blue-600">NextWave</span>
          <button className="text-slate-600"><i className="fas fa-bars"></i></button>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Screens (Inline for compactness per requirements) ---

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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Business Opportunities</h2>
          <p className="text-slate-500">Curated for your profile and location.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
          {opportunities.length > 0 ? 'Regenerate' : 'Generate Ideas'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((op, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{op.title}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-3">{op.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <i className="fas fa-money-bill text-green-500 w-4"></i> Capital: {op.starting_capital_band}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <i className="fas fa-chart-line text-blue-500 w-4"></i> Potential: {op.earning_potential_band}
              </div>
            </div>

            <button 
              onClick={() => selectIdea(op)}
              className="mt-auto w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Build Plan
            </button>
          </div>
        ))}
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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">90-Day Execution Plan</h2>
        <div className="bg-blue-50 p-4 rounded-lg inline-block border border-blue-100">
          <span className="text-blue-800 font-medium">Focus Project:</span> {selectedIdea.title}
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <i className="fas fa-circle-notch fa-spin text-4xl text-blue-600 mb-4"></i>
          <p>Generating your roadmap...</p>
        </div>
      )}

      {!loading && plan && (
        <div className="space-y-6">
          {plan.weeks.map((week) => (
            <div key={week.weekNumber} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-semibold text-slate-700">
                Week {week.weekNumber}
              </div>
              <div className="divide-y divide-slate-100">
                {week.tasks.map((task, ti) => (
                  <div key={ti} className="p-4 hover:bg-slate-50 flex gap-4 items-start">
                    <div className="mt-1">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{task.detail}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{task.tag}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{task.estimated_hours} hrs</span>
                      </div>
                    </div>
                  </div>
                ))}
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
    <div className="p-8 text-center">
      <p className="text-slate-500">Please select a business opportunity first.</p>
      <Link to="/opportunities" className="text-blue-600 hover:underline">Go to Opportunities</Link>
    </div>
  );

  const handleExport = async (type: 'pdf' | 'ppt' | 'excel') => {
    setLoading(type);
    try {
      if (type === 'pdf') {
        const data = await MentorService.generateConceptNote(selectedIdea);
        await Exporter.exportPDF(data, `${selectedIdea.title}_Concept_Note`);
      } else if (type === 'ppt') {
        const data = await MentorService.generatePitchDeck(selectedIdea);
        await Exporter.exportPPTX(data, `${selectedIdea.title}_Pitch`);
      } else if (type === 'excel') {
        const data = await MentorService.generateFinancials(selectedIdea);
        await Exporter.exportExcel(data, `${selectedIdea.title}_Financials`);
      }
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Generator</h2>
      <p className="text-slate-500 mb-8">AI-generated professional documents for investors and partners.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-lg transition">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-file-pdf"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Concept Note</h3>
          <p className="text-sm text-slate-500 mb-6">Professional overview of your business model and value prop.</p>
          <button 
            onClick={() => handleExport('pdf')}
            disabled={!!loading}
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {loading === 'pdf' ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-lg transition">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-file-powerpoint"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Pitch Deck</h3>
          <p className="text-sm text-slate-500 mb-6">10-slide investor presentation outline.</p>
          <button 
            onClick={() => handleExport('ppt')}
            disabled={!!loading}
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {loading === 'ppt' ? 'Generating...' : 'Download PPT'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-lg transition">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-file-excel"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Financial Model</h3>
          <p className="text-sm text-slate-500 mb-6">Startup costs, unit economics, and projections.</p>
          <button 
            onClick={() => handleExport('excel')}
            disabled={!!loading}
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
             {loading === 'excel' ? 'Generating...' : 'Download Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminScreen = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-yellow-800">Debug Mode Active</h3>
        <p className="text-sm text-yellow-700">API Calls are using Gemini 2.5 Flash.</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold mb-4">Prompt Management</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <div className="flex justify-between mb-2">
              <span className="font-mono text-sm font-bold">generateOpportunities</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">v1.2</span>
            </div>
            <p className="text-xs text-slate-500 font-mono truncate">SYSTEM: You are NextWave Mentor...</p>
          </div>
          {/* More prompts */}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Onboarding onComplete={setUser} />
      </div>
    );
  }

  return (
    <AppState.Provider value={stateValue}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/opportunities" />} />
            <Route path="/onboarding" element={<Navigate to="/opportunities" />} />
            <Route path="/opportunities" element={<OpportunitiesScreen />} />
            <Route path="/plan" element={<PlanScreen />} />
            <Route path="/documents" element={<DocumentsScreen />} />
            <Route path="/voice" element={<VoiceMentor />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppState.Provider>
  );
}