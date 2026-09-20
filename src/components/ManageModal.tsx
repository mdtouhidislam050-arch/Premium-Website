import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Search, 
  Info, 
  Plus, 
  RotateCcw,
  Download,
  Upload,
  Layers
} from 'lucide-react';
import { AppItem } from '../types';

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onOpenPublish: () => void;
  onEditApp: (app: AppItem) => void;
  onDeleteApp: (app: AppItem) => void;
  onResetSamples: () => void;
  onImportApps?: (imported: AppItem[]) => void;
}

export const ManageModal: React.FC<ManageModalProps> = ({
  isOpen,
  onClose,
  apps,
  onOpenPublish,
  onEditApp,
  onDeleteApp,
  onResetSamples,
  onImportApps,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const filteredApps = apps.filter((app) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      app.name.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.developer.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hushapk_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && onImportApps) {
            onImportApps(parsed);
          }
        } catch {
          alert("Invalid backup file format.");
        }
      };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="manage-modal-container"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Manage Published Apps
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {apps.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View, edit details, or remove published apps from your directory
              </p>
            </div>
          </div>

          <button
            id="manage-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            title="Close manage modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local Storage Disclaimer Note */}
        <div className="px-6 py-3 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between gap-4 text-xs text-emerald-300 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Apps published here are saved locally in this browser.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="manage-export-btn"
              onClick={handleExport}
              className="text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Export apps as JSON backup"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
            <label className="text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Subheader Toolbar: Search + Quick Publish */}
        <div className="p-4 sm:px-6 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="manage-search-input"
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by name, category, or developer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="manage-add-new-btn"
              onClick={() => {
                onClose();
                onOpenPublish();
              }}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + Publish App
            </button>
          </div>
        </div>

        {/* App List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-base font-semibold text-slate-300">No apps found</p>
              <p className="text-xs text-slate-500 mt-1">
                {filterQuery ? 'No app matches your search criteria.' : 'You have not published any apps yet.'}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const itemImage = app.image || app.imageUrl;
              const itemLink = app.link || app.downloadUrl || '#';

              return (
              <div
                key={app.id}
                id={`manage-app-row-${app.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 gap-4 transition-colors"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={app.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Clean fallback avatar on failure
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-400 uppercase">
                        {app.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate">
                        {app.name}
                      </h4>
                      {app.isCustom && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-slate-300 font-medium">{app.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">v{app.version || '1.0.0'}</span>
                      {app.developer && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{app.developer}</span>
                        </>
                      )}
                    </div>
                    <a
                      href={itemLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400/80 hover:text-emerald-300 hover:underline flex items-center gap-1 mt-1 truncate max-w-[260px] sm:max-w-md"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{itemLink}</span>
                    </a>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    id={`manage-test-link-${app.id}`}
                    href={itemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-xs flex items-center gap-1.5 transition-colors"
                    title="Open external link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Visit</span>
                  </a>

                  <button
                    id={`manage-edit-btn-${app.id}`}
                    onClick={() => onEditApp(app)}
                    className="p-2 rounded-lg text-slate-300 hover:text-emerald-400 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Edit app information"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    id={`manage-delete-btn-${app.id}`}
                    onClick={() => onDeleteApp(app)}
                    className="p-2 rounded-lg text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete app"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>

        {/* Footer with Reset Option */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {!resetConfirmOpen ? (
              <button
                id="manage-reset-samples-trigger"
                onClick={() => setResetConfirmOpen(true)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Apps</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-medium">Restore default apps?</span>
                <button
                  id="manage-reset-samples-confirm"
                  onClick={() => {
                    onResetSamples();
                    setResetConfirmOpen(false);
                  }}
                  className="px-2 py-0.5 rounded text-xs bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  Yes, Restore
                </button>
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            id="manage-done-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
