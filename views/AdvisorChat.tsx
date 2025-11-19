import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageBubble } from '../components/Chat/MessageBubble';
import { generateFinancialAdvice } from '../services/geminiService';
import { Send, Plus, Loader2, StopCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const AdvisorChat: React.FC = () => {
  const { chatHistory, addMessage, userProfile, resetChat } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    addMessage(userMsg);
    setInputValue('');
    setIsProcessing(true);

    try {
        const result = await generateFinancialAdvice(userMsg.content, chatHistory, userProfile);
        
        const modelMsg: ChatMessage = {
            id: uuidv4(),
            role: 'model',
            content: result.text,
            timestamp: Date.now(),
            chartData: result.chart,
            groundings: result.groundings
        };
        addMessage(modelMsg);

    } catch (error) {
        const errorMsg: ChatMessage = {
            id: uuidv4(),
            role: 'model',
            content: "I'm having trouble connecting to the financial network right now. Please check your API key or try again.",
            timestamp: Date.now()
        };
        addMessage(errorMsg);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    if (chatHistory.length > 0) {
        if (window.confirm("Start a new conversation? Current chat history will be cleared.")) {
            resetChat();
        }
    } else {
        resetChat();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-white">FinGenius Advisor</h2>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> 
                    Online & Ready
                </p>
            </div>
            <button 
                onClick={handleNewChat}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="New Chat"
            >
                <Plus size={20} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/20">
                        <BotIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">How can I help you today?</h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-8">
                        I can simulate portfolios, analyze market trends, or optimize your budget.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                        <SuggestionCard text="Simulate a recession scenario for my portfolio" onClick={(t) => setInputValue(t)} />
                        <SuggestionCard text="Optimize my monthly budget of $4000" onClick={(t) => setInputValue(t)} />
                        <SuggestionCard text="Compare S&P 500 vs Nasdaq performance" onClick={(t) => setInputValue(t)} />
                        <SuggestionCard text="Plan a tax-efficient retirement strategy" onClick={(t) => setInputValue(t)} />
                    </div>
                </div>
            ) : (
                chatHistory.map(msg => <MessageBubble key={msg.id} message={msg} />)
            )}
            {isProcessing && (
                 <div className="flex items-center gap-2 text-slate-500 ml-4 text-sm mt-4 animate-pulse">
                    <Loader2 className="animate-spin text-emerald-500" size={14} />
                    FinGenius is analyzing market data...
                 </div>
            )}
            <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="max-w-4xl mx-auto relative">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask for financial advice..."
                    className="w-full bg-slate-800 text-white rounded-2xl pl-4 pr-12 py-4 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none overflow-hidden min-h-[60px] max-h-[150px] shadow-inner"
                    rows={1}
                />
                <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isProcessing}
                    className="absolute right-2 bottom-2.5 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/20"
                >
                    {isProcessing ? <StopCircle size={20} /> : <Send size={20} />}
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-2">
                FinGenius AI • Market Data via Google Search • Not Financial Advice
            </p>
        </div>
    </div>
  );
};

const SuggestionCard = ({ text, onClick }: { text: string, onClick: (t: string) => void }) => (
    <button 
        onClick={() => onClick(text)}
        className="text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-emerald-500/50 transition-all text-sm text-slate-300 flex items-center justify-between group"
    >
        <span>"{text}"</span>
        <Send size={12} className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
    </button>
)

const BotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);