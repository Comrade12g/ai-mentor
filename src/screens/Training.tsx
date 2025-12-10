
import React, { useState, useContext } from 'react';
import { MentorService } from '../services/mentorService';
import { UserService } from '../services/userService';
import { useVoice } from '../hooks/useVoice';
import { TrainingLesson } from '../types';
import { AppState } from '../context';

export const TrainingScreen: React.FC = () => {
  const { user, setUser } = useContext(AppState);
  const [lesson, setLesson] = useState<TrainingLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const { speak, isSpeaking } = useVoice();

  const predefinedTopics = [
    { title: "Finding Product-Market Fit", icon: "fa-puzzle-piece", color: "text-purple-600 bg-purple-100" },
    { title: "Basic Bookkeeping", icon: "fa-calculator", color: "text-emerald-600 bg-emerald-100" },
    { title: "Digital Marketing 101", icon: "fa-bullhorn", color: "text-pink-600 bg-pink-100" },
    { title: "Effective Sales Pitching", icon: "fa-handshake", color: "text-orange-600 bg-orange-100" },
    { title: "Managing Cash Flow", icon: "fa-money-bill-wave", color: "text-cyan-600 bg-cyan-100" },
    { title: "Customer Service", icon: "fa-headset", color: "text-indigo-600 bg-indigo-100" }
  ];

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setQuizAnswers({}); // Reset quiz answers on new lesson
    try {
      const data = await MentorService.generateTrainingLesson(topic);
      setLesson(data);
    } catch (e) {
      console.error(e);
      alert("Failed to generate lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!lesson || !user) return;
    const completed = user.completedLessons || [];
    
    if (!completed.includes(lesson.topic)) {
      const newCompletedList = [...completed, lesson.topic];
      setUser({
        ...user,
        completedLessons: newCompletedList
      });

      try {
        await UserService.markLessonComplete(user.uid, lesson.topic);
      } catch (e) {
        console.error("Failed to sync progress:", e);
      }
    }
  };

  const isCompleted = (topic: string) => user?.completedLessons?.includes(topic);

  const handlePlay = () => {
    if (!lesson) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    } else {
      const fullText = `${lesson.title}. ${lesson.modules.map(m => `${m.heading}. ${m.body}`).join('. ')}`;
      speak(fullText);
    }
  };

  const handleAnswer = (qIdx: number, option: string) => {
    if (quizAnswers[qIdx]) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <i className="fas fa-graduation-cap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"></i>
        </div>
        <p className="mt-6 text-slate-500 font-medium">Curating your curriculum...</p>
      </div>
    );
  }

  if (lesson) {
    const completed = isCompleted(lesson.topic);
    return (
      <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-24">
        <button onClick={() => setLesson(null)} className="mb-8 text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium transition">
           <i className="fas fa-arrow-left"></i> Back to Courses
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Lesson Module</div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{lesson.title}</h1>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handlePlay}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition font-semibold shadow-sm ${
                isSpeaking ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-headphones'}`}></i>
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
            <button 
              onClick={handleComplete}
              disabled={completed}
              className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition font-semibold shadow-md ${
                completed 
                  ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 transform active:scale-95'
              }`}
            >
              <i className={`fas ${completed ? 'fa-check-circle' : 'fa-circle-check'}`}></i>
              {completed ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>

        <div className="grid gap-8 mb-12">
          {lesson.modules.map((mod, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100">{idx + 1}</span>
                {mod.heading}
              </h3>
              <p className="text-slate-600 leading-8 text-lg font-light">{mod.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-slate-900/20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <i className="fas fa-clipboard-question text-yellow-400"></i> Knowledge Check
            </h3>
            <div className="grid gap-6">
                {lesson.quiz.map((q, idx) => {
                    const userAnswer = quizAnswers[idx];
                    const isAnswered = !!userAnswer;
                    const isCorrect = userAnswer === q.correctAnswer;

                    return (
                        <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="font-semibold text-lg mb-6">{idx + 1}. {q.question}</p>
                            <div className="grid gap-3">
                                {q.options.map((opt, oi) => {
                                    let btnClass = "w-full text-left p-4 rounded-xl border transition flex justify-between items-center ";
                                    
                                    if (isAnswered) {
                                        if (opt === q.correctAnswer) {
                                            btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium";
                                        } else if (opt === userAnswer) {
                                            btnClass += "bg-rose-500/20 border-rose-500 text-rose-200";
                                        } else {
                                            btnClass += "bg-transparent border-white/10 text-slate-400 opacity-50";
                                        }
                                    } else {
                                        btnClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-200";
                                    }

                                    return (
                                        <button 
                                            key={oi} 
                                            onClick={() => handleAnswer(idx, opt)}
                                            disabled={isAnswered}
                                            className={btnClass}
                                        >
                                            <span>{opt}</span>
                                            {isAnswered && opt === q.correctAnswer && <i className="fas fa-check text-emerald-400"></i>}
                                            {isAnswered && opt === userAnswer && opt !== q.correctAnswer && <i className="fas fa-times text-rose-400"></i>}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {isAnswered && (
                                <div className={`mt-4 text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isCorrect ? 'Correct Answer' : `Correct answer: ${q.correctAnswer}`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Skill Academy</h2>
           <p className="text-slate-500 text-lg mt-2">Master the fundamentals of modern entrepreneurship.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="text-right">
             <div className="text-2xl font-bold text-slate-900 leading-none">{user?.completedLessons?.length || 0}</div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
             <i className="fas fa-trophy"></i>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {predefinedTopics.map((topic, idx) => {
          const completed = isCompleted(topic.title);
          return (
            <button 
              key={idx}
              onClick={() => handleGenerate(topic.title)}
              className={`relative text-left p-8 rounded-3xl border transition-all duration-300 group ${
                completed 
                  ? 'bg-emerald-50/50 border-emerald-100' 
                  : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {completed && (
                <div className="absolute top-6 right-6 text-emerald-500 bg-emerald-100 p-1.5 rounded-full">
                  <i className="fas fa-check text-sm"></i>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110 ${topic.color}`}>
                  <i className={`fas ${topic.icon}`}></i>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${completed ? 'text-emerald-900' : 'text-slate-900 group-hover:text-blue-600'}`}>
                {topic.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium">10 min module</p>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Custom Learning Path</h3>
                <p className="text-slate-400">Ask the AI to generate a lesson on any specific topic you need.</p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
                <input 
                    type="text" 
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Supply Chain Management..."
                    className="flex-1 md:w-80 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button 
                    onClick={() => customTopic && handleGenerate(customTopic)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 whitespace-nowrap"
                >
                    Start
                </button>
            </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  );
};
