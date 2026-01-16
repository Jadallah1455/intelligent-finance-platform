import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, RefreshCw, Copy, Check, Moon, Sun } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

/**
 * COMPONENT: Chat
 * The main user interface for the AI assistant.
 * Handles real-time messaging, persistent chat history, and quick-reply FAQ chips.
 */
const Chat: React.FC = () => {
  const { t, dir, language, theme, toggleTheme } = useApp();

  /**
   * UX: playNotificationSound
   * Generates a subtle, professional notify sound using the Web Audio API.
   */
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Drop pitch

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Sound blocked or not supported", e);
    }
  };

  // -- Messaging State --
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // -- UI & UX State --
  const [faqs, setFaqs] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Lifecycle: Load existing history or show welcome message
  useEffect(() => {
    const saved = localStorage.getItem('dar_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Hydrate timestamps back into Date objects
        const hydrated = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(hydrated);
        fetchFaqs(); // Load contextual chips even if history exists
        return;
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    // Default: Show first-time welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'init-1',
        role: 'bot',
        content: t('chat.welcome'),
        timestamp: new Date()
      }]);
    }
    fetchFaqs();
  }, [t]);

  /**
   * API: fetchFaqs
   * Retrieves active FAQ data to populate 'Quick Action' chips.
   */
  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/api/faqs`);
      if (res.ok) setFaqs(await res.json());
    } catch (e) { console.error("FAQ Fetch Error:", e); }
  };

  /**
   * UX: scrollToBottom
   * Ensures the latest message is always in the viewport.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Persistence: Save every message change to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('dar_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  /**
   * ACTION: handleReset
   * Wipes the conversation history and restarts the session.
   */
  const handleReset = () => {
    if (!confirm(t('chat.reset_confirm') || 'هل تريد مسح المحادثة؟')) return;
    localStorage.removeItem('dar_chat_history');
    setMessages([{
      id: 'init-1',
      role: 'bot',
      content: t('chat.welcome'),
      timestamp: new Date()
    }]);
  };

  /**
   * API Interaction: handleSend
   * Routes the user message to the Gemini RAG backend.
   */
  const handleSend = async (manualMsg?: string) => {
    const messageContent = manualMsg || input;
    if (!messageContent.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Context preparation for the backend
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      // Logic managed by the RAG services
      const responseText = await sendMessageToGemini(userMsg.content, history);

      let finalContent = responseText;
      if (responseText === 'ERROR_NO_ANSWER') {
        finalContent = t('chat.error.fallback');
      } else if (responseText.startsWith('ERROR_PROCESSING:')) {
        const detail = responseText.replace('ERROR_PROCESSING:', '').trim();
        finalContent = `${t('chat.error.processing')}: ${detail}`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: finalContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      playNotificationSound();
    } catch (error) {
      console.error("Chat API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 overflow-hidden relative">

        {/* --- STICKY NAV HEADER --- */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 z-10 absolute top-0 w-full">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 flex items-center justify-center shadow-sm">
            <Bot size={22} className="text-brand-700 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t('chat.assistant')}</h2>
            <p className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse"></span>
              {t('chat.online')}
            </p>
          </div>
          <div className="mr-auto rtl:mr-0 rtl:ml-auto flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
              title={t('chat.reset_hint')}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE MESSAGE STREAM --- */}
        <div className="flex-grow overflow-y-auto p-4 pt-20 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                  {/* Member Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm overflow-hidden ${msg.role === 'user'
                    ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400'
                    : 'bg-white border border-slate-100'
                    }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={18} className="text-brand-600 dark:text-brand-400" />}
                  </div>

                  {/* Message Content Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed break-words relative group ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-brand-700 to-brand-600 text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none break-words'
                    }`}>
                    <div className="relative">
                      {msg.content}
                      {msg.role === 'bot' && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className={`absolute bottom-0 ${dir === 'rtl' ? '-left-2' : '-right-2'} p-1 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-100 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 flex items-center justify-center`}
                          title={t('chat.copy')}
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-slate-400" />}
                        </button>
                      )}
                    </div>
                    <div className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Thinking / Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 flex items-center justify-center shadow-sm">
                  <Bot size={16} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- QUICK ACTION CHIPS --- */}
          {messages.length < 5 && faqs.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {faqs.slice(0, 5).map(faq => (
                <button
                  key={faq.id}
                  onClick={() => handleSend(faq.question)}
                  className="px-4 py-2 bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/10 dark:to-slate-800 text-brand-700 dark:text-brand-400 rounded-xl text-xs font-bold border border-brand-100 dark:border-brand-800 hover:border-brand-300 hover:shadow-md hover:scale-105 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  {faq.question}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT & SUBMIT CONTROL --- */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('chat.placeholder')}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-slate-900 dark:text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-brand-500/50 focus:outline-none transition-all pr-12 rtl:pr-5 rtl:pl-12 placeholder-slate-400 shadow-inner"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 rtl:right-auto rtl:left-2 p-2 rounded-lg transition-all ${input.trim()
                ? 'bg-brand-700 text-white hover:bg-brand-600 shadow-lg shadow-brand-700/30'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:scale-x-[-1]" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;