import React from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function AffiliateLink() {
  const { t } = useLanguage();
  
  return (
    <Link 
      href="https://interviewcoder.firstpromoter.com/login"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-[14px] border border-primary/70 bg-black/40 hover:bg-black/60 transition-colors shadow-[0_0_15px_rgba(255,255,0,0.3)]"
      aria-label="Become an affiliate"
    >
      <Coins className="h-5 w-5 text-primary" strokeWidth={1.5} />
      <span className="text-primary text-sm font-medium">{t('misc.affiliate')}</span>
    </Link>
  );
} 