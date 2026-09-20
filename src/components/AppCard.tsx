import React, { useState } from 'react';
import { ExternalLink, Check, Copy, MoreVertical, Edit, Trash2, Smartphone, ShieldCheck } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  onEdit?: (app: AppItem) => void;
  onDelete?: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onEdit, onDelete }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const displayImage = app.image || app.imageUrl;
  const displayLink = app.link || app.downloadUrl || '#';

  // Reset image failure flag whenever the app image changes
  React.useEffect(() => {
    setImageFailed(false);
  }, [displayImage]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Games':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case 'Social':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Tools':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Entertainment':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'Education':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Apps':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700';
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(displayLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setShowMenu(false);
  };

  return (
    <div 
      id={`app-card-${app.id}`}
      className="group relative flex flex-col justify-between bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      <div>
        {/* Card Header: App Image, Name & Meta */}
        <div className="flex items-start gap-4">
          {/* App Image - Clickable */}
          <a
            id={`app-card-img-link-${app.id}`}
            href={displayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 relative block rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            title={`Open ${app.name}`}
          >
            {displayImage && !imageFailed ? (
              <img
                src={displayImage}
                alt={app.name}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xl border border-slate-700/60 bg-slate-800 group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span className="text-xl font-bold uppercase tracking-wider text-emerald-400">
                  {app.name.charAt(0) || 'A'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">HushAPK</span>
              </div>
            )}
          </a>

          {/* Title, Developer, Category, Options */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <a
                id={`app-card-title-link-${app.id}`}
                href={displayLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1 focus:outline-none focus:underline"
                title={app.name}
              >
                {app.name}
              </a>

              {/* Card Context Menu (Edit/Delete/Copy) */}
              {(onEdit || onDelete) && (
                <div className="relative shrink-0">
                  <button
                    id={`app-card-menu-btn-${app.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <div 
                      className="absolute right-0 top-7 z-30 w-36 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl backdrop-blur-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        id={`app-card-copy-btn-${app.id}`}
                        onClick={handleCopyLink}
                        className="w-full px-3 py-1.5 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Link'}
                      </button>
                      {onEdit && (
                        <button
                          id={`app-card-edit-btn-${app.id}`}
                          onClick={() => {
                            setShowMenu(false);
                            onEdit(app);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit App
                        </button>
                      )}
                      {onDelete && (
                        <button
                          id={`app-card-delete-btn-${app.id}`}
                          onClick={() => {
                            setShowMenu(false);
                            onDelete(app);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete App
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Developer Name */}
            {app.developer && (
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                {app.developer}
              </p>
            )}

            {/* Category and Version Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryColor(app.category)}`}>
                {app.category}
              </span>
              {app.version && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/50">
                  v{app.version}
                </span>
              )}
              {app.isCustom && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/20">
                  Local
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-3.5 leading-relaxed font-normal">
          {app.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer: Visit / Download button */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 truncate max-w-[120px] sm:max-w-[140px]" title={displayLink}>
          {(() => {
            try {
              const url = new URL(displayLink);
              return url.hostname;
            } catch {
              return 'External Link';
            }
          })()}
        </div>

        {/* Visit / Download button */}
        <a
          id={`app-card-download-btn-${app.id}`}
          href={displayLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-500 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 group/btn"
          title={`Visit or Download ${app.name}`}
        >
          <span>Visit / Download</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
