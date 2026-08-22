import React, { useState, useEffect } from 'react';
import { Category, KSKItem } from '../types';
import { renderCategoryIcon, getCategoryTheme } from '../utils/styleUtils';
import { formatKskNumber } from '../utils/kskUtils';
import { X, ArrowRightLeft, Trash2, ArrowRight, AlertTriangle, Edit3, Save, Sparkles, MapPin } from 'lucide-react';

interface KskActionModalProps {
  item: KSKItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onEditKsk: (item: KSKItem, newKskNumber: string, newDescription?: string, newCategoryId?: string) => void;
  onMoveKsk: (item: KSKItem, targetCategoryId: string) => void;
  onRemoveKsk: (item: KSKItem) => void;
}

export const KskActionModal: React.FC<KskActionModalProps> = ({
  item,
  categories,
  isOpen,
  onClose,
  onEditKsk,
  onMoveKsk,
  onRemoveKsk,
}) => {
  if (!isOpen || !item) return null;

  const currentCategory = categories.find((c) => c.id === item.categoryId) || {
    id: item.categoryId,
    name: 'UNASSIGNED',
    color: 'blue',
    icon: 'map-pin',
  };

  const [activeTab, setActiveTab] = useState<'options' | 'edit' | 'move' | 'remove'>('options');
  const [selectedTargetCatId, setSelectedTargetCatId] = useState<string>(
    categories.find((c) => c.id !== item.categoryId)?.id || categories[0]?.id || ''
  );
  const [editKskNumber, setEditKskNumber] = useState<string>(item.kskNumber);
  const [editDescription, setEditDescription] = useState<string>(item.description || '');
  const [editCategoryId, setEditCategoryId] = useState<string>(item.categoryId);
  const [editError, setEditError] = useState<string>('');

  useEffect(() => {
    if (item) {
      setEditKskNumber(item.kskNumber);
      setEditDescription(item.description || '');
      setEditCategoryId(item.categoryId);
      setSelectedTargetCatId(categories.find((c) => c.id !== item.categoryId)?.id || categories[0]?.id || '');
      setActiveTab('options');
      setEditError('');
    }
  }, [item, categories]);

  const currentTheme = getCategoryTheme(currentCategory.color);
  const formattedEditNumber = formatKskNumber(editKskNumber);

  const handleConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatKskNumber(editKskNumber);
    if (!formatted) {
      setEditError('KSK number cannot be empty.');
      return;
    }
    onEditKsk(item, formatted, editDescription.trim(), editCategoryId);
    onClose();
  };

  const handleConfirmMove = () => {
    if (selectedTargetCatId && selectedTargetCatId !== item.categoryId) {
      onMoveKsk(item, selectedTargetCatId);
      onClose();
    }
  };

  const handleConfirmRemove = () => {
    onRemoveKsk(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="ksk-action-modal"
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-mono font-black text-sm">
              KSK
            </div>
            <div>
              <h2 className="text-lg font-black font-mono tracking-wider text-slate-900">
                {item.kskNumber}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span>Emplacement:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.badgeBorder}`}>
                  {currentCategory.name}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1">
          {activeTab === 'options' && (
            <div className="flex flex-col gap-4">
              {item.description && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <span className="text-slate-500 font-bold uppercase mr-1">Note:</span>
                  {item.description}
                </div>
              )}

              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  id="btn-action-edit"
                  onClick={() => setActiveTab('edit')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>EDIT KSK NUMBER</span>
                </button>

                {categories.length > 1 && (
                  <button
                    id="btn-action-move"
                    onClick={() => setActiveTab('move')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                    <span>MOVE EMPLACEMENT</span>
                  </button>
                )}

                <button
                  id="btn-action-remove"
                  onClick={() => setActiveTab('remove')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-300 font-bold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>REMOVE KSK</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors mt-1 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleConfirmEdit} className="flex flex-col gap-3.5">
              {editError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-bold">
                  {editError}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="edit-ksk-number" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    KSK Number *
                  </label>
                  <span className="text-[10px] text-blue-600 font-bold">
                    Auto-formats 3 or 4 digits
                  </span>
                </div>
                <input
                  id="edit-ksk-number"
                  type="text"
                  value={editKskNumber}
                  onChange={(e) => {
                    setEditKskNumber(e.target.value);
                    setEditError('');
                  }}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none shadow-2xs"
                  autoFocus
                />
                {formattedEditNumber && formattedEditNumber !== editKskNumber && (
                  <p className="mt-1 text-xs text-blue-700 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    Auto-formatted: <span className="font-bold">{formattedEditNumber}</span>
                  </p>
                )}
              </div>

              {categories.length > 0 && (
                <div>
                  <label htmlFor="edit-ksk-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Emplacement
                  </label>
                  <select
                    id="edit-ksk-category"
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="edit-ksk-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Note (Optional)
                </label>
                <input
                  id="edit-ksk-desc"
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. Wire connector check"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none shadow-2xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="btn-save-edit-ksk"
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE CHANGES</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('options')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {activeTab === 'move' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Emplacement:
                </label>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${currentTheme.badgeBg} ${currentTheme.badgeBorder}`}>
                  {renderCategoryIcon(currentCategory.icon, 'w-4 h-4')}
                  <span className={`font-bold text-xs uppercase ${currentTheme.badgeText}`}>
                    {currentCategory.name}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="move-target-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Choose New Emplacement:
                </label>
                <select
                  id="move-target-category"
                  value={selectedTargetCatId}
                  onChange={(e) => setSelectedTargetCatId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} disabled={cat.id === item.categoryId} className="bg-white text-slate-900">
                      {cat.name} {cat.id === item.categoryId ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  id="btn-confirm-move"
                  onClick={handleConfirmMove}
                  disabled={!selectedTargetCatId || selectedTargetCatId === item.categoryId}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>MOVE KSK</span>
                </button>
                <button
                  onClick={() => setActiveTab('options')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {activeTab === 'remove' && (
            <div className="flex flex-col gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Remove KSK {item.kskNumber}?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  This will remove the KSK from the board. You can re-add it anytime.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  id="btn-confirm-remove"
                  onClick={handleConfirmRemove}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  REMOVE
                </button>
                <button
                  onClick={() => setActiveTab('options')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
