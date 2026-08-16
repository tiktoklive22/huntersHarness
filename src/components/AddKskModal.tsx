import React, { useState, useEffect } from 'react';
import { Category, ShiftType } from '../types';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface AddKskModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialCategoryId?: string;
  selectedDate: string;
  selectedShift: ShiftType;
  existingKskNumbers: Set<string>;
  onAddKsk: (kskNumbers: string[], categoryId: string, description?: string) => void;
}

export const AddKskModal: React.FC<AddKskModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialCategoryId,
  selectedDate,
  selectedShift,
  existingKskNumbers,
  onAddKsk,
}) => {
  const [kskInput, setKskInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategoryId || categories[0]?.id || ''
  );
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    } else if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [initialCategoryId, categories]);

  useEffect(() => {
    if (isOpen) {
      setKskInput('');
      setDescription('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Parse input (supports single KSK or multiple numbers separated by spaces, commas, newlines)
    const rawTokens = kskInput
      .split(/[\s,\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (rawTokens.length === 0) {
      setErrorMessage('Please enter at least one valid KSK number.');
      return;
    }

    // Validation for KSK format (alphanumeric, typically 5-12 characters, e.g. 4001234)
    const invalidTokens = rawTokens.filter((t) => !/^[a-zA-Z0-9_-]{3,20}$/.test(t));
    if (invalidTokens.length > 0) {
      setErrorMessage(
        `Invalid KSK format: "${invalidTokens[0]}". KSK numbers must be 3-20 alphanumeric characters.`
      );
      return;
    }

    // Check for duplicates in current session
    const duplicates = rawTokens.filter((t) => existingKskNumbers.has(t));
    if (duplicates.length > 0) {
      setErrorMessage(
        `KSK "${duplicates[0]}" already exists in this session (${selectedDate} • ${selectedShift}).`
      );
      return;
    }

    // Check duplicate in input tokens itself
    const uniqueTokens = Array.from(new Set(rawTokens));
    if (uniqueTokens.length < rawTokens.length) {
      setErrorMessage('You entered duplicate KSK numbers in the input field.');
      return;
    }

    if (!selectedCategoryId) {
      setErrorMessage('Please select a category.');
      return;
    }

    onAddKsk(uniqueTokens, selectedCategoryId, description.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="add-ksk-modal"
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-industrial tracking-wider text-black">
                ADD NEW KSK
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Session: <span className="font-mono font-bold text-slate-900">{selectedDate}</span> •{' '}
                <span className="font-mono font-bold text-blue-700">{selectedShift}</span>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* KSK Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="ksk-number-input" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                KSK Number(s) *
              </label>
              <span className="text-[11px] text-slate-500 font-medium">e.g. 4001234</span>
            </div>
            <textarea
              id="ksk-number-input"
              rows={2}
              value={kskInput}
              onChange={(e) => setKskInput(e.target.value)}
              placeholder="Enter KSK number (e.g. 4001234 or paste multiple separated by space/line)"
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="ksk-category-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category *
            </label>
            <select
              id="ksk-category-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none cursor-pointer shadow-2xs"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                  {cat.name} {cat.meaning ? `(${cat.meaning})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Description / Note */}
          <div>
            <label htmlFor="ksk-desc-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Note (Optional)
            </label>
            <input
              id="ksk-desc-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Wire connector check, Line 3"
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              id="btn-submit-add-ksk"
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ADD KSK</span>
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
