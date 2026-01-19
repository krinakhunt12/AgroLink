
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sprout, MessageCircle, AlertCircle, ExternalLink, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAgriculturalAdvice } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SUGGESTED_QUESTIONS } from '../constants';

interface DetailedMessage extends ChatMessage {
  sources?: any[];
}

const AiAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "નમસ્તે ખેડૂત મિત્રો! હું તમારો AI કૃષિ સલાહકાર છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: DetailedMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { text: responseText, sources } = await getAgriculturalAdvice(text);
      const aiMsg: DetailedMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        sources: sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-6 h-[calc(100vh-80px)] flex flex-col font-sans bg-stone-50">
      <div className="bg-gradient-to-r from-green-700 via-green-800 to-emerald-900 p-5 md:rounded-t-3xl shadow-xl flex items-center justify-between text-white z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner group">
            <Bot className="text-white w-7 h-7 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{t('ai.title')}</h2>
            <p className="text-xs text-green-100 flex items-center gap-1.5 opacity-90">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {t('ai.liveSearch')}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
          <Search size={12} className="text-yellow-400" /> {t('ai.grounded')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm p-4 space-y-6 md:border-x md:border-gray-100 relative custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex items-end max-w-[90%] sm:max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.sender === 'user' ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-green-700 border-green-800 text-white'}`}>
                {msg.sender === 'user' ? <User size={18} /> : <Sprout size={18} />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`px-5 py-4 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-3xl rounded-tr-none' : 'bg-white text-gray-800 rounded-3xl rounded-tl-none border border-gray-100'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <ExternalLink size={10} /> {t('ai.sources')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((chunk: any, i: number) => (
                          chunk.web && (
                            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-green-50 text-[10px] text-green-700 font-bold px-2 py-1 rounded border border-gray-200 hover:border-green-200 flex items-center gap-1">
                              {chunk.web.title || "લિંક"} <ExternalLink size={8} />
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-gray-400 font-medium px-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex items-end gap-3">
              <div className="w-9 h-9 rounded-2xl bg-green-700 flex items-center justify-center text-white">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-4 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <span className="text-xs text-gray-400 font-bold ml-2 italic">{t('ai.searching')}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-5 md:rounded-b-3xl md:border md:border-t-0 shadow-2xl relative z-10">
        {messages.length === 1 && !loading && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button key={idx} onClick={() => handleSend(q)} className="bg-green-50 hover:bg-green-100 text-green-800 text-[11px] font-bold px-4 py-2 rounded-2xl border border-green-100 transition-all hover:-translate-y-0.5">
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-3xl border border-gray-200 focus-within:border-green-500 transition-all">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('ai.placeholder')} className="flex-1 bg-transparent py-3 px-4 text-sm focus:outline-none font-medium" />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="bg-green-700 text-white p-4 rounded-2xl hover:bg-green-800 disabled:opacity-40 transition-all shadow-lg">
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <AlertCircle size={12} className="text-amber-500" /> {t('ai.disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
