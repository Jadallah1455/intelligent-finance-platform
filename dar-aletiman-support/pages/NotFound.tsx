import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useApp();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Animated Robot SVG */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, -5, 5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative mb-8"
            >
                <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full" />
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    {/* Robot Head */}
                    <rect x="50" y="40" width="100" height="80" rx="20" className="fill-brand-700" />
                    <rect x="60" y="50" width="80" height="40" rx="10" className="fill-brand-50" />

                    {/* Eyes */}
                    <motion.circle
                        cx="85" cy="70" r="6" className="fill-brand-700"
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0, 0.95, 1] }}
                    />
                    <motion.circle
                        cx="115" cy="70" r="6" className="fill-brand-700"
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0, 0.95, 1] }}
                    />

                    {/* Antenna */}
                    <line x1="100" y1="40" x2="100" y2="20" stroke="#8a1538" strokeWidth="4" />
                    <motion.circle
                        cx="100" cy="20" r="5" className="fill-brand-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />

                    {/* Robot Body */}
                    <rect x="70" y="125" width="60" height="40" rx="10" className="fill-brand-600" />
                    <rect x="80" y="135" width="40" height="10" rx="5" className="fill-brand-200" />

                    {/* Arms */}
                    <motion.path
                        d="M50 135 C 30 135, 30 155, 45 155"
                        stroke="#b01e42" strokeWidth="8" strokeLinecap="round"
                        animate={{ rotate: [-20, 20, -20] }}
                        style={{ originX: '50px', originY: '135px' }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.path
                        d="M150 135 C 170 135, 170 155, 155 155"
                        stroke="#b01e42" strokeWidth="8" strokeLinecap="round"
                        animate={{ rotate: [20, -20, 20] }}
                        style={{ originX: '150px', originY: '135px' }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>
            </motion.div>

            {/* Content */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-brand-700 mb-4"
            >
                {t('404.title')}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 max-w-md mx-auto mb-8 text-lg"
            >
                {t('404.subtitle')}
            </motion.p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-brand-700 text-white rounded-full font-bold shadow-lg shadow-brand-700/30 hover:bg-brand-600 transition-colors"
            >
                {t('404.cta')}
            </motion.button>
        </div>
    );
};

export default NotFound;
