import React, { useState, useEffect, useRef } from 'react';
import { FixaLogo } from './FixaLogo';
import {
  Bot,
  Send,
  X,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Maximize2,
  Minimize2,
  Zap,
  Flame,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'fixa-ai';
  text: string;
  timestamp: string;
  copied?: boolean;
}

const SUGGESTED_PROMPTS = [
  'Optimize my phone for Free Fire.',
  'Generate my best sensitivity.',
  'Help me reduce FPS drops.',
  'Recommend a four-finger HUD.',
  'Which guns are best for rushing?',
  'Explain the latest Free Fire update.',
  'Mage phone eka Redmi Note 12, FPS drop wena eka hadaganne kohomada?',
];

export interface FixaAIChatProps {
  activeDeviceContext?: { brand: string; model: string; style: string };
  externalTrigger?: { query: string; timestamp: number } | null;
}

export const FixaAIChat: React.FC<FixaAIChatProps> = ({
  activeDeviceContext,
  externalTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fixa_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'msg_init',
        sender: 'fixa-ai',
        text: '🔥 **Welcome to FIXA AI!** I am your dedicated Garena Free Fire and Free Fire MAX esports coach.\n\nI can help you calibrate **custom sensitivity**, **maximize FPS**, build **2 to 5-finger HUD layouts**, troubleshoot **ping/stutters**, or analyze **meta guns & updates**.\n\n*Sinhala, Singlish සහ English භාෂාවෙන් ඕනෑම Free Fire ප්‍රශ්නයක් අහන්න!*',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fixa_ai_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Map history for Gemini
      const conversationHistory = messages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          deviceContext: activeDeviceContext,
          conversationHistory,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.response || data.error || 'No response from FIXA AI.';

      const aiMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'fixa-ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'fixa-ai',
          text: `⚠️ Error reaching FIXA AI server: ${err.message || 'Please check your connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalTrigger?.query) {
      setIsOpen(true);
      handleSendMessage(externalTrigger.query);
    }
  }, [externalTrigger]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    const resetMsg: ChatMessage[] = [
      {
        id: 'msg_reset',
        sender: 'fixa-ai',
        text: '🔥 Conversation cleared. Ask me anything about Free Fire sensitivity, graphics, HUDs, or tournament strategies!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(resetMsg);
    localStorage.removeItem('fixa_ai_chat_history');
  };

  return (
    <>
      {/* Floating Launch Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-2 pr-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)] border-2 border-red-500/70 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative w-11 h-11 rounded-full bg-black flex items-center justify-center p-1 overflow-hidden border border-red-400">
            <FixaLogo size="sm" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading font-black text-sm tracking-wider flex items-center gap-1 leading-none">
              FIXA AI <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </span>
            <span className="text-[10px] text-red-200 uppercase tracking-widest font-semibold mt-0.5">
              FF Expert Assistant
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-[#0f0f13] border-2 border-red-600/80 shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all overflow-hidden ${
            isExpanded
              ? 'inset-3 md:inset-8 rounded-2xl'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[92vw] sm:w-[440px] h-[580px] max-h-[88vh] rounded-2xl'
          }`}
        >
          {/* Top Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-red-950 via-zinc-900 to-black border-b border-red-600/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <FixaLogo size="sm" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm tracking-wide text-white">FIXA AI</h3>
                  <span className="px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 text-[10px] font-mono border border-red-500/30 font-semibold">
                    FF MAX
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span>English • සිංහල • Singlish</span>
                  {activeDeviceContext?.model && (
                    <span className="text-red-400 font-semibold truncate max-w-[140px]">
                      • {activeDeviceContext.model}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="hidden sm:block p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close FIXA AI"
                className="p-1.5 hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950/70">
            {messages.map((msg) => {
              const isAi = msg.sender === 'fixa-ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <FixaLogo size="sm" />
                    </div>
                  )}

                  <div
                    className={`relative max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-zinc-900 border border-zinc-800 text-slate-200'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    }`}
                  >
                    {/* Message content */}
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400/80 gap-3">
                      <span>{msg.timestamp}</span>
                      {isAi && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-red-400 bg-zinc-900/80 border border-red-900/60 p-3 rounded-2xl w-fit">
                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                <span className="font-heading font-semibold tracking-wide">
                  FIXA AI analyzing Free Fire parameters...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-3 py-2 bg-zinc-900/90 border-t border-zinc-800/80 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-red-600/80 hover:text-white text-zinc-300 text-[11px] font-medium border border-zinc-700/60 transition-all cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FIXA AI (Sensitivity, FPS, HUD, guns, OB updates)..."
              disabled={isLoading}
              className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
