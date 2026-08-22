import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '../types';
import { parseAndFormatKskInput } from '../utils/kskUtils';
import { AVAILABLE_COLORS, AVAILABLE_ICONS, renderCategoryIcon } from '../utils/styleUtils';
import {
  X,
  Plus,
  AlertCircle,
  Sparkles,
  FolderPlus,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';

interface AddKskModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialCategoryId?: string;
  existingKskNumbers: Set<string>;
  onAddKsk: (kskNumbers: string[], categoryId: string, description?: string) => void;
  onCreateCategory?: (name: string, color: string, icon: string, meaning?: string) => string;
}

export const AddKskModal: React.FC<AddKskModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialCategoryId,
  existingKskNumbers,
  onAddKsk,
  onCreateCategory,
}) => {
  const [kskInput, setKskInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategoryId || categories[0]?.id || ''
  );
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Inline Emplacement Creation State
  const [isCreatingEmplacement, setIsCreatingEmplacement] = useState(false);
  const [newEmplacementName, setNewEmplacementName] = useState('');
  const [newEmplacementColor, setNewEmplacementColor] = useState('blue');
  const [newEmplacementIcon, setNewEmplacementIcon] = useState('map-pin');
  const [newEmplacementMeaning, setNewEmplacementMeaning] = useState('');
  const [emplacementError, setEmplacementError] = useState('');

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    } else if (categories.length > 0 && (!selectedCategoryId || !categories.some(c => c.id === selectedCategoryId))) {
      setSelectedCategoryId(categories[0].id);
    } else if (categories.length === 0) {
      setSelectedCategoryId('');
      // If no emplacements exist, open the inline creator automatically to help the user
      setIsCreatingEmplacement(true);
    }
  }, [initialCategoryId, categories, selectedCategoryId]);

  useEffect(() => {
    if (isOpen) {
      setKskInput('');
      setDescription('');
      setErrorMessage('');
      setNewEmplacementName('');
      setNewEmplacementMeaning('');
      setEmplacementError('');
      if (categories.length === 0) {
        setIsCreatingEmplacement(true);
      } else {
        setIsCreatingEmplacement(false);
      }
    }
  }, [isOpen, categories.length]);

  // Real-time parsed & formatted tokens (3-digit -> 4000XXX, 4-digit -> 400XXXX)
  const formattedPreviewTokens = useMemo(() => {
    return parseAndFormatKskInput(kskInput);
  }, [kskInput]);

  if (!isOpen) return null;

  const handleCreateNewEmplacement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEmplacementError('');

    const trimmedName = newEmplacementName.trim();
    if (!trimmedName) {
      setEmplacementError('Please enter an emplacement name.');
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setEmplacementError(`An emplacement named "${trimmedName}" already exists.`);
      return;
    }

    if (onCreateCategory) {
      const newId = onCreateCategory(
        trimmedName,
        newEmplacementColor,
        newEmplacementIcon,
        newEmplacementMeaning.trim() || undefined
      );
      setSelectedCategoryId(newId);
      setIsCreatingEmplacement(false);
      setNewEmplacementName('');
      setNewEmplacementMeaning('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // If user is currently creating an emplacement and hasn't saved it yet
    if (isCreatingEmplacement && newEmplacementName.trim() && !selectedCategoryId && onCreateCategory) {
      const newId = onCreateCategory(
        newEmplacementName.trim(),
        newEmplacementColor,
        newEmplacementIcon,
        newEmplacementMeaning.trim() || undefined
      );
      setSelectedCategoryId(newId);
    }

    // Parse and auto-format all tokens
    const formattedTokens = parseAndFormatKskInput(kskInput);

    if (formattedTokens.length === 0) {
      setErrorMessage('Please enter at least one valid KSK number.');
      return;
    }

    // Validation for KSK format (alphanumeric, 3-20 chars)
    const invalidTokens = formattedTokens.filter((t) => !/^[a-zA-Z0-9_-]{3,20}$/.test(t));
    if (invalidTokens.length > 0) {
      setErrorMessage(
        `Invalid KSK format: "${invalidTokens[0]}". KSK numbers must be valid alphanumeric characters.`
      );
      return;
    }

    // Check duplicate in input tokens itself
    const uniqueTokens = Array.from(new Set(formattedTokens));
    if (uniqueTokens.length < formattedTokens.length) {
      setErrorMessage('You entered duplicate KSK numbers in the input field.');
      return;
    }

    // Check for duplicates in current session
    const duplicates = uniqueTokens.filter((t) => existingKskNumbers.has(t));
    if (duplicates.length > 0) {
      setErrorMessage(`KSK "${duplicates[0]}" is already present in this active session.`);
      return;
    }

    const effectiveCatId = selectedCategoryId || (categories.length > 0 ? categories[0].id : '');
    if (!effectiveCatId) {
      setErrorMessage('Please select or create an emplacement first.');
      return;
    }

    onAddKsk(uniqueTokens, effectiveCatId, description.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="add-ksk-modal"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black font-industrial tracking-wider text-slate-900 uppercase">
                ADD NEW KSK
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter KSK unit details to register in production follow up
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

        {/* Form Body - Strictly KSK info only */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. KSK Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="ksk-number-input" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                KSK Number(s) *
              </label>
              <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Auto-formats: 4 digits → 400XXXX | 3 digits → 4000XXX
              </span>
            </div>

            <textarea
              id="ksk-number-input"
              rows={2}
              value={kskInput}
              onChange={(e) => setKskInput(e.target.value)}
              placeholder="e.g. Type 1112 (auto 4001112) or 950 (auto 4000950) — space/comma/line separated"
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
              autoFocus
            />

            {/* Live Auto-Format Preview Chip */}
            {formattedPreviewTokens.length > 0 && (
              <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center gap-1.5 text-xs text-blue-950 font-mono">
                <span className="text-[11px] font-sans font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Auto-formatted KSK:
                </span>
                {formattedPreviewTokens.map((token, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold text-xs shadow-2xs"
                  >
                    {token}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 2. Emplacement Selector & Direct "+ New Emplacement" Flow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="ksk-emplacement-select" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Emplacement *
              </label>
              {onCreateCategory && (
                <button
                  type="button"
                  onClick={() => setIsCreatingEmplacement(!isCreatingEmplacement)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{isCreatingEmplacement ? 'Hide New Emplacement' : '+ Add New Emplacement'}</span>
                  {isCreatingEmplacement ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {categories.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <p className="font-bold mb-1">No emplacements exist yet.</p>
                <p className="text-amber-700 text-[11px]">
                  Please create your first emplacement below (e.g. ON BOARD, WAIT DPT, AUDIT).
                </p>
              </div>
            ) : (
              <select
                id="ksk-emplacement-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none cursor-pointer shadow-2xs"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-slate-900 font-medium">
                    {cat.name} {cat.meaning ? `— ${cat.meaning}` : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Direct Inline Emplacement Creator */}
            {isCreatingEmplacement && (
              <div className="p-3.5 bg-slate-50 border border-blue-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-industrial flex items-center gap-1.5">
                    <FolderPlus className="w-4 h-4 text-blue-600" />
                    CREATE NEW EMPLACEMENT
                  </span>
                  {categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingEmplacement(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {emplacementError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-bold">
                    {emplacementError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Emplacement Name *
                  </label>
                  <input
                    type="text"
                    value={newEmplacementName}
                    onChange={(e) => {
                      setNewEmplacementName(e.target.value);
                      setEmplacementError('');
                    }}
                    placeholder="e.g. ON BOARD, WAIT DPT, AUDIT, REWORK"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold uppercase text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Color & Icon Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Color Accent
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_COLORS.slice(0, 8).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setNewEmplacementColor(c.id)}
                          className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center text-white transition-transform ${
                            newEmplacementColor === c.id ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          title={c.label}
                        >
                          {newEmplacementColor === c.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {AVAILABLE_ICONS.slice(0, 6).map((iconItem) => (
                        <button
                          key={iconItem.id}
                          type="button"
                          onClick={() => setNewEmplacementIcon(iconItem.id)}
                          className={`p-1.5 rounded-md border text-xs flex items-center justify-center transition-colors ${
                            newEmplacementIcon === iconItem.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={iconItem.label}
                        >
                          {renderCategoryIcon(iconItem.id, 'w-3.5 h-3.5')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Meaning / Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEmplacementMeaning}
                    onChange={(e) => setNewEmplacementMeaning(e.target.value)}
                    placeholder="e.g. Waiting for Quality Check"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreateNewEmplacement}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create & Select Emplacement</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Description / Note (Optional) */}
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
              className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              id="btn-submit-add-ksk"
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ADD KSK</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
