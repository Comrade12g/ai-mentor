
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../context';
import { MentorService } from '../services/mentorService';
import { Exporter } from '../utils/exporter';

export const DocumentsScreen: React.FC = () => {
  const { selectedIdea } = useContext(AppState);
  const [loading, setLoading] = useState<string | null>(null);

  if (!selectedIdea) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <i className="fas fa-folder-open text-4xl text-slate-300"></i>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">No Active Project</h2>
      <p className="text-slate-500 mb-8 max-w-md text-lg">Select a business opportunity to unlock the automated document generator suite.</p>
      <Link to="/opportunities" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-300 hover:shadow-xl hover:-translate-y-1 duration-200">
        Browse Opportunities
      </Link>
    </div>
  );

  const handleExport = async (type: 'pdf' | 'ppt' | 'excel') => {
    setLoading(type);
    try {
      const sanitizedTitle = selectedIdea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      if (type === 'pdf') {
        const data = await MentorService.generateConceptNote(selectedIdea);
        await Exporter.exportPDF(data, `${sanitizedTitle}_Concept_Note`);
      } else if (type === 'ppt') {
        const data = await MentorService.generatePitchDeck(selectedIdea);
        await Exporter.exportPPTX(data, `${sanitizedTitle}_Pitch_Deck`);
      } else if (type === 'excel') {
        const data = await MentorService.generateFinancials(selectedIdea);
        await Exporter.exportExcel(data, `${sanitizedTitle}_Financials`);
      }
    } catch (e) {
      console.error(e);
      alert('Export failed. Please check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  const DocCard = ({ icon, color, title, desc, type, btnText }: any) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden">
      
      {/* Background Accent */}
      <div className={`absolute top-0 inset-x-0 h-1.5 ${color.split(' ')[0].replace('text', 'bg')}`}></div>

      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        <i className={`fas ${icon}`}></i>
      </div>
      
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed px-2 font-light">{desc}</p>
      
      <button 
        onClick={() => handleExport(type)}
        disabled={!!loading}
        className="mt-auto w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 duration-200"
      >
        {loading === type ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-download"></i>}
        <span>{loading === type ? 'Generating...' : btnText}</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-full">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Professional Documents</h2>
        <p className="text-slate-500 text-xl font-light">
          Instantly generate investor-ready materials for <span className="font-semibold text-slate-900">{selectedIdea.title}</span> using our advanced AI engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DocCard 
          icon="fa-file-pdf" 
          color="bg-rose-50 text-rose-600"
          title="Concept Note"
          desc="A comprehensive 3-5 page strategic overview detailing your problem statement, solution, target market, and execution strategy."
          type="pdf"
          btnText="Download PDF"
        />
        <DocCard 
          icon="fa-file-powerpoint" 
          color="bg-amber-50 text-amber-600"
          title="Pitch Deck"
          desc="A compelling 10-slide presentation outline designed to captivate investors, partners, and stakeholders."
          type="ppt"
          btnText="Download PPT"
        />
        <DocCard 
          icon="fa-file-excel" 
          color="bg-emerald-50 text-emerald-600"
          title="Financial Model"
          desc="Detailed spreadsheets covering startup costs, unit economics, P&L, and 6-month cash flow projections."
          type="excel"
          btnText="Download Excel"
        />
      </div>
    </div>
  );
};
