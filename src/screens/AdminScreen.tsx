
import React from 'react';

export const AdminScreen: React.FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-full">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200">
           <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total API Calls</div>
           <div className="text-3xl font-bold">1,248</div>
           <div className="text-emerald-400 text-sm mt-2"><i className="fas fa-arrow-up"></i> 12% vs last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Users</div>
           <div className="text-3xl font-bold text-slate-900">856</div>
           <div className="text-slate-400 text-sm mt-2">Currently online</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Error Rate</div>
           <div className="text-3xl font-bold text-slate-900">0.05%</div>
           <div className="text-emerald-500 text-sm mt-2">Stable</div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 flex items-start gap-5">
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
          <i className="fas fa-wrench"></i>
        </div>
        <div>
           <h3 className="font-bold text-amber-900 text-lg">Debug Mode Active</h3>
           <p className="text-amber-800/80 mt-1 leading-relaxed">System calls are currently routed to <strong>Gemini 2.5 Flash</strong> for optimization and lower latency. Logs are verbose.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-xl mb-6 text-slate-900">Prompt Registry</h3>
        <div className="space-y-4">
          {['generateOpportunities', 'generatePlan', 'voiceChatHandler', 'generateTrainingLesson'].map((prompt, i) => (
             <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors group cursor-default">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{prompt}</span>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">v1.2</span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate bg-white p-3 rounded-lg border border-slate-100 group-hover:text-slate-700 transition-colors">
                  SYSTEM: You are NextWave Mentor, an AI engine designed to...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
