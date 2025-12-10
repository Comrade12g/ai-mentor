import React, { useState } from 'react';
import { UserProfile } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ ...profile, uid: 'local-user', skills: profile.skills || [], interests: profile.interests || [] } as UserProfile);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Welcome to NextWave</h1>
      <p className="mb-8 text-slate-600">Let's build your entrepreneurial profile to find the perfect opportunity.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-300 rounded-lg"
            value={profile.name} 
            onChange={e => setProfile({...profile, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City / Country</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-300 rounded-lg"
            value={profile.location} 
            onChange={e => setProfile({...profile, location: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Available Capital (approx USD)</label>
          <select 
            className="w-full p-2 border border-slate-300 rounded-lg"
            value={profile.budget} 
            onChange={e => setProfile({...profile, budget: e.target.value})}
          >
            <option value="">Select range</option>
            <option value="0-100">$0 - $100 (Bootstrap)</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-2000">$500 - $2,000</option>
            <option value="2000+">$2,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills (comma separated)</label>
          <input 
            type="text" 
            placeholder="e.g. Sales, Coding, Cooking"
            className="w-full p-2 border border-slate-300 rounded-lg"
            onChange={e => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start My Journey
        </button>
      </form>
    </div>
  );
};