import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskTolerance } from '../types';
import { User, DollarSign, Target, ShieldAlert } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { userProfile, setUserProfile, setHasOnboarded } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(userProfile);

  const handleChange = (field: keyof typeof userProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    setUserProfile(formData);
    setHasOnboarded(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-2">
            Welcome to FinGenius
          </h1>
          <p className="text-slate-400">Let's build your personalized financial agent profile.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-16 rounded-full ${step >= i ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="text-emerald-400" /> The Basics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">First Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Next: Finances
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <DollarSign className="text-emerald-400" /> Financial Snapshot
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Annual Income</label>
                <input 
                  type="number" 
                  value={formData.income}
                  onChange={(e) => handleChange('income', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Current Savings</label>
                <input 
                  type="number" 
                  value={formData.savings}
                  onChange={(e) => handleChange('savings', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-sm text-slate-400 mb-1">Monthly Expenses</label>
                <input 
                  type="number" 
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleChange('monthlyExpenses', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Next: Risk & Goals
                </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="text-emerald-400" /> Risk Tolerance
            </h2>
            <div className="grid grid-cols-3 gap-4">
                {Object.values(RiskTolerance).map((level) => (
                    <button
                        key={level}
                        onClick={() => handleChange('riskTolerance', level)}
                        className={`p-4 rounded-xl border ${formData.riskTolerance === level ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'} transition-all`}
                    >
                        <span className="block font-bold mb-1">{level}</span>
                        <span className="text-xs opacity-80">
                            {level === 'Conservative' ? 'Prioritize stability.' : level === 'Moderate' ? 'Balanced growth.' : 'Maximum returns.'}
                        </span>
                    </button>
                ))}
            </div>

            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mt-6">
              <Target className="text-emerald-400" /> Primary Goal
            </h2>
            <input 
                  type="text" 
                  placeholder="e.g., Buy a house in 5 years, Retire early..."
                  value={formData.financialGoals[0]}
                  onChange={(e) => handleChange('financialGoals', [e.target.value])}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinish}
                  className="w-2/3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/50"
                >
                  Initialize Agent
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;