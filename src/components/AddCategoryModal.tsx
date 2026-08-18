import React, { useState } from 'react';
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from '../utils/styleUtils';
import { X, FolderPlus, Sparkles, AlertCircle } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (name: string, color: string, icon: string, meaning?: string) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [meaning, setMeaning] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].id);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0].id);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a category name.');
      return;
    }

    onAddCategory(trimmed.toUpperCase(), selectedColor, selectedIcon, meaning.trim() || undefined);
    setName('');
    setMeaning('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="add-category-modal"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-industrial tracking-wider text-black">
                ADD EMPLACEMENT
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Add a new tracking emplacement column to the KSK dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Emplacement Name */}
          <div>
            <label htmlFor="cat-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Emplacement Name *
            </label>
            <input
              id="cat-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WAIT QUALITY, PRE-PACK, SPECIAL REWORK"
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-bold uppercase text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
              autoFocus
            />
          </div>

          {/* Full Meaning / Description */}
          <div>
            <label htmlFor="cat-meaning-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Meaning / Description (Optional)
            </label>
            <input
              id="cat-meaning-input"
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="e.g. Waiting Quality Inspection"
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs font-medium"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Emplacement Color Accent *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    selectedColor === c.id
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${c.bg} shadow-2xs border border-black/10`} />
                  <span className="text-[10px] text-slate-700 font-bold truncate w-full text-center capitalize">
                    {c.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Emplacement Icon *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {AVAILABLE_ICONS.map((iconItem) => {
                const IconComponent = iconItem.component;
                return (
                  <button
                    key={iconItem.id}
                    type="button"
                    onClick={() => setSelectedIcon(iconItem.id)}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedIcon === iconItem.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    title={iconItem.label}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-[9px] truncate max-w-full font-bold">
                      {iconItem.label.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3 border-t border-slate-200">
            <button
              id="btn-submit-create-category"
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ CREATE EMPLACEMENT</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
