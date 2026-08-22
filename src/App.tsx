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
import { formatKskNumber } from './utils/kskUtils';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { CategoryCard } from './components/CategoryCard';
import { KskActionModal } from './components/KskActionModal';
import { AddKskModal } from './components/AddKskModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ExportReportView } from './components/ExportReportView';
import { ToastContainer } from './components/ToastContainer';
import {
  FolderPlus,
  Plus,
  AlertCircle,
  Trash2,
  MapPin,
} from 'lucide-react';

export default function App() {
  // 1. Core State with Storage Persistence
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [allKsks, setAllKsks] = useState<KSKItem[]>(() => getStoredKSKs());
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => getStoredDisplayMode());

  // Date and Shift State (Global header control / report metadata)
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

  // 2. Storage Persistence Effects
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

  // 3. KSKs are permanent across the board and independent from shift switching!
  // Set of all existing KSK numbers on the board (for duplicate warning/detection)
  const existingKskNumbers = useMemo(() => {
    return new Set(allKsks.map((i) => i.kskNumber));
  }, [allKsks]);

  // Group all active KSKs by Category
  const ksksByCategory = useMemo(() => {
    const map = new Map<string, KSKItem[]>();
    categories.forEach((cat) => map.set(cat.id, []));

    allKsks.forEach((item) => {
      const list = map.get(item.categoryId);
      if (list) {
        list.push(item);
      } else {
        map.set(item.categoryId, [item]);
      }
    });

    return map;
  }, [categories, allKsks]);

  // Search Match Count
  const searchMatchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase().trim();
    return allKsks.filter((k) => k.kskNumber.toLowerCase().includes(q)).length;
  }, [allKsks, searchQuery]);

  // Visible categories based on category filter
  const visibleCategories = useMemo(() => {
    if (categoryFilter === 'ALL') return categories;
    return categories.filter((c) => c.id === categoryFilter);
  }, [categories, categoryFilter]);

  // 4. Handlers
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    addToast(`Active date updated: ${newDate}`, 'info');
  };

  const handleShiftChange = (newShift: ShiftType) => {
    setSelectedShift(newShift);
    addToast(`Shift set to ${getShiftDisplayName(newShift)}`, 'info');
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
      kskNumber: formatKskNumber(num),
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
    const formatted = formatKskNumber(newKskNumber);
    setAllKsks((prev) =>
      prev.map((k) =>
        k.id === item.id
          ? {
              ...k,
              kskNumber: formatted,
              description: newDescription || undefined,
              categoryId: newCategoryId || k.categoryId,
              updatedAt: new Date().toISOString(),
            }
          : k
      )
    );

    addToast(`KSK updated successfully (${formatted})`, 'success');
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

  const handleAddCategory = (name: string, color: string, icon: string, meaning?: string): string => {
    const newCatId = `cat_custom_${Date.now()}`;
    const newCat: Category = {
      id: newCatId,
      name: name.trim().toUpperCase(),
      color,
      icon,
      meaning,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCat]);
    addToast(`Emplacement "${newCat.name}" created successfully`, 'success');
    return newCatId;
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

  const handleExportPng = async () => {
    setIsExporting(true);
    const safeDate = selectedDate.replace(/\//g, '-');
    const safeShift = selectedShift.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `KSK_AREA_REPORT_${safeDate}_${safeShift}.png`;

    const success = await exportDashboardToPng('dashboard-container', filename);
    setIsExporting(false);

    if (success) {
      addToast('Production report exported as high-resolution image', 'success');
    } else {
      addToast('Failed to export report image. Please try again.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main App Container (Captured for Image Export & Screen Rendering) */}
      <div id="dashboard-container" className="flex-1 flex flex-col bg-slate-100/70">
        
        {/* 1. Live Screen Modern Header */}
        <div className="screen-only">
          <Header
            selectedDate={selectedDate}
            selectedShift={selectedShift}
            totalKsks={allKsks.length}
            totalEmplacements={categories.length}
            onDateChange={handleDateChange}
            onShiftChange={handleShiftChange}
            onSetCurrentShift={handleSetCurrentShift}
          />
        </div>

        {/* 2. Professional Executive Report View (Captured when exporting PNG or printing) */}
        <div className="export-only print:block p-2">
          <ExportReportView
            selectedDate={selectedDate}
            selectedShift={selectedShift}
            categories={categories}
            ksksByCategory={ksksByCategory}
            totalKsks={allKsks.length}
            displayMode={displayMode}
          />
        </div>

        {/* 3. Main Screen Interactive Content Area */}
        <main className="screen-only max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col gap-4">
          
          {/* Action Toolbar */}
          <div className="no-print no-export">
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

          {/* Zero Emplacement Initial State */}
          {categories.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm my-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
                <MapPin className="w-8 h-8 stroke-[2]" />
              </div>

              <div className="max-w-md space-y-1.5">
                <h3 className="text-xl font-black font-industrial tracking-wide text-slate-900">
                  NO EMPLACEMENT CREATED YET
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Start by adding your production emplacement zones (e.g. <span className="font-semibold text-slate-900">ON BOARD</span>, <span className="font-semibold text-slate-900">WAIT DPT</span>, <span className="font-semibold text-slate-900">AUDIT</span>, <span className="font-semibold text-slate-900">REWORK</span>) to begin tracking KSK units.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="btn-create-first-emplacement"
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Create First Emplacement</span>
                </button>

                <button
                  onClick={() => setIsAddKskOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add KSK</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Board Notice when 0 KSKs on board */}
              {allKsks.length === 0 && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">No KSK records on the board yet</p>
                      <p className="text-xs text-slate-600 font-medium">
                        Active Header Shift:{' '}
                        <span className="font-mono font-bold text-slate-900">{selectedDate}</span> •{' '}
                        <span className="font-bold text-blue-700">{getShiftDisplayName(selectedShift)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddKskOpen(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>+ Add KSK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Grid of Emplacement Cards */}
              <div
                id="category-cards-grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start"
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
            </>
          )}

        </main>
      </div>

      {/* Add KSK Modal (KSK-only inputs) */}
      <AddKskModal
        isOpen={isAddKskOpen}
        onClose={() => setIsAddKskOpen(false)}
        categories={categories}
        initialCategoryId={targetQuickAddCategoryId}
        existingKskNumbers={existingKskNumbers}
        onAddKsk={handleAddKsk}
        onCreateCategory={handleAddCategory}
      />

      {/* Add Emplacement Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* KSK Action (Edit KSK Number / Move Emplacement / Remove) Modal */}
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
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col">
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
                    Confirm deletion of this emplacement column
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeletingCategory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5 opacity-0" />
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
                  Any KSK items currently assigned to this emplacement will also be removed.
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
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
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
