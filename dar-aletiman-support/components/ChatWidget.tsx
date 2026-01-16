import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import Chat from '../pages/Chat'; // Reusing the Chat component

const ChatWidget: React.FC = () => {
    const { dir } = useApp();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-24 z-[9999] w-[90vw] md:w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col ${dir === 'rtl' ? 'left-6 origin-bottom-left' : 'right-6 origin-bottom-right'}`}
                    >
                        <div className="flex-grow overflow-hidden relative">
                            <Chat />
                        </div>
                        {/* Overlay header to close */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`absolute top-3 z-[100] w-8 h-8 flex items-center justify-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors ${dir === 'rtl' ? 'left-3' : 'right-3'}`}
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button (FAB) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 z-[9999] w-16 h-16 rounded-full bg-brand-700 hover:bg-brand-600 text-white shadow-xl shadow-brand-700/30 flex items-center justify-center transition-all duration-300 ${dir === 'rtl'
                    ? 'left-6'
                    : 'right-6'
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </>
    );
};

export default ChatWidget;
