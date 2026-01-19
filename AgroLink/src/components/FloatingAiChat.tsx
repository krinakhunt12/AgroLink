
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sprout, X, MessageCircle, ChevronDown, Sparkles, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAgriculturalAdvice } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SUGGESTED_QUESTIONS } from '../constants';

interface DetailedMessage extends ChatMessage {
  sources?: any[];
}

const FloatingAiChat: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setMessages([
        {
          id: '1',
          text: "રામ રામ! હું તમારો ખેતી મદદનીશ છું. તમને શેની માહિતી જોઈએ છે?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-[90vw] md:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden border border-gray-100 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-4 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{t('ai.title')}</h3>
                <p className="text-[10px] text-green-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  ગૂગલ સર્ચ ચાલુ છે
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-green-700 text-white'}`}>
                    {msg.sender === 'user' ? <User size={12} /> : <Sprout size={12} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`px-4 py-2.5 text-xs rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                          {msg.sources.map((chunk: any, i: number) => chunk.web && (
                            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-1">
                              સ્ત્રોત <ExternalLink size={8} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-lg bg-green-700 flex items-center justify-center text-white">
                    <Bot size={12} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-3xl border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-50 transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="તમારો પ્રશ્ન..."
                className="flex-1 bg-transparent px-3 text-xs focus:outline-none min-w-0 font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-green-700 text-white rounded-full hover:bg-green-800 disabled:opacity-50 transition shadow-lg"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`pointer-events-auto p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center justify-center relative hover:shadow-orange-500/20 ${isOpen ? 'bg-red-500 rotate-90 text-white' : 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 text-white'}`}>
        {isOpen ? <X size={28} /> : (
          <>
            <MessageCircle size={28} fill="white" className="drop-shadow-sm" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white text-[8px] font-black text-white items-center justify-center uppercase">AI</span>
            </span>
          </>
        )}
      </button>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FloatingAiChat;
