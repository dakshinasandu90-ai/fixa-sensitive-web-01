import React, { useState, useEffect } from 'react';
import { FixaLogo } from './FixaLogo';
import {
  Smartphone,
  Apple,
  Download,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181824] via-[#101017] to-[#0a0a0f] border-2 border-red-600/80 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden">
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-red-600 p-2 rounded-lg transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center text-center">
            <FixaLogo size="lg" glow={true} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Web App (PWA)</span>
            </div>
            <h2 className="mt-2 text-2xl font-black font-heading text-white">
              INSTALL FIXA GAMING APP
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              ඔබේ Phone එකට FIXA GAMING App එකක් ලෙස Install කරගන්නා ආකාරය.
            </p>
          </div>

          {/* Android Flow */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-heading flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android Phones (Samsung, Xiaomi, Vivo etc.)</span>
              </span>
            </div>

            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>1-Tap Install App to Phone</span>
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5">
                <p>1. Chrome Browser එකේ උඩ දකුණු කෙළවරේ තියෙන <strong>Three Dots (⋮)</strong> ඔබන්න.</p>
                <p>2. <strong>"Install app"</strong> හෝ <strong>"Add to Home screen"</strong> තෝරන්න.</p>
                <p className="text-emerald-400 font-semibold">✓ එවිට Phone එකේ Screen එකට FIXA GAMING App එක එකතු වේ.</p>
              </div>
            )}
          </div>

          {/* iPhone Flow */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5 text-xs">
            <span className="font-bold text-white font-heading flex items-center gap-2">
              <Apple className="w-4 h-4 text-slate-200" />
              <span>Apple iPhone (iOS)</span>
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <span>1. Safari browser එකේ පහළ ඇති</span>
                <Share className="w-3.5 h-3.5 text-blue-400 inline" />
                <strong>Share Button</strong>
                <span>එක ඔබන්න.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>2. පහළට scroll කර</span>
                <PlusSquare className="w-3.5 h-3.5 text-slate-200 inline" />
                <strong>"Add to Home Screen"</strong>
                <span>තෝරන්න.</span>
              </p>
              <p className="text-emerald-400 font-semibold">✓ එවිට iPhone Home Screen එකට App එක Install වේ.</p>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-[11px] text-zinc-500">
              * මෙය Website එකක් මෙන්ම ඕනෑම Phone එකක Native Mobile App එකක් ලෙස ක්‍රියා කරයි.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
