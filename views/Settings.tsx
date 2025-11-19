import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskTolerance } from '../types';
import { Save, RotateCcw, Shield, Wallet, User } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userProfile, setUserProfile, setHasOnboarded, resetChat } = useApp();
  const [formData, setFormData] = useState(userProfile);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof userProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setUserProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetApp = () => {
    if (window.confirm("Are you sure? This will wipe all your data and return to the welcome screen.")) {
        resetChat();
        setHasOnboarded(false);
    }
  };

  return (
    <div className="p-6 md:p-10 overflow-y-auto h-full bg-slate-950 text-slate-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Settings & Profile</h1>
        <p className="text-slate-400 mb-8">Manage your personal information and AI agent preferences.</p>

        {/* Profile Section */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="text-emerald-400" size={24} /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Display Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                 <div>
                    <label className="block text-sm text-slate-400 mb-1">Age</label>
                    <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => handleChange('age', parseInt(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>
        </section>

        {/* Finances Section */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Wallet className="text-blue-400" size={24} /> Financial Context
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Annual Income</label>
                    <input 
                        type="number" 
                        value={formData.income}
                        onChange={(e) => handleChange('income', parseInt(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Total Savings/Investments</label>
                    <input 
                        type="number" 
                        value={formData.savings}
                        onChange={(e) => handleChange('savings', parseInt(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                 <div>
                    <label className="block text-sm text-slate-400 mb-1">Monthly Expenses</label>
                    <input 
                        type="number" 
                        value={formData.monthlyExpenses}
                        onChange={(e) => handleChange('monthlyExpenses', parseInt(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Primary Goal</label>
                     <input 
                        type="text" 
                        value={formData.financialGoals[0]}
                        onChange={(e) => handleChange('financialGoals', [e.target.value])}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>
        </section>

        {/* Risk Section */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="text-purple-400" size={24} /> Risk Profile
            </h2>
             <div className="grid grid-cols-3 gap-4">
                {Object.values(RiskTolerance).map((level) => (
                    <button
                        key={level}
                        onClick={() => handleChange('riskTolerance', level)}
                        className={`p-4 rounded-xl border ${formData.riskTolerance === level ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'} transition-all`}
                    >
                        <span className="block font-bold mb-1">{level}</span>
                        <span className="text-xs opacity-80 hidden md:block">
                            {level === 'Conservative' ? 'Stability first.' : level === 'Moderate' ? 'Balanced approach.' : 'Growth focused.'}
                        </span>
                    </button>
                ))}
            </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
            >
                <Save size={20} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>

            <button 
                onClick={handleResetApp}
                className="ml-auto flex items-center gap-2 text-red-400 hover:text-red-300 py-3 px-6 rounded-xl transition-all"
            >
                <RotateCcw size={18} /> Reset Application
            </button>
        </div>

      </div>
    </div>
  );
};