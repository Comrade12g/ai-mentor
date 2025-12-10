import React, { useState, useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { MentorService } from '../services/mentorService';
import { VoiceUtterance } from '../types';

export const VoiceMentor: React.FC = () => {
  const { isListening, transcript, isSpeaking, startListening, stopListening, speak } = useVoice();
  const [history, setHistory] = useState<VoiceUtterance[]>([]);
  const [processing, setProcessing] = useState(false);

  // Auto-send when silence is detected or manual stop (simplified for demo: manual stop triggers send)
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
      speak(response.replyText);
    } catch (e) {
      console.error(e);
      alert("Voice connection failed. Check API Key.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center text-slate-400 mt-20">
            <i className="fas fa-microphone text-6xl mb-4"></i>
            <p>Tap the mic to start talking to your AI Mentor.</p>
          </div>
        )}
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {processing && <div className="text-center text-sm text-slate-500 animate-pulse">Mentor is thinking...</div>}
      </div>

      <div className="p-6 bg-white border-t border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full text-center text-slate-500 min-h-[1.5em] italic">
            {isListening ? transcript || "Listening..." : "Ready"}
          </div>
          
          <button 
            onClick={handleToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
              isListening 
                ? 'bg-red-500 text-white scale-110 shadow-red-500/50 shadow-lg' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 shadow-lg'
            }`}
          >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};