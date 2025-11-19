import React from 'react';
import { ChatMessage } from '../../types';
import { GenericChart } from '../charts/GenericChart';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-emerald-600' : 'bg-blue-600'}`}>
          {isModel ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col`}>
            <div className={`px-5 py-4 rounded-2xl shadow-md ${
                isModel 
                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}>
                {/* Text Content with simple whitespace handling for Markdown-like feel */}
                <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {message.content}
                </div>
                
                {/* Grounding Sources */}
                {message.groundings && message.groundings.length > 0 && (
                    <div className="mt-3 text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                        <span className="font-semibold mr-2">Sources:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                        {message.groundings.map((chunk, idx) => {
                            if (chunk.web) {
                                return (
                                    <a 
                                        key={idx} 
                                        href={chunk.web.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 truncate max-w-[200px]"
                                    >
                                        {chunk.web.title || chunk.web.uri}
                                    </a>
                                );
                            }
                            return null;
                        })}
                        </div>
                    </div>
                )}
            </div>

            {/* Disclaimer for Model */}
            {isModel && (
                 <div className="mt-1 ml-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    FinGenius AI • Not Legal Advice
                 </div>
            )}

            {/* Chart Rendering */}
            {message.chartData && (
                <div className="mt-4 w-full max-w-lg animate-fade-in-up">
                    <GenericChart data={message.chartData} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};