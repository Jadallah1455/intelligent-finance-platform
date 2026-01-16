import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Lock, Save, Database, AlertCircle, CheckCircle2, Loader2, LogOut, Trash2, Plus, AlertTriangle, XCircle, FileText, TrendingUp, X, HelpCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

/**
 * ADMIN PANEL TYPES & COMPONENTS
 * This file handles the management of the knowledge base, FAQs, and AI usage insights.
 */

interface QuestionItem {
  id: number;
  question: string;
  count: number;
  last_asked: string;
}

/**
 * COMPONENT: ManageDocs
 * Handles listing and deleting documents from the high-level knowledge base.
 */
const ManageDocs: React.FC<{
  onNotify: (type: 'success' | 'error' | 'warning', msg: string) => void;
  onConfirm: (msg: string, action: () => void) => void;
}> = ({ onNotify, onConfirm }) => {
  const { t } = useApp();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDocs(await res.json());
      } else if (res.status === 401) {
        localStorage.removeItem('dar_admin_token');
        localStorage.removeItem('dar_admin_session');
        window.location.reload();
      }
    } catch (e) {
      console.error("Fetch Docs Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (filename: string) => {
    onConfirm(`${t('confirm.delete_doc')} (${filename})`, async () => {
      try {
        const token = localStorage.getItem('dar_admin_token');
        const res = await fetch(`${API_BASE_URL}/chat/api/admin/documents/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ filename })
        });
        if (res.ok) {
          fetchDocs();
          onNotify('success', t('success.deleted'));
        } else {
          onNotify('error', t('error.delete_failed'));
        }
      } catch (e) {
        onNotify('error', t('error.generic'));
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-3">
          <Database size={24} className="text-brand-600" />
          {t('admin.manage_kb')}
        </h3>
        <button
          onClick={fetchDocs}
          className="text-sm px-5 py-2.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-xl font-bold hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-all border border-brand-100/50 dark:border-brand-800/50"
        >
          {t('admin.refresh')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-brand-500">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {docs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-4">
              <Database size={48} className="opacity-20" />
              <p className="font-medium italic">{t('admin.no_docs')}</p>
            </div>
          ) : docs?.map?.((doc, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={i}
              className="group flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center text-brand-600">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{doc.filename}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t('admin.usage')}: {doc.count} {t('admin.fragments')}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{t('admin.date')}: {doc.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.filename)}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-95"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * COMPONENT: ManageFAQs
 * Allows administrators to manage 'Quick Reply' chips that appear in the chat interface.
 */
const ManageFAQs: React.FC<{
  prefill?: { question: string, answer: string } | null;
  onNotify: (type: 'success' | 'error' | 'warning', msg: string) => void;
  onConfirm: (msg: string, action: () => void) => void;
}> = ({ prefill, onNotify, onConfirm }) => {
  const { t } = useApp();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: prefill?.question || '', answer: prefill?.answer || '' });
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/faqs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFaqs(await res.json());
      } else if (res.status === 401) {
        localStorage.removeItem('dar_admin_token');
        localStorage.removeItem('dar_admin_session');
        window.location.reload();
      }
    } catch (e) {
      console.error("FAQ Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefill) setNewFaq(prefill);
  }, [prefill]);

  useEffect(() => { fetchFaqs(); }, []);

  const handleAdd = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      onNotify('warning', t('error.empty_fields'));
      return;
    }
    try {
      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFaq)
      });
      if (res.ok) {
        setNewFaq({ question: '', answer: '' });
        onNotify('success', t('success.added'));
        fetchFaqs();
      } else {
        onNotify('error', t('error.generic'));
      }
    } catch (e) { onNotify('error', t('error.generic')); }
  };

  const handleDelete = async (id: number) => {
    onConfirm(t('confirm.delete_faq'), async () => {
      try {
        const token = localStorage.getItem('dar_admin_token');
        const res = await fetch(`${API_BASE_URL}/chat/api/admin/faqs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          onNotify('success', t('success.deleted'));
          fetchFaqs();
        } else {
          onNotify('error', t('error.delete_failed'));
        }
      } catch (e) {
        onNotify('error', t('error.generic'));
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-extrabold text-2xl mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
          <Plus size={28} className="text-brand-600" />
          {t('admin.add_faq')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-tight text-slate-400 px-1">{t('admin.faq_question')}</label>
            <input
              type="text"
              placeholder={t('chat.placeholder')}
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-tight text-slate-400 px-1">{t('admin.faq_answer')}</label>
            <input
              type="text"
              placeholder={t('admin.inputAnswer')}
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="bg-brand-700 text-white px-10 py-4 rounded-2xl hover:bg-brand-600 transition-all font-black shadow-xl shadow-brand-700/20 active:scale-95"
        >
          {t('admin.save_changes')}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-extrabold text-2xl mb-8 text-slate-900 dark:text-white">{t('admin.manage_faqs')}</h3>
        {loading ? (
          <div className="flex justify-center p-12 text-brand-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {faqs?.length === 0 ? (
              <p className="text-center py-12 text-slate-400 italic">{t('admin.no_data')}</p>
            ) : faqs?.map?.((faq) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={faq.id}
                className="group flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:border-brand-500/20 transition-all"
              >
                <div className="space-y-1 pr-4">
                  <div className="font-black text-brand-700 dark:text-brand-400 text-lg leading-tight">{faq.question}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic font-medium">"{faq.answer}"</div>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-90 flex-shrink-0"
                >
                  <Trash2 size={24} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * COMPONENT: SmartInsights
 * Displays LLM-generated analytics about user behavior and trending topics.
 */
const SmartInsights: React.FC<{
  onPromote?: (q: any) => void;
  onNotify: (type: 'success' | 'error' | 'warning', msg: string) => void;
}> = ({ onPromote, onNotify }) => {
  const { t } = useApp();
  const [data, setData] = useState<{ topics: any[], insights: string }>({ topics: [], insights: '' });
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/insights`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
      } else if (res.status === 401) {
        localStorage.removeItem('dar_admin_token');
        localStorage.removeItem('dar_admin_session');
        window.location.reload();
      }
    } catch (e) {
      console.error("Insights Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Premium Insight Banner */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
        <h3 className="text-3xl font-black mb-4 flex items-center gap-4">
          <Database size={36} className={loading ? "animate-spin" : "animate-pulse"} />
          {t('admin.smart_insights')}
        </h3>
        <p className="opacity-90 text-xl leading-relaxed max-w-4xl font-medium">
          {loading ? t('admin.insights.analyzing') :
            (data.insights === 'ERROR_API_KEY' ? t('error.api_key') : data.insights || t('admin.insights.summary'))}
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? [1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />
        )) : data?.topics?.map?.((topic, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
          >
            <div className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t('admin.topic')}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-brand-600 transition-colors leading-tight">{topic.name}</div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-brand-700 dark:text-brand-400">{topic.count}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.queries')}</span>
              </div>
              {onPromote && (
                <button
                  onClick={() => onPromote({ question: topic.name, answer: '' })}
                  className="px-5 py-3 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-2xl text-xs font-black hover:bg-brand-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {t('admin.promote_faq')}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && data.topics.length === 0 && (
        <div className="text-center py-20 px-8 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-400 italic">
            {t('admin.no_data')}
          </p>
        </div>
      )}
    </motion.div>
  );
};

/**
 * MAIN COMPONENT: Admin
 * The primary dashboard for Dar Aletiiman Chatbot administration.
 * Includes Auth, Ingestion, Active Learning, and Insights logic.
 */
const Admin: React.FC = () => {
  const { t, dir } = useApp();

  // -- Authentication & Session State --
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // -- UI State --
  const [activeTab, setActiveTab] = useState<'learn' | 'upload' | 'docs' | 'faqs' | 'insights'>('insights');
  const [loading, setLoading] = useState(false);
  const [prefilledFaq, setPrefilledFaq] = useState<{ question: string; answer: string } | null>(null);

  // -- Active Learning (Unanswered Questions) State --
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [trainingStatus, setTrainingStatus] = useState<{ [key: number]: string }>({});
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');

  // -- Knowledge Base Upload State --
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // -- UX & Feedback State --
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [confirming, setConfirming] = useState<{ action: () => void, message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Persistence: Check for an existing active session on mount
  useEffect(() => {
    const session = localStorage.getItem('dar_admin_session');
    if (session === 'active') {
      setIsAuthenticated(true);
      fetchQuestions();
    }
  }, []);

  /**
   * AUTH: handleLogin
   * Securely verifies credentials via the backend API.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        // SECURITY: Store the actual token returned by the server
        localStorage.setItem('dar_admin_token', data.token);
        localStorage.setItem('dar_admin_session', 'active');
        setIsAuthenticated(true);
        showToast('success', t('login.success') || 'تم تسجيل الدخول بنجاح');
        fetchQuestions();
      } else {
        showToast('error', t('login.error_invalid') || 'خطأ في اسم المستخدم أو كلمة المرور');
      }
    } catch (error) {
      console.error("Login Error:", error);
      showToast('error', t('login.error_system') || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  /**
   * AUTH: handleLogout
   * Clears the local session and returns to login screen.
   */
  const handleLogout = () => {
    // SECURITY: Clear tokens and session
    localStorage.removeItem('dar_admin_token');
    localStorage.removeItem('dar_admin_session');
    setIsAuthenticated(false);
  };

  /**
   * UTILITY: exportToCSV
   * Generates and downloads a CSV file containing all currently loaded unanswered questions.
   * Includes BOM for Arabic encoding compatibility in Excel.
   */
  const exportToCSV = () => {
    if (questions.length === 0) return;
    // Add \uFEFF BOM for Excel Arabic support
    const BOM = "\uFEFF";
    const headers = "Question,Answer,Count,Last Asked\n";
    // Add empty Answer column as requested
    const rows = questions.map(q => `"${q.question}","",${q.count},"${q.last_asked}"\n`).join('');
    const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `unanswered_questions_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // Empty string = relative URL

  /**
   * API: fetchQuestions
   * Retrieves the list of unanswered questions from the backend database.
   */
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setQuestions(await res.json());
      } else if (res.status === 401) {
        localStorage.removeItem('dar_admin_token');
        localStorage.removeItem('dar_admin_session');
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * UI ACTION: handlePromoteToFAQ
   * Redirects to the FAQ tab and pre-fills the question field.
   * Includes validation and confirmation as requested.
   */
  const handlePromoteToFAQ = (q: any) => {
    const answer = answers[q.id] || '';
    if (!answer.trim()) {
      showToast('warning', t('admin.error_empty_answer') || 'يرجى كتابة إجابة للسؤال أولاً قبل الترقية');
      return;
    }

    setConfirming({
      message: `${t('confirm.promote_msg') || 'هل أنت متأكد من ترقية هذا السؤال كإجابة شائعة؟'} \n\n (${q.question})`,
      action: async () => {
        setPrefilledFaq({ question: q.question, answer });
        setActiveTab('faqs');
        showToast('success', t('admin.promotion_ready') || 'تم نقل السؤال، يمكنك الآن مراجعته وإضافته');
      }
    });
  };

  /**
   * API: handleTrain
   * Submits a manual answer for a specific question ID. 
   * Triggers an index update on the backend via JIT training.
   */
  const handleTrain = async (id: number) => {
    const answer = answers[id];
    if (!answer?.trim()) {
      showToast('warning', t('admin.error_empty_answer') || 'يرجى كتابة إجابة أولاً');
      return;
    }

    setConfirming({
      message: t('confirm.train') || 'هل أنت متأكد من تدريب النموذج على هذه الإجابة؟',
      action: async () => {
        setTrainingStatus(prev => ({ ...prev, [id]: 'loading' }));
        try {
          const token = localStorage.getItem('dar_admin_token');
          const res = await fetch(`${API_BASE_URL}/chat/api/admin/train`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, answer })
          });

          const result = await res.json();

          if (result.status === 'success') {
            setTrainingStatus(prev => ({ ...prev, [id]: 'success' }));
            showToast('success', t('success.trained') || 'تم تدريب النموذج بنجاح');
            setTimeout(() => {
              setQuestions(prev => prev.filter(q => q.id !== id));
            }, 1500);
          } else {
            setTrainingStatus(prev => ({ ...prev, [id]: 'error' }));
            showToast('error', t('error.train_failed') || 'فشل في عملية التدريب');
          }
        } catch (error) {
          setTrainingStatus(prev => ({ ...prev, [id]: 'error' }));
          showToast('error', t('error.generic') || 'حدث خطأ غير متوقع');
        }
      }
    });
  };

  const handleManualTrain = async () => {
    if (!manualQuestion.trim() || !manualAnswer.trim()) {
      showToast('warning', t('admin.error_empty_fields') || 'يرجى ملء جميع الحقول');
      return;
    }

    setConfirming({
      message: t('confirm.manual_train') || 'هل تريد تدريب البوت على هذا السؤال والجواب المخصصين؟',
      action: async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('dar_admin_token');
          const res = await fetch(`${API_BASE_URL}/chat/api/admin/train`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: -1, question: manualQuestion, answer: manualAnswer })
          });
          const result = await res.json();
          if (result.status === 'success') {
            showToast('success', t('success.trained') || 'تم التدريب بنجاح');
            setManualQuestion('');
            setManualAnswer('');
          } else {
            showToast('error', t('error.train_failed') || 'فشل التدريب');
          }
        } catch (err) {
          showToast('error', t('error.generic') || 'خطأ في الاتصال');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  /**
   * API: handleDeleteQuestion
   * Permanently removes an unanswered question from the database.
   */
  const handleDeleteQuestion = async (id: number) => {
    setConfirming({
      message: t('admin.confirm_delete') || 'هل أنت متأكد من حذف هذا السؤال؟',
      action: async () => {
        try {
          const token = localStorage.getItem('dar_admin_token');
          const res = await fetch(`${API_BASE_URL}/chat/api/admin/questions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            showToast('success', t('success.deleted') || 'تم الحذف');
            fetchQuestions();
          } else {
            showToast('error', t('error.delete_failed') || 'فشل الحذف');
          }
        } catch (e) {
          showToast('error', t('error.generic') || 'خطأ في الاتصال');
        }
      }
    });
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    setUploadStatus('⏳ جاري رفع الملفات...');

    try {
      const formData = new FormData();
      uploadFiles.forEach((file) => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('dar_admin_token');
      const res = await fetch(`${API_BASE_URL}/chat/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (result.status === 'success') {
        setUploadStatus(result.message || '✅ تم رفع وتحليل الملفات بنجاح!');
        setUploadFiles([]);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus(`❌ خطأ: ${result.message || 'فشل رفع الملفات'}`);
      }
    } catch (error) {
      setUploadStatus(`❌ خطأ في الاتصال: ${error}`);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 text-center"
        >
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('admin.login.title')}</h2>
          <p className="text-slate-500 mb-6">{t('admin.access_denied')}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button className="w-full py-3 bg-brand-700 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-700/30 transition-all">
              {t('admin.login.btn')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
          <p className="text-slate-500">{t('admin.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'learn' ? 'bg-white dark:bg-slate-700 shadow text-brand-700 dark:text-brand-400' : 'text-slate-500'}`}
            >
              {t('admin.activeLearning')}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-700 shadow text-brand-700 dark:text-brand-400' : 'text-slate-500'}`}
            >
              {t('admin.upload')}
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'docs' ? 'bg-white dark:bg-slate-700 shadow text-brand-700 dark:text-brand-400' : 'text-slate-500'}`}
            >
              {t('admin.data_mgmt')}
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'faqs' ? 'bg-white dark:bg-slate-700 shadow text-brand-700 dark:text-brand-400' : 'text-slate-500'}`}
            >
              <Database size={14} className="inline mr-1" />
              {t('admin.manage_faqs')}
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'insights' ? 'bg-white dark:bg-slate-700 shadow text-brand-700 dark:text-brand-400' : 'text-slate-500'}`}
            >
              <Database size={14} className="inline mr-1" />
              {t('admin.smart_insights') || 'الذكاء التحليلي'}
            </button>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {activeTab === 'docs' ? (
        <ManageDocs onNotify={showToast} onConfirm={(msg, action) => setConfirming({ message: msg, action })} />
      ) : activeTab === 'faqs' ? (
        <ManageFAQs prefill={prefilledFaq} onNotify={showToast} onConfirm={(msg, action) => setConfirming({ message: msg, action })} />
      ) : activeTab === 'insights' ? (
        <SmartInsights onPromote={handlePromoteToFAQ} onNotify={showToast} />
      ) : activeTab === 'learn' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Manual Training Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-brand-700 dark:text-brand-400">
              <Save size={20} />
              {t('admin.manual_training') || 'تدريب مخصص (إضافة سؤال وجواب جديد)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">{t('admin.question')}</label>
                <input
                  type="text"
                  placeholder={t('admin.inputQuestion') || 'ادخل السؤال هنا...'}
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">{t('admin.answer')}</label>
                <input
                  type="text"
                  placeholder={t('admin.inputAnswer') || 'ادخل الإجابة النموذجية...'}
                  value={manualAnswer}
                  onChange={(e) => setManualAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <button
              onClick={handleManualTrain}
              className="bg-brand-700 text-white px-8 py-3 rounded-xl hover:bg-brand-600 transition-all font-bold shadow-lg shadow-brand-700/20 flex items-center gap-2"
            >
              <Plus size={18} />
              {t('admin.train_now') || 'تدريب النوذج الآن'}
            </button>
          </div>

          {/* Premium Unanswered Questions List */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-2xl flex items-center gap-3 text-slate-900 dark:text-white">
                <AlertCircle size={28} className="text-amber-500" />
                {t('admin.unanswered')}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <FileText size={14} />
                  {t('admin.export_csv')}
                </button>
                <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 rounded-lg text-xs font-black">
                  {questions.length} {t('admin.count')}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                <Loader2 className="animate-spin text-brand-600" size={40} />
                <span className="font-medium animate-pulse">{t('admin.loading_data')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {questions.map((q) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={q.id}
                    className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-brand-500/30 hover:shadow-lg transition-all group relative"
                  >
                    <div className="absolute top-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 rounded-full text-[10px] font-black text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                        <TrendingUp size={12} />
                        {q.count} {t('admin.freq')}
                      </span>
                    </div>

                    <div className="pr-0 pl-0 md:pr-16 md:rtl:pr-0 md:rtl:pl-16 mb-4">
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-relaxed">{q.question}</h4>
                      <p className="text-xs text-slate-400 mt-2 font-mono">{q.last_asked}</p>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                      <div className="flex-grow relative">
                        <input
                          type="text"
                          placeholder={t('admin.inputAnswer')}
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          className="w-full pl-4 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-500/50 outline-none transition-all shadow-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleTrain(q.id)}
                          disabled={!answers[q.id] || trainingStatus[q.id] === 'loading'}
                          className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${trainingStatus[q.id] === 'success'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/20'
                            }`}
                        >
                          {trainingStatus[q.id] === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          <span>{trainingStatus[q.id] === 'success' ? t('admin.saved') : t('admin.train')}</span>
                        </button>

                        <button
                          onClick={() => handlePromoteToFAQ(q)}
                          title={t('admin.promote_faq')}
                          className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                        >
                          <Plus size={20} />
                        </button>

                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          title={t('admin.delete_question')}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-tr from-brand-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <CheckCircle2 size={48} className="text-brand-500" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('admin.all_answered')}</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{t('admin.no_unanswered_desc') || "There are no outstanding questions. Great job keeping up!"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ) : activeTab === 'upload' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Mock Upload Section (Kept visual for now) */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('admin.dragdrop')}</h3>

            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-brand-50 file:text-brand-700
                hover:file:bg-brand-100 mb-4 mx-auto max-w-xs"
            />

            {uploadFiles.length > 0 && (
              <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                {uploadFiles.length} {t('admin.files_selected')}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || uploadFiles.length === 0}
              className={`px-6 py-2 rounded-xl font-bold shadow-lg transition-all ${uploading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30'
                }`}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> {t('admin.processing')}
                </div>
              ) : (
                t('admin.upload_index')
              )}
            </button>

            {uploadStatus && (
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                {uploadStatus}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Database size={20} className="text-brand-500" />
              {t('admin.kb_stats')}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-600 dark:text-slate-300">{t('admin.status')}</span>
                <span className="font-bold text-green-500">{t('admin.active')}</span>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
                {t('admin.kb_note')}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* --- UX FEEDBACK OVERLAYS --- */}
      {/* --- PREMIUM UX FEEDBACK OVERLAYS --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-md border backdrop-blur-md
            ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-700 dark:text-emerald-100' :
                toast.type === 'error' ? 'bg-rose-50/90 border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:border-rose-700 dark:text-rose-100' :
                  'bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-900/90 dark:border-amber-700 dark:text-amber-100'}`}
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-800' : toast.type === 'error' ? 'bg-rose-100 dark:bg-rose-800' : 'bg-amber-100 dark:bg-amber-800'}`}>
              {toast.type === 'success' && <CheckCircle2 size={24} />}
              {toast.type === 'error' && <AlertCircle size={24} />}
              {toast.type === 'warning' && <AlertTriangle size={24} />}
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-sm uppercase tracking-wide opacity-70">
                {toast.type === 'success' ? t('admin.status') : toast.type === 'error' ? 'Error' : 'Warning'}
              </h4>
              <p className="font-medium">{t(toast.message) || toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        )}

        {confirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8 max-w-sm w-full border border-slate-100 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">{t('confirm.title')}</h3>
              <p className="text-center text-slate-500 mb-8">{confirming.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirming(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('confirm.cancel')}
                </button>
                <button
                  onClick={() => { confirming.action(); setConfirming(null); }}
                  className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-lg shadow-brand-600/30 transition-all"
                >
                  {t('confirm.yes')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;