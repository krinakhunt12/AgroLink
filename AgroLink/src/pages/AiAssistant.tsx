
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
  const { t } = useTranslation(['common', 'ai']);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: t('ai.welcome'),
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [t]);

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
    <div className="max-w-4xl mx-auto p-0 md:p-6 h-[calc(100vh-80px)] flex flex-col font-sans bg-bg-base">
      <Card className="bg-white p-6 border-b border-border-base rounded-none md:rounded-lg shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-brand-primary/10 p-3 rounded-lg flex items-center justify-center text-brand-primary">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('ai.title')}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                {t('ai.liveSearch')}
              </p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="hidden sm:flex items-center gap-2 bg-bg-muted/50 px-3 py-1.5 rounded-md border-border-base text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          <Search size={14} className="text-text-muted" /> {t('ai.grounded')}
        </Badge>
      </Card>

      <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm p-6 space-y-8 md:border-x border-border-base relative custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[95%] sm:max-w-[85%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary border-brand-primary-dark text-white' : 'bg-white border-border-base text-brand-primary'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Sprout size={16} />}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className={`px-5 py-3.5 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-lg rounded-tr-none' : 'bg-white text-text-primary rounded-lg rounded-tl-none border border-border-base'}`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-base">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ExternalLink size={12} /> {t('ai.sources')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((chunk: any, i: number) => (
                          chunk.web && (
                            <Badge key={i} variant="outline" className="bg-bg-muted/30 hover:bg-bg-muted text-brand-primary font-bold px-2 py-1 rounded border-border-base cursor-pointer">
                              <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 max-w-[120px]">
                                <span className="truncate">{chunk.web.title || t('ai.source')}</span>
                                <ExternalLink size={10} />
                              </a>
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-text-muted font-bold uppercase tracking-widest px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-border-base flex items-center justify-center text-brand-primary shadow-sm">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-lg rounded-tl-none border border-border-base shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-border-base rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-border-base rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-border-base rounded-full"></div>
                </div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest ml-1">{t('ai.searching')}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-6 md:rounded-b-lg md:border md:border-t-0 shadow-sm relative z-10">
        {messages.length === 1 && !loading && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {(t('ai.suggestedQuestions', { returnObjects: true }) as string[]).map((q, idx) => (
              <button key={idx} onClick={() => handleSend(q)} className="bg-bg-muted/50 hover:bg-bg-muted text-brand-primary text-[11px] font-bold px-4 py-2 rounded-lg border border-border-base transition-colors cursor-pointer">
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 bg-bg-muted/50 p-1.5 rounded-lg border border-border-base focus-within:ring-2 focus-within:ring-brand-primary/10 focus-within:border-brand-primary transition-all">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.placeholder')}
            className="flex-1 bg-transparent border-none shadow-none focus:ring-0 text-sm font-medium px-4"
          />
          <Button size="icon" onClick={() => handleSend()} disabled={loading || !input.trim()} className="bg-brand-primary text-white w-10 h-10 rounded-md hover:bg-brand-primary-dark transition-colors cursor-pointer shadow-sm">
            <Send size={18} />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-text-muted font-bold uppercase tracking-widest">
          <AlertCircle size={14} className="text-status-warning" /> {t('ai.disclaimer')}
        </div>
      </div>
    </div>
  );
};


export default AiAssistant;
