import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { UserProfile, ChatMessage, RiskTolerance } from '../types';
import { generateMarketSummary } from '../services/geminiService';

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  chatHistory: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  marketSummary: { summary: string; trends?: any };
  isLoadingMarket: boolean;
  hasOnboarded: boolean;
  setHasOnboarded: (val: boolean) => void;
  resetChat: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Guest',
  age: 30,
  income: 60000,
  savings: 10000,
  monthlyExpenses: 3000,
  riskTolerance: RiskTolerance.Moderate,
  financialGoals: ['Retirement'],
  currency: '$',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [marketSummary, setMarketSummary] = useState<{ summary: string; trends?: any }>({ summary: '' });
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const resetChat = () => {
    setChatHistory([]);
  }

  // Initial Market Data Fetch
  useEffect(() => {
    const fetchMarket = async () => {
      setIsLoadingMarket(true);
      const data = await generateMarketSummary();
      setMarketSummary(data);
      setIsLoadingMarket(false);
    };
    // Only fetch if we have an API key present in env to avoid immediate errors in dev
    if (process.env.API_KEY) {
        fetchMarket();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        chatHistory,
        addMessage,
        marketSummary,
        isLoadingMarket,
        hasOnboarded,
        setHasOnboarded,
        resetChat
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};