import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/Onboarding';
import { Dashboard } from './views/Dashboard';
import { AdvisorChat } from './views/AdvisorChat';
import { Settings } from './views/Settings';
import { LayoutDashboard, MessageSquare, Settings as SettingsIcon } from 'lucide-react';

// Internal component to consume context
const MainLayout = () => {
  const { hasOnboarded } = useApp();
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'settings'>('dashboard');

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                F
            </div>
            <span className="font-bold text-xl tracking-tight hidden md:block">FinGenius</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2">
            <NavItem 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')} 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
            />
            <NavItem 
                active={activeView === 'chat'} 
                onClick={() => setActiveView('chat')} 
                icon={<MessageSquare size={20} />} 
                label="Advisor Chat" 
            />
        </nav>

        <div className="p-4 border-t border-slate-800">
             <button 
                onClick={() => setActiveView('settings')}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeView === 'settings' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'}`}
             >
                <SettingsIcon size={20} />
                <span className="hidden md:block text-sm font-medium">Settings</span>
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'chat' && <AdvisorChat />}
        {activeView === 'settings' && <Settings />}
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
    >
        {icon}
        <span className="font-medium hidden md:block">{label}</span>
    </button>
)

const App = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;