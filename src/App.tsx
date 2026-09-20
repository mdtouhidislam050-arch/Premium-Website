/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Gamepad2, 
  Info, 
  CheckCircle2, 
  X, 
  FolderPlus,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { AppCategory, AppItem, NavTab } from './types';
import { loadAppsFromStorage, saveAppsToStorage, resetToSampleApps } from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppCard } from './components/AppCard';
import { PublishModal } from './components/PublishModal';
import { EditModal } from './components/EditModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ManageModal } from './components/ManageModal';
import { Footer } from './components/Footer';

const CATEGORIES: readonly ('All' | AppCategory)[] = [
  'All',
  'Apps',
  'Games',
  'Tools',
  'Social',
  'Entertainment',
  'Education',
  'Other',
];

export default function App() {
  // Primary state: apps collection
  const [apps, setApps] = useState<AppItem[]>(() => loadAppsFromStorage());

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [deletingApp, setDeletingApp] = useState<AppItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ id: number; text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToastMessage({ id, text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  // Sync to localStorage whenever apps array changes
  useEffect(() => {
    saveAppsToStorage(apps);
  }, [apps]);

  // Tab navigation handler
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setSelectedCategory('All');
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'apps') {
      setSelectedCategory('Apps');
      setSearchQuery('');
    } else if (tab === 'games') {
      setSelectedCategory('Games');
      setSearchQuery('');
    } else if (tab === 'categories') {
      const el = document.getElementById('category-filter-all');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle Publish new app
  const handlePublish = (newApp: AppItem) => {
    setApps((prev) => [newApp, ...prev]);
    showToast(`Published "${newApp.name}" successfully!`);
    // If the category was filtered, switch or ensure visibility
    if (selectedCategory !== 'All' && selectedCategory !== newApp.category) {
      setSelectedCategory('All');
    }
  };

  // Handle Edit existing app
  const handleSaveEdit = (updatedApp: AppItem) => {
    setApps((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    showToast(`Updated "${updatedApp.name}"`);
  };

  // Handle Delete app
  const handleConfirmDelete = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    setApps((prev) => prev.filter((a) => a.id !== appId));
    showToast(`Deleted "${target?.name || 'App'}"`, 'info');
  };

  // Reset to default samples
  const handleResetSamples = () => {
    const defaultApps = resetToSampleApps();
    setApps(defaultApps);
    showToast('Restored default sample apps');
  };

  // Import apps from JSON backup
  const handleImportApps = (imported: AppItem[]) => {
    if (Array.isArray(imported) && imported.length > 0) {
      setApps(imported);
      showToast(`Imported ${imported.length} apps successfully`);
    }
  };

  // Filtered apps based on search and selected category
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Category filter
      if (selectedCategory !== 'All') {
        if (app.category !== selectedCategory) {
          return false;
        }
      }

      // Search query filter (name, category, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesCategory = app.category.toLowerCase().includes(query);
        const matchesDesc = (app.description || '').toLowerCase().includes(query);
        const matchesDev = (app.developer || '').toLowerCase().includes(query);
        return matchesName || matchesCategory || matchesDesc || matchesDev;
      }

      return true;
    });
  }, [apps, selectedCategory, searchQuery]);

  const customAppsCount = useMemo(() => apps.filter((a) => a.isCustom).length, [apps]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl shadow-emerald-500/10 animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header with Navigation, + Publish App & Manage Apps */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenManage={() => setIsManageOpen(true)}
        totalAppsCount={apps.length}
        customAppsCount={customAppsCount}
      />

      {/* Main Hero & Search & Category Filter Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          if (cat === 'Apps') setActiveTab('apps');
          else if (cat === 'Games') setActiveTab('games');
          else setActiveTab('home');
        }}
        categories={CATEGORIES}
        totalResults={filteredApps.length}
      />

      {/* App Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2">
        {/* Section Heading & Quick Stat Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {selectedCategory === 'All' ? 'All Applications & Games' : `${selectedCategory}`}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
              {filteredApps.length}
            </span>
          </div>

          {/* Quick Publish CTA button for empty or sparse views */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click any app card to open external link
            </span>
            <button
              id="main-grid-publish-btn"
              onClick={() => setIsPublishOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Publish App</span>
            </button>
          </div>
        </div>

        {/* Apps Cards Grid */}
        {filteredApps.length > 0 ? (
          <div 
            id="apps-grid-container"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={(appToEdit) => setEditingApp(appToEdit)}
                onDelete={(appToDelete) => setDeletingApp(appToDelete)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search or Filter State */
          <div 
            id="apps-empty-state"
            className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
              <Layers className="w-8 h-8 text-emerald-400/80" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No apps found</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {searchQuery
                ? `No apps matched "${searchQuery}". Try a different keyword or reset filters.`
                : `There are currently no apps in the "${selectedCategory}" category.`}
            </p>
            <div className="flex items-center gap-3">
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  id="empty-clear-filter-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                id="empty-publish-btn"
                onClick={() => setIsPublishOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Publish App
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenManage={() => setIsManageOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Publish App Modal */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublish={handlePublish}
      />

      {/* Edit App Modal */}
      <EditModal
        isOpen={Boolean(editingApp)}
        app={editingApp}
        onClose={() => setEditingApp(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete App Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingApp)}
        app={deletingApp}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Manage Apps Drawer/Modal */}
      <ManageModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        apps={apps}
        onOpenPublish={() => setIsPublishOpen(true)}
        onEditApp={(app) => {
          setIsManageOpen(false);
          setEditingApp(app);
        }}
        onDeleteApp={(app) => {
          setIsManageOpen(false);
          setDeletingApp(app);
        }}
        onResetSamples={handleResetSamples}
        onImportApps={handleImportApps}
      />
    </div>
  );
}
