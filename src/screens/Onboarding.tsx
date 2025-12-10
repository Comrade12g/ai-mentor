
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UserService } from '../services/userService';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    location: '',
    budget: '',
    skills: [],
    interests: []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const uid = 'demo_user_123'; 
    const newProfile = { 
      ...profile, 
      uid, 
      skills: profile.skills || [], 
      interests: profile.interests || [],
      completedLessons: [] 
    } as UserProfile;

    try {
      await UserService.createUser(newProfile);
      onComplete(newProfile);
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Something went wrong saving your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Profile Setup</h1>
          <p className="text-slate-500 text-lg font-light">Let's calibrate the AI to your specific context.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location (City/Country)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                  value={profile.location} 
                  onChange={e => setProfile({...profile, location: e.target.value})}
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Available Capital (USD)</label>
              <div className="relative">
                <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <select 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition appearance-none"
                  value={profile.budget} 
                  onChange={e => setProfile({...profile, budget: e.target.value})}
                >
                  <option value="">Select capital range</option>
                  <option value="0-100">$0 - $100 (Bootstrap)</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="500-2000">$500 - $2,000</option>
                  <option value="2000+">$2,000+</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Top Skills (Comma Separated)</label>
              <textarea 
                rows={3}
                placeholder="e.g. Sales, Python, Graphic Design, Agriculture..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition resize-none"
                onChange={e => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-xl shadow-blue-600/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 transform hover:-translate-y-1"
            >
              {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : 'Initialize Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
