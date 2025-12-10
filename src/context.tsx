import React from 'react';
import { UserProfile, Opportunity, PlanJSON } from './types';

export const AppState = React.createContext<{
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
