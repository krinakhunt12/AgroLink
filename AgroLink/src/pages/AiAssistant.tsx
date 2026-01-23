
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sprout, AlertCircle, ExternalLink, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAgriculturalAdvice } from '../services/geminiService';
import type { ChatMessage } from '../types';

interface DetailedMessage extends ChatMessage {
  sources?: any[];
}

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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
    <div className="max-w-4xl mx-auto p-0 md:p-6 h-[calc(100vh-80px)] flex flex-col font-sans bg-bg-base/50">
      <Card className="bg-gradient-to-r from-brand-primary-dark via-brand-primary to-brand-primary-light p-6 md:rounded-t-[32px] rounded-none shadow-theme-lg flex items-center justify-between text-white z-10 shrink-0 border-none">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner group">
            <Bot className="text-white w-8 h-8 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{t('ai.title')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-status-success rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              <p className="text-[10px] text-brand-primary-light font-black uppercase tracking-[0.2em] opacity-90">
                {t('ai.liveSearch')}
              </p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="hidden sm:flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <Search size={14} className="text-status-warning" /> {t('ai.grounded')}
        </Badge>
      </Card>

      <div className="flex-1 overflow-y-auto bg-bg-surface/50 backdrop-blur-md p-6 space-y-8 md:border-x border-border-subtle relative custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex items-end max-w-[95%] sm:max-w-[85%] gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-theme border ${msg.sender === 'user' ? 'bg-brand-primary border-brand-primary-dark text-white' : 'bg-status-info border-status-info/20 text-white'}`}>
                {msg.sender === 'user' ? <User size={20} /> : <Sprout size={20} />}
              </div>
              <div className="flex flex-col gap-2">
                <Card className={`px-6 py-5 text-sm leading-relaxed shadow-theme border-none ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-[24px] rounded-tr-none' : 'bg-bg-surface text-text-primary rounded-[24px] rounded-tl-none border border-border-subtle'}`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-border-subtle/50">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                        <ExternalLink size={12} /> {t('ai.sources')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((chunk: any, i: number) => (
                          chunk.web && (
                            <Badge key={i} variant="outline" asChild className="bg-bg-muted/50 hover:bg-brand-primary/10 text-brand-primary font-bold px-3 py-1.5 rounded-xl border-border-subtle transition-all">
                              <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <span className="max-w-[150px] truncate">{chunk.web.title || "લિંક"}</span>
                                <ExternalLink size={10} />
                              </a>
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                <div className={`text-[10px] text-text-muted font-black uppercase tracking-widest px-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex items-end gap-4">
              <div className="w-10 h-10 rounded-2xl bg-status-info flex items-center justify-center text-white shadow-theme">
                <Bot size={20} />
              </div>
              <Card className="flex items-center gap-3 bg-bg-surface px-6 py-5 rounded-[24px] rounded-tl-none border-none shadow-theme">
                <div className="w-2.5 h-2.5 bg-status-info/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-status-info/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-status-info rounded-full animate-bounce"></div>
                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest ml-3 italic">{t('ai.searching')}</span>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-bg-surface p-6 md:rounded-b-[32px] md:border md:border-t-0 shadow-theme-lg relative z-10">
        {messages.length === 1 && !loading && (
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {(t('ai.suggestedQuestions', { returnObjects: true }) as string[]).map((q, idx) => (
              <Button key={idx} variant="ghost" onClick={() => handleSend(q)} className="bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary text-[11px] font-black px-5 py-2.5 rounded-2xl border border-brand-primary/10 transition-all hover:-translate-y-1">
                {q}
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 bg-bg-muted/30 p-2 rounded-[24px] border border-border-subtle focus-within:border-brand-primary transition-all shadow-inner">
          <Input
            variant="ghost"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.placeholder')}
            className="flex-1 bg-transparent py-6 px-5 text-base focus:outline-none font-bold border-none"
          />
          <Button size="icon" onClick={() => handleSend()} disabled={loading || !input.trim()} className="bg-brand-primary text-white w-14 h-14 rounded-2xl hover:bg-brand-primary-dark disabled:opacity-40 transition-all shadow-xl hover:scale-105 active:scale-95">
            <Send size={24} />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5 text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
          <AlertCircle size={14} className="text-status-warning" /> {t('ai.disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
