
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../context';
import { MentorService } from '../services/mentorService';
import { Opportunity } from '../types';

export const OpportunitiesScreen: React.FC = () => {
  const { user, opportunities, setOpportunities, setSelectedIdea } = useContext(AppState);
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
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Business Opportunities</h2>
          <p className="text-slate-500 text-lg font-light">Curated high-potential ventures based on your profile.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-xl hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 duration-200"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles text-amber-400"></i>}
          <span className="font-semibold">{opportunities.length > 0 ? 'Regenerate Ideas' : 'Generate Ideas'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {opportunities.map((op, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors opacity-60 pointer-events-none"></div>
            
            <div className="mb-4 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <i className="fas fa-lightbulb text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{op.title}</h3>
            </div>
            
            <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3 font-light relative z-10">{op.description}</p>
            
            <div className="mt-auto space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <i className="fas fa-coins text-emerald-500 w-5 text-center"></i> 
                <span>Cap: <span className="text-slate-700 font-semibold">{op.starting_capital_band}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <i className="fas fa-chart-line text-blue-500 w-5 text-center"></i> 
                <span>Pot: <span className="text-slate-700 font-semibold">{op.earning_potential_band}</span></span>
              </div>
              
              <button 
                onClick={() => selectIdea(op)}
                className="w-full mt-5 py-3.5 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-blue-600/20"
              >
                Build Execution Plan <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </div>
          </div>
        ))}
        {opportunities.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fas fa-seedling text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No ideas generated yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">Click the generate button above to let our AI analyze your profile and suggest tailored business opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};
