import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { AppItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onClose: () => void;
  onConfirm: (appId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  app,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !app) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="delete-confirm-modal-container"
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="delete-confirm-close-btn"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1.5">
          Delete App?
        </h3>
        
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Are you sure you want to remove <span className="font-semibold text-white">"{app.name}"</span>? This will permanently delete the app card from your local storage.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            id="delete-cancel-btn"
            onClick={onClose}
            className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            id="delete-confirm-action-btn"
            onClick={() => {
              onConfirm(app.id);
              onClose();
            }}
            className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
