import React from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { AppCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  categories: readonly ('All' | AppCategory)[];
  totalResults: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  totalResults,
}) => {
  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-48 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Web Directory & Launcher</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Discover Apps Easily
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto font-normal">
          Find useful apps and games in one place.
        </p>

        {/* Search Bar */}
        <div className="pt-3 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="app-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by app name, category, or description..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 shadow-lg shadow-black/40 transition-all"
            />
            {searchQuery && (
              <button
                id="app-search-clear-btn"
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-filter-${cat.toLowerCase()}`}
                onClick={() => onCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.03]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results summary bar if filter or search is active */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Showing {totalResults} {totalResults === 1 ? 'app' : 'apps'}</span>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                id="reset-all-filters-btn"
                onClick={() => {
                  onSearchChange('');
                  onCategorySelect('All');
                }}
                className="text-emerald-400 hover:underline font-medium ml-1"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
