import React from 'react';
import { Smartphone, ExternalLink, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenPublish: () => void;
  onOpenManage: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPublish,
  onOpenManage,
  onSelectCategory,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070a12] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">HushAPK</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              A minimalist, browser-based hub to easily discover, publish, and manage applications and games with external launch and download links.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Optimized for GitHub Pages & Offline Browsers</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPublish}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  + Publish App
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenManage}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Manage Published Apps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Games')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Featured Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Tools')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Developer & Power Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Local Storage Notice */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Browser Storage
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apps published here are saved locally in your browser’s localStorage. Your links and customized cards persist across page reloads on this device.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HushAPK. Client-side app catalog website.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Direct External Links</span>
            <span>•</span>
            <span>Zero Backend Dependency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
