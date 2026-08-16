import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { getCurrentShiftAndDate, SHIFT_OPTIONS, getShiftWindowLabel } from './utils/dateUtils';
import { exportDashboardToPng } from './utils/exportUtils';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { CategoryCard } from './components/CategoryCard';
import { KskActionModal } from './components/KskActionModal';
import { AddKskModal } from './components/AddKskModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ToastContainer } from './components/ToastContainer';
import { Copy, Plus, AlertCircle, Layers } from 'lucide-react';

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
        // In case category was deleted or unknown
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
    addToast(`Shift changed to ${newShift.split('-->')[0].trim()}...`, 'info');
  };

  const handleSetCurrentShift = () => {
    const detected = getCurrentShiftAndDate();
    setSelectedDate(detected.date);
    setSelectedShift(detected.shift);
    addToast(`Current shift activated: ${detected.date} (${detected.shift})`, 'success');
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
    const targetName = targetCategory ? targetCategory.name : 'new category';

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
    addToast(`Category "${name}" created successfully`, 'success');
  };

  const handleQuickAdd = (categoryId: string) => {
    setTargetQuickAddCategoryId(categoryId);
    setIsAddKskOpen(true);
  };

  const handleCopyFromPreviousShift = () => {
    // Find any existing KSKs from another session
    const otherKsks = allKsks.filter(
      (k) => !(k.date === selectedDate && k.shift === selectedShift)
    );

    if (otherKsks.length === 0) {
      addToast('No previous shift data found to copy from.', 'info');
      return;
    }

    // Group by session to find the most recent
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
      `Copied ${copiedItems.length} KSKs from session (${latestOtherKsk.date} • ${latestOtherKsk.shift})`,
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
      addToast('Dashboard exported as PNG successfully', 'success');
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

      {/* Main App Container */}
      <div id="dashboard-container" className="flex-1 flex flex-col bg-white">
        
        {/* Header */}
        <Header
          selectedDate={selectedDate}
          selectedShift={selectedShift}
          totalKsks={currentSessionKsks.length}
          onDateChange={handleDateChange}
          onShiftChange={handleShiftChange}
          onSetCurrentShift={handleSetCurrentShift}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col gap-4">
          
          {/* Action Toolbar */}
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

          {/* Empty Session Helper Notice (if 0 items in selected session) */}
          {currentSessionKsks.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm no-print animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">No KSK records in this session yet</p>
                  <p className="text-xs text-slate-600 font-medium">
                    Session: <span className="font-mono font-bold text-slate-900">{selectedDate}</span> •{' '}
                    <span className="font-mono font-bold text-blue-700">{selectedShift}</span>
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

          {/* Clean Export/Print Header Banner (only visible during export/print) */}
          <div className="hidden print:block mb-4 pb-2 border-b border-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold font-industrial tracking-wider text-black">
                  KSK AREA – HARNESS / HT FOLLOW UP
                </h1>
                <p className="text-xs text-slate-700 font-medium">
                  Date: {selectedDate} | Shift: {selectedShift} | Total KSKs: {currentSessionKsks.length}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Grid of Category Cards */}
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
                />
              );
            })}
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

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* KSK Action (Edit / Move / Remove) Modal */}
      <KskActionModal
        item={actionModalItem}
        categories={categories}
        isOpen={!!actionModalItem}
        onClose={() => setActionModalItem(null)}
        onEditKsk={handleEditKsk}
        onMoveKsk={handleMoveKsk}
        onRemoveKsk={handleRemoveKsk}
      />
    </div>
  );
}
