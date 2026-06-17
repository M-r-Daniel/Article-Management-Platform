import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  articleTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

/**
 * Delete Confirmation Modal dialog.
 */
export function DeleteConfirmModal({
  articleTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal Dialog Card */}
      <div className="relative max-w-md w-full glass-effect p-6 rounded-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl h-fit">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Delete Article</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-200">"{articleTitle}"</span>? This action is
              permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--color-border-dark)] text-slate-300 hover:bg-slate-800/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/20 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmModal;
