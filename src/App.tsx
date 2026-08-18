import React, { useState, useEffect, useMemo } from 'react';
import { Category, DisplayMode, KSKItem, ShiftType, ToastMessage } from './types';
import {
  getStoredCategories,
  saveStoredCategories,
  getStoredKSKs,
  saveStoredKSKs,
  getStoredDisplayMode,
  saveStoredDisplayMode,
  getStoredActiveDate,
  saveStoredActiveDate,
  getStoredActiveShift,
  saveStoredActiveShift,
} from './utils/storage';
import { getCurrentShiftAndDate, getShiftDisplayName } from './utils/dateUtils';
import { exportDashboardToPng } from './utils/exportUtils';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { CategoryCard } from './components/CategoryCard';
import { KskActionModal } from './components/KskActionModal';
import { AddKskModal } from './components/AddKskModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ToastContainer } from './components/ToastContainer';
import { Copy, Plus, AlertCircle, Trash2, Calendar, Clock, Layers, ShieldCheck, X } from 'lucide-react';

export default function App() {
  // 1. Core State with Storage Persistence
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [allKsks, setAllKsks] = useState<KSKItem[]>(() => getStoredKSKs());
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => getStoredDisplayMode());

  // Date and Shift State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = getStoredActiveDate();
    if (saved) return saved;
    return getCurrentShiftAndDate().date;
  });

  const [selectedShift, setSelectedShift] = useState<ShiftType>(() => {
    const saved = getStoredActiveShift();
    if (saved) return saved;
    return getCurrentShiftAndDate().shift;
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  // Modals State
  const [isAddKskOpen, setIsAddKskOpen] = useState(false);
  const [targetQuickAddCategoryId, setTargetQuickAddCategoryId] = useState<string | undefined>(undefined);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [actionModalItem, setActionModalItem] = useState<KSKItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Persist effects
  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredKSKs(allKsks);
  }, [allKsks]);

  useEffect(() => {
    saveStoredDisplayMode(displayMode);
  }, [displayMode]);

  useEffect(() => {
    saveStoredActiveDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    saveStoredActiveShift(selectedShift);
  }, [selectedShift]);

  // 3. Filtered KSKs for current session (Date + Shift)
  const currentSessionKsks = useMemo(() => {
    return allKsks.filter(
      (item) => item.date === selectedDate && item.shift === selectedShift
    );
  }, [allKsks, selectedDate, selectedShift]);

  // Set of existing KSK numbers in current session (for duplicate detection)
  const existingKskNumbersInSession = useMemo(() => {
    return new Set(currentSessionKsks.map((i) => i.kskNumber));
  }, [currentSessionKsks]);

  // Group KSKs by Category
  const ksksByCategory = useMemo(() => {
    const map = new Map<string, KSKItem[]>();
    categories.forEach((cat) => map.set(cat.id, []));

    currentSessionKsks.forEach((item) => {
      const list = map.get(item.categoryId);
      if (list) {
        list.push(item);
      } else {
        map.set(item.categoryId, [item]);
      }
    });

    return map;
  }, [categories, currentSessionKsks]);

  // Search Match Count
  const searchMatchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase().trim();
    return currentSessionKsks.filter((k) => k.kskNumber.toLowerCase().includes(q)).length;
  }, [currentSessionKsks, searchQuery]);

  // Visible categories based on category filter
  const visibleCategories = useMemo(() => {
    if (categoryFilter === 'ALL') return categories;
    return categories.filter((c) => c.id === categoryFilter);
  }, [categories, categoryFilter]);

  // 4. Handlers
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    addToast(`Loaded session: ${newDate}`, 'info');
  };

  const handleShiftChange = (newShift: ShiftType) => {
    setSelectedShift(newShift);
    addToast(`Shift changed to ${getShiftDisplayName(newShift)}`, 'info');
  };

  const handleSetCurrentShift = () => {
    const detected = getCurrentShiftAndDate();
    setSelectedDate(detected.date);
    setSelectedShift(detected.shift);
    addToast(`Current shift activated: ${detected.date} (${getShiftDisplayName(detected.shift)})`, 'success');
  };

  const handleAddKsk = (kskNumbers: string[], categoryId: string, description?: string) => {
    const timestamp = new Date().toISOString();
    const newItems: KSKItem[] = kskNumbers.map((num) => ({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      kskNumber: num,
      categoryId,
      date: selectedDate,
      shift: selectedShift,
      description,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    setAllKsks((prev) => [...prev, ...newItems]);
    if (newItems.length === 1) {
      addToast(`KSK ${newItems[0].kskNumber} added successfully`, 'success');
    } else {
      addToast(`${newItems.length} KSKs added successfully`, 'success');
    }
  };

  const handleEditKsk = (
    item: KSKItem,
    newKskNumber: string,
    newDescription?: string,
    newCategoryId?: string
  ) => {
    setAllKsks((prev) =>
      prev.map((k) =>
        k.id === item.id
          ? {
              ...k,
              kskNumber: newKskNumber,
              description: newDescription || undefined,
              categoryId: newCategoryId || k.categoryId,
              updatedAt: new Date().toISOString(),
            }
          : k
      )
    );

    addToast(`KSK updated successfully (${newKskNumber})`, 'success');
  };

  const handleMoveKsk = (item: KSKItem, targetCategoryId: string) => {
    const targetCategory = categories.find((c) => c.id === targetCategoryId);
    const targetName = targetCategory ? targetCategory.name : 'new emplacement';

    setAllKsks((prev) =>
      prev.map((k) =>
        k.id === item.id
          ? { ...k, categoryId: targetCategoryId, updatedAt: new Date().toISOString() }
          : k
      )
    );

    addToast(`KSK ${item.kskNumber} moved to ${targetName} successfully`, 'success');
  };

  const handleRemoveKsk = (item: KSKItem) => {
    setAllKsks((prev) => prev.filter((k) => k.id !== item.id));
    addToast(`KSK ${item.kskNumber} removed successfully`, 'success');
  };

  const handleAddCategory = (name: string, color: string, icon: string, meaning?: string) => {
    const newCat: Category = {
      id: `cat_custom_${Date.now()}`,
      name,
      color,
      icon,
      meaning,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCat]);
    addToast(`Emplacement "${name}" created successfully`, 'success');
  };

  const handleRequestRemoveCategory = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;
    setDeletingCategory(cat);
  };

  const handleConfirmRemoveCategory = () => {
    if (!deletingCategory) return;
    const catId = deletingCategory.id;
    const catName = deletingCategory.name;

    // Delete category and all its KSK items
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setAllKsks((prev) => prev.filter((k) => k.categoryId !== catId));

    if (categoryFilter === catId) {
      setCategoryFilter('ALL');
    }

    setDeletingCategory(null);
    addToast(`Emplacement "${catName}" removed successfully`, 'info');
  };

  const handleQuickAdd = (categoryId: string) => {
    setTargetQuickAddCategoryId(categoryId);
    setIsAddKskOpen(true);
  };

  const handleCopyFromPreviousShift = () => {
    const otherKsks = allKsks.filter(
      (k) => !(k.date === selectedDate && k.shift === selectedShift)
    );

    if (otherKsks.length === 0) {
      addToast('No previous shift data found to copy from.', 'info');
      return;
    }

    const latestOtherKsk = otherKsks[otherKsks.length - 1];
    const sourceSessionKsks = otherKsks.filter(
      (k) => k.date === latestOtherKsk.date && k.shift === latestOtherKsk.shift
    );

    const timestamp = new Date().toISOString();
    const copiedItems: KSKItem[] = sourceSessionKsks.map((k) => ({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      kskNumber: k.kskNumber,
      categoryId: k.categoryId,
      date: selectedDate,
      shift: selectedShift,
      description: k.description,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    setAllKsks((prev) => [...prev, ...copiedItems]);
    addToast(
      `Copied ${copiedItems.length} KSKs from session (${latestOtherKsk.date} • ${getShiftDisplayName(latestOtherKsk.shift)})`,
      'success'
    );
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    const safeDate = selectedDate.replace(/\//g, '-');
    const safeShift = selectedShift.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `KSK_AREA_${safeDate}_${safeShift}.png`;

    const success = await exportDashboardToPng('dashboard-container', filename);
    setIsExporting(false);

    if (success) {
      addToast('Dashboard exported as landscape PNG successfully', 'success');
    } else {
      addToast('Failed to export image. Please try again.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main App Container (used for screen and landscape PNG export) */}
      <div id="dashboard-container" className="flex-1 flex flex-col bg-white">
        
        {/* 1. Screen Header (Visible on Web App) */}
        <div className="screen-only">
          <Header
            selectedDate={selectedDate}
            selectedShift={selectedShift}
            totalKsks={currentSessionKsks.length}
            onDateChange={handleDateChange}
            onShiftChange={handleShiftChange}
            onSetCurrentShift={handleSetCurrentShift}
          />
        </div>

        {/* 2. Professional Export Header (Active only during Image Export & Print) */}
        <div className="export-only print:block mb-5 pb-4 border-b-2 border-slate-800">
          <div className="flex items-center justify-between gap-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black font-industrial text-xl shadow-xs">
                K
              </div>
              <div>
                <h1 className="text-2xl font-black font-industrial tracking-wider text-black uppercase">
                  KSK AREA – HARNESS / HT FOLLOW UP
                </h1>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Live Production Tracking Board
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black tracking-wider uppercase font-industrial flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                OFFICIAL PRODUCTION RECORD
              </span>
            </div>
          </div>

          {/* Export Session Info Grid */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Production Date</div>
                <div className="text-sm font-black font-mono text-slate-900">{selectedDate}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Active Shift</div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {getShiftDisplayName(selectedShift)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Total KSKs</div>
                <div className="text-sm font-black font-mono text-emerald-700">
                  {currentSessionKsks.length} Units
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                #
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Emplacements</div>
                <div className="text-sm font-black font-mono text-slate-900">
                  {categories.length} Zones
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col gap-4">
          
          {/* Action Toolbar (Hidden during export) */}
          <div className="screen-only no-print no-export">
            <Toolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
              selectedCategoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              categories={categories}
              matchCount={searchMatchCount}
              isExporting={isExporting}
              onOpenAddKsk={() => {
                setTargetQuickAddCategoryId(undefined);
                setIsAddKskOpen(true);
              }}
              onOpenAddCategory={() => setIsAddCategoryOpen(true)}
              onExportPng={handleExportPng}
              onPrint={handlePrint}
            />
          </div>

          {/* Empty Session Helper Notice (Screen only) */}
          {currentSessionKsks.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm no-print no-export screen-only animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">No KSK records in this session yet</p>
                  <p className="text-xs text-slate-600 font-medium">
                    Session: <span className="font-mono font-bold text-slate-900">{selectedDate}</span> •{' '}
                    <span className="font-bold text-blue-700">{getShiftDisplayName(selectedShift)}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFromPreviousShift}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-600" />
                  <span>Copy Previous Shift</span>
                </button>
                <button
                  onClick={() => setIsAddKskOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add KSK</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Grid of Emplacement / Category Cards */}
          <div
            id="category-cards-grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 items-start"
          >
            {visibleCategories.map((category) => {
              const items = ksksByCategory.get(category.id) || [];
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  items={items}
                  displayMode={displayMode}
                  searchQuery={searchQuery}
                  onKskClick={(item) => setActionModalItem(item)}
                  onQuickAdd={handleQuickAdd}
                  onRemoveCategory={handleRequestRemoveCategory}
                />
              );
            })}
          </div>

          {/* Professional Export Footer Watermark (Active in Export and Print) */}
          <div className="export-only print:block mt-6 pt-3 border-t border-slate-300 text-center text-xs text-slate-500 flex items-center justify-between font-mono">
            <span>KSK AREA – HARNESS / HT FOLLOW UP</span>
            <span>Generated: {new Date().toLocaleString()}</span>
          </div>

        </main>
      </div>

      {/* Add KSK Modal */}
      <AddKskModal
        isOpen={isAddKskOpen}
        onClose={() => setIsAddKskOpen(false)}
        categories={categories}
        initialCategoryId={targetQuickAddCategoryId}
        selectedDate={selectedDate}
        selectedShift={selectedShift}
        existingKskNumbers={existingKskNumbersInSession}
        onAddKsk={handleAddKsk}
      />

      {/* Add Emplacement Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* KSK Action (Edit KSK Number / Move / Remove) Modal */}
      <KskActionModal
        item={actionModalItem}
        categories={categories}
        isOpen={!!actionModalItem}
        onClose={() => setActionModalItem(null)}
        onEditKsk={handleEditKsk}
        onMoveKsk={handleMoveKsk}
        onRemoveKsk={handleRemoveKsk}
      />

      {/* Delete Emplacement Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-rose-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black font-industrial tracking-wider text-rose-900">
                    REMOVE EMPLACEMENT
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Confirm deletion of this category column
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeletingCategory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-sm text-slate-700">
              <p>
                Are you sure you want to remove the emplacement{' '}
                <strong className="font-bold text-slate-900 uppercase font-industrial text-base">
                  &ldquo;{deletingCategory.name}&rdquo;
                </strong>
                ?
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Any KSK items currently assigned to this emplacement in this session will also be removed.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveCategory}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Emplacement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
