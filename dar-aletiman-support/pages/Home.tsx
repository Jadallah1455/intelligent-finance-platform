import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calculator, FileText, MessageCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const Home: React.FC = () => {
  const { t, dir } = useApp();
  const IconArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-sm font-medium border border-brand-200 dark:border-brand-800/50">
          <Shield size={14} />
          <span>{t('hero.subtitle')}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {t('hero.welcome')}
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>

        <div className="pt-4">
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-brand-700 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-700/30 flex items-center gap-3 mx-auto transition-colors"
            >
              {t('hero.cta')}
              <IconArrow size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        <ActionCard 
          icon={<FileText size={32} />}
          title={t('card.finance')}
          desc={t('card.finance.desc')}
          delay={0}
        />
        <ActionCard 
          icon={<Calculator size={32} />}
          title={t('card.calc')}
          desc={t('card.calc.desc')}
          delay={0.1}
        />
        <ActionCard 
          icon={<MessageCircle size={32} />}
          title={t('card.contact')}
          desc={t('card.contact.desc')}
          delay={0.2}
          link="/chat"
        />
      </motion.div>
    </div>
  );
};

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; delay: number; link?: string }> = ({ icon, title, desc, delay, link }) => {
  const Content = (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-colors shadow-sm hover:shadow-md cursor-pointer h-full flex flex-col gap-4 group"
    >
      <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  return link ? <Link to={link}>{Content}</Link> : Content;
};

export default Home;