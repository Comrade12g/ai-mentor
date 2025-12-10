
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppState } from '../context';
import { MentorService } from '../services/mentorService';

export const PlanScreen: React.FC = () => {
  const { user, selectedIdea, plan, setPlan } = useContext(AppState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedIdea && !plan && !loading) {
      setLoading(true);
      MentorService.generatePlan(user, selectedIdea)
        .then(p => setPlan(p))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [user, selectedIdea, plan, loading]);

  if (!selectedIdea) return <Navigate to="/opportunities" />;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-full">
      <div className="mb-10 pb-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">90-Day Roadmap</h2>
          <p className="text-slate-500 mt-2 text-lg">
            Execution strategy for <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">{selectedIdea.title}</span>
          </p>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2">
           <i className="fas fa-bullseye text-rose-500"></i> Goal: Launch in 13 Weeks
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-blue-600">
               <i className="fas fa-rocket"></i>
            </div>
          </div>
          <p className="text-xl font-bold text-slate-800">Architecting your success plan...</p>
          <p className="text-slate-500 mt-2">Breaking down 90 days into actionable steps.</p>
        </div>
      )}

      {!loading && plan && (
        <div className="space-y-10 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-slate-200 to-transparent -translate-x-1/2 hidden md:block"></div>
          
          {plan.weeks.map((week, index) => (
            <div key={week.weekNumber} className="relative flex flex-col md:flex-row items-center justify-between md:odd:flex-row-reverse group">
              
              {/* Center Node */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-md z-10 flex items-center justify-center font-bold text-sm hidden md:flex">
                W{week.weekNumber}
              </div>
              
              {/* Mobile Node */}
              <div className="flex md:hidden items-center gap-4 mb-4 w-full">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    W{week.weekNumber}
                 </div>
                 <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {/* Spacer for the other side */}
              <div className="w-full md:w-[calc(50%-3rem)] hidden md:block"></div>
              
              {/* Content Card */}
              <div className="w-full md:w-[calc(50%-3rem)] bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h3 className="text-lg font-bold text-slate-800">Week {week.weekNumber} Objectives</h3>
                </div>
                
                <div className="space-y-4">
                  {week.tasks.map((task, ti) => (
                    <div key={ti} className="group/task flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="mt-1 relative">
                        <input 
                            type="checkbox" 
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer" 
                        />
                        <i className="fas fa-check text-white text-[10px] absolute top-1 left-1 opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-slate-800 text-sm group-hover/task:text-blue-700 transition-colors leading-snug">{task.title}</h4>
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            task.difficulty > 3 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {task.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{task.detail}</p>
                        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 font-medium">
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
