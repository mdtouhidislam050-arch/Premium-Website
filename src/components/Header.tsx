import React, { useState } from 'react';
import { 
  Plus, 
  Settings2, 
  Sparkles, 
  Menu, 
  X, 
  Compass, 
  Gamepad2, 
  LayoutGrid, 
  Smartphone 
} from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenPublish: () => void;
  onOpenManage: () => void;
  totalAppsCount: number;
  customAppsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenPublish,
  onOpenManage,
  totalAppsCount,
  customAppsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          id="header-logo-btn"
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Smartphone className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Hush
              </span>
              <span className="text-xs font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                APK
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Web App Hub
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          <button
            id="nav-home-btn"
            onClick={() => handleNav('home')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            Home
          </button>
          <button
            id="nav-apps-btn"
            onClick={() => handleNav('apps')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'apps'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Apps
          </button>
          <button
            id="nav-games-btn"
            onClick={() => handleNav('games')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'games'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Games
          </button>
          <button
            id="nav-categories-btn"
            onClick={() => handleNav('categories')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Categories
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Manage Apps button */}
          <button
            id="header-manage-apps-btn"
            onClick={onOpenManage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20"
            title="Manage your published apps"
          >
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Manage Apps</span>
            <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {totalAppsCount}
            </span>
          </button>

          {/* + Publish App button (Prominent) */}
          <button
            id="header-publish-app-btn"
            onClick={onOpenPublish}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all duration-150 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="whitespace-nowrap">+ Publish App</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c121e] px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
            <button
              id="mobile-nav-home-btn"
              onClick={() => handleNav('home')}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              Home
            </button>
            <button
              id="mobile-nav-apps-btn"
              onClick={() => handleNav('apps')}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'apps' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Apps
            </button>
            <button
              id="mobile-nav-games-btn"
              onClick={() => handleNav('games')}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'games' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Games
            </button>
            <button
              id="mobile-nav-categories-btn"
              onClick={() => handleNav('categories')}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'categories' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Categories
            </button>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="mobile-publish-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPublish();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + Publish App
            </button>
            <button
              id="mobile-manage-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenManage();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 border border-slate-700"
            >
              <Settings2 className="w-4 h-4" />
              Manage Apps ({totalAppsCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
