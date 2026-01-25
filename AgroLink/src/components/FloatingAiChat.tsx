
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sprout, X, MessageCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAgriculturalAdvice } from '../services/geminiService';
import type { ChatMessage } from '../types';

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
          text: t('ai.welcome'),
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
        <div className="pointer-events-auto bg-bg-surface rounded-lg shadow-theme w-[90vw] md:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden border border-border-base mb-4">
          <div className="bg-brand-primary p-4 text-text-on-brand flex justify-between items-center shadow-theme">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{t('ai.title')}</h3>
                <p className="text-[10px] text-text-on-brand/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                  {t('ai.liveSearch')}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors cursor-pointer">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-bg-base space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] ${msg.sender === 'user' ? 'bg-status-info text-text-on-brand' : 'bg-brand-primary text-text-on-brand'}`}>
                    {msg.sender === 'user' ? <User size={12} /> : <Sprout size={12} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`px-4 py-2.5 text-xs rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-status-info text-text-on-brand rounded-br-none' : 'bg-bg-surface text-text-secondary rounded-bl-none border border-border-base'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border-base flex flex-wrap gap-1">
                          {msg.sources.map((chunk: any, i: number) => chunk.web && (
                            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-brand-primary font-bold bg-brand-primary/10 px-1.5 py-0.5 rounded border border-brand-primary/20 flex items-center gap-1 cursor-pointer">
                              {t('ai.source')} <ExternalLink size={8} />
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
                  <div className="w-6 h-6 rounded-md bg-brand-primary flex items-center justify-center text-text-on-brand">
                    <Bot size={12} />
                  </div>
                  <div className="bg-bg-surface p-3 rounded-lg rounded-bl-none border border-border-base shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="mb-4 flex flex-wrap gap-2 px-2">
                {(t('ai.suggestedQuestions', { returnObjects: true }) as string[]).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-3 py-2 rounded-lg border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-bg-surface border-t border-border-base">
            <div className="flex items-center gap-2 bg-bg-muted p-1.5 rounded-lg border border-border-base focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.placeholder')}
                className="flex-1 bg-transparent px-3 text-xs focus:outline-none min-w-0 font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-brand-primary text-text-on-brand rounded-full hover:bg-brand-primary-dark disabled:opacity-50 transition shadow-sm cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all flex items-center justify-center relative bg-brand-primary text-white cursor-pointer`}>
        {isOpen ? <X size={28} /> : (
          <>
            <MessageCircle size={28} fill="white" className="drop-shadow-sm" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
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
