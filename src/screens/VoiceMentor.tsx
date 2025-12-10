
import React, { useState, useEffect, useContext } from 'react';
import { useVoice } from '../hooks/useVoice';
import { MentorService } from '../services/mentorService';
import { VoiceService } from '../services/voiceService';
import { VoiceUtterance, VoiceSession } from '../types';
import { AppState } from '../context';

export const VoiceMentor: React.FC = () => {
  const { user } = useContext(AppState);
  const { isListening, transcript, isSpeaking, startListening, stopListening, speak } = useVoice();
  
  // Chat State
  const [history, setHistory] = useState<VoiceUtterance[]>([]);
  const [processing, setProcessing] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // View State
  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  
  // History State
  const [pastSessions, setPastSessions] = useState<VoiceSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (viewMode === 'history' && user) {
      loadHistory();
    }
  }, [viewMode, user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const sessions = await VoiceService.getSessions(user.uid);
      setPastSessions(sessions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      handleSend(transcript);
    } else {
      startListening();
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newHistory = [...history, { role: 'user', text, timestamp: Date.now() } as VoiceUtterance];
    setHistory(newHistory);
    setProcessing(true);

    try {
      const response = await MentorService.voiceReply(
        newHistory.map(h => ({ role: h.role, text: h.text })), 
        text
      );
      
      const botMsg: VoiceUtterance = { role: 'assistant', text: response.replyText, timestamp: Date.now() };
      setHistory([...newHistory, botMsg]);
      if (response.sessionSummary) {
        setSessionSummary(response.sessionSummary);
      }
      speak(response.replyText);
    } catch (e) {
      console.error(e);
      alert("Voice connection failed. Check API Key.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveSession = async () => {
    if (!user || history.length === 0) return;
    setSaveStatus('saving');
    try {
      await VoiceService.saveSession(user.uid, history, sessionSummary);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      if (viewMode === 'history') loadHistory();
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await VoiceService.deleteSession(id);
      setPastSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete session.");
    }
  };

  const filteredSessions = pastSessions.filter(s => {
    const term = searchQuery.toLowerCase();
    const sumMatch = s.summary?.toLowerCase().includes(term);
    const textMatch = s.transcript.some(u => u.text.toLowerCase().includes(term));
    return sumMatch || textMatch;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown Date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' • ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Voice Mentor</h2>
           <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Business Coach</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('live')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'live' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Live Chat
          </button>
          <button 
            onClick={() => setViewMode('history')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'history' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Session History
          </button>
        </div>
      </div>

      {viewMode === 'live' ? (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {history.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200 mb-6 animate-pulse">
                   <i className="fas fa-microphone text-4xl text-blue-500"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to brainstorm?</h3>
                <p className="text-slate-400">Tap the microphone to start the conversation.</p>
              </div>
            )}
            
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-200' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {processing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div className="h-24"></div> {/* Spacer for bottom bar */}
          </div>

          {/* Floating Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 p-4 rounded-3xl shadow-2xl shadow-slate-300 flex items-center justify-between gap-4 ring-1 ring-slate-200">
              <div className="flex-1 text-center text-slate-500 text-sm font-medium italic truncate px-4">
                {isListening ? (
                  <span className="text-blue-600 animate-pulse">{transcript || "Listening..."}</span>
                ) : "Mic is off"}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleToggle}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' 
                      : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 hover:scale-110'
                  }`}
                >
                  <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>

                {history.length > 0 && (
                  <button 
                    onClick={handleSaveSession}
                    disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all border ${
                      saveStatus === 'saved' 
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Save Session"
                  >
                    <i className={`fas ${saveStatus === 'saved' ? 'fa-check' : saveStatus === 'saving' ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col p-6 max-w-5xl mx-auto w-full">
          <div className="mb-6">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-3.5 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search your conversations..." 
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <i className="fas fa-circle-notch fa-spin mr-3 text-blue-600"></i> Retrieving archives...
            </div>
          ) : filteredSessions.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl m-4">
               <i className="fas fa-history text-4xl mb-3 opacity-50"></i>
               <p>No saved sessions matching your criteria.</p>
             </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
              {filteredSessions.map((session) => (
                <div key={session.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    onClick={() => setExpandedSessionId(expandedSessionId === session.id ? null : session.id)}
                    className="p-5 cursor-pointer flex justify-between items-start group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {session.summary || "Untitled Consultation"}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                         <i className="far fa-calendar"></i> {formatDate(session.createdAt)}
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <span>{session.transcript.length} turns</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                       >
                         <i className="fas fa-trash-alt"></i>
                       </button>
                       <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 transition-transform ${expandedSessionId === session.id ? 'rotate-180' : ''}`}>
                         <i className="fas fa-chevron-down text-slate-500"></i>
                       </div>
                    </div>
                  </div>
                  
                  {expandedSessionId === session.id && (
                    <div className="bg-slate-50/50 p-5 border-t border-slate-100 space-y-4 max-h-96 overflow-y-auto">
                      {session.transcript.map((msg, i) => (
                         <div key={i} className={`flex gap-4 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm shadow-sm ${msg.role === 'assistant' ? 'bg-white text-blue-600 border border-slate-100' : 'bg-blue-600 text-white'}`}>
                              <i className={`fas ${msg.role === 'assistant' ? 'fa-robot' : 'fa-user'}`}></i>
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-blue-50 border border-blue-100 text-slate-800'}`}>
                              {msg.text}
                            </div>
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
