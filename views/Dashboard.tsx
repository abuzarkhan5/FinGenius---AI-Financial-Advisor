import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, DollarSign, AlertCircle } from 'lucide-react';
import { GenericChart } from '../components/charts/GenericChart';
import { RiskTolerance } from '../types';

export const Dashboard: React.FC = () => {
  const { userProfile, marketSummary, isLoadingMarket } = useApp();

  // Mock projection for dashboard visual
  const netWorthProjection = {
      type: 'line' as const,
      title: 'Projected Net Worth',
      description: 'Based on your current savings rate and conservative 5% growth.',
      data: [
          { name: '2024', value: userProfile.savings },
          { name: '2025', value: userProfile.savings * 1.05 + 12000 },
          { name: '2026', value: userProfile.savings * 1.10 + 24000 },
          { name: '2027', value: userProfile.savings * 1.15 + 36000 },
          { name: '2028', value: userProfile.savings * 1.21 + 48000 },
      ]
  };

  const allocation = {
      type: 'pie' as const,
      title: 'Suggested Allocation',
      description: `Based on ${userProfile.riskTolerance} risk profile.`,
      data: userProfile.riskTolerance === RiskTolerance.Aggressive 
      ? [
          { name: 'Stocks', value: 70 },
          { name: 'Crypto/Alt', value: 10 },
          { name: 'Bonds', value: 10 },
          { name: 'Cash', value: 10 },
      ]
      : [
          { name: 'Stocks', value: 50 },
          { name: 'Bonds', value: 30 },
          { name: 'Cash', value: 20 },
      ]
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-slate-900 text-slate-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hello, {userProfile.name}</h1>
        <p className="text-slate-400">Here is your financial command center.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Net Income (Monthly)" 
            value={`${userProfile.currency}${(userProfile.income / 12).toFixed(0)}`} 
            icon={<DollarSign className="text-emerald-400" />}
        />
        <StatCard 
            title="Monthly Savings" 
            value={`${userProfile.currency}${((userProfile.income/12) - userProfile.monthlyExpenses).toFixed(0)}`} 
            subValue={`${(((userProfile.income/12 - userProfile.monthlyExpenses) / (userProfile.income/12)) * 100).toFixed(1)}% rate`}
            icon={<Wallet className="text-blue-400" />}
        />
        <StatCard 
            title="Risk Profile" 
            value={userProfile.riskTolerance} 
            icon={<PieIcon className="text-purple-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Summary Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500"/> Market Pulse
            </h2>
            {isLoadingMarket ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="text-sm text-slate-300 leading-relaxed">
                        {marketSummary.summary || "Market data unavailable. Check your API key."}
                    </div>
                    {marketSummary.trends && (
                        <div className="mt-4 h-48">
                            <GenericChart data={marketSummary.trends} />
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Projections */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
             <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown size={20} className="text-blue-500"/> 5-Year Projection
            </h2>
            <div className="h-64">
                <GenericChart data={netWorthProjection} />
            </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Allocation */}
         <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="h-64">
                <GenericChart data={allocation} />
            </div>
         </div>

         {/* Actions */}
         <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col justify-center">
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                <div>
                    <h4 className="font-semibold text-yellow-500 text-sm">Optimization Tip</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Your cash savings ratio is slightly high for your {userProfile.riskTolerance} profile. Consider moving 10% into a high-yield ETF. Ask FinGenius for details.
                    </p>
                </div>
            </div>
            <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-colors">
                Update Financial Goals
            </button>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon }: any) => (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm font-medium">{title}</span>
            <div className="p-2 bg-slate-700/50 rounded-lg">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subValue && <div className="text-xs text-emerald-400 mt-1 font-medium">{subValue}</div>}
    </div>
);