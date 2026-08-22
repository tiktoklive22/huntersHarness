import React from 'react';
import { Category, DisplayMode } from '../types';
import {
  Plus,
  FolderPlus,
  Search,
  X,
  AlignJustify,
  Rows,
  Download,
  Printer,
  Filter,
  RefreshCcw,
} from 'lucide-react';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  selectedCategoryFilter: string;
  onCategoryFilterChange: (catId: string) => void;
  categories: Category[];
  matchCount: number;
  isExporting: boolean;
  onOpenAddKsk: () => void;
  onOpenAddCategory: () => void;
  onExportPng: () => void;
  onPrint: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  onSearchChange,
  displayMode,
  onDisplayModeChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  categories,
  matchCount,
  isExporting,
  onOpenAddKsk,
  onOpenAddCategory,
  onExportPng,
  onPrint,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 no-print">
      
      {/* Left Action Buttons & Emplacement Selector */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        
        {/* + ADD KSK */}
        <button
          id="btn-add-ksk"
          onClick={onOpenAddKsk}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ADD KSK</span>
        </button>

        {/* + ADD EMPLACEMENT */}
        <button
          id="btn-add-category"
          onClick={onOpenAddCategory}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
          title="Create a new tracking emplacement column"
        >
          <FolderPlus className="w-4 h-4 text-blue-600" />
          <span>+ Add Emplacement</span>
        </button>

        {/* Emplacement Filter Dropdown (if any categories exist) */}
        {categories.length > 0 && (
          <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-2xs transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <select
              id="category-filter-select"
              value={selectedCategoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-white text-slate-900">
                All Emplacements ({categories.length})
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Controls: Search, Layout View, Export, Print */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        
        {/* Search KSK Input */}
        <div className="relative flex-1 sm:w-60 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            id="ksk-search-input"
            type="text"
            placeholder="Search KSK number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors font-mono font-medium shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {searchQuery && matchCount > 0 && (
            <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded font-mono font-bold">
              {matchCount}
            </span>
          )}
        </div>

        {/* Layout View Toggle */}
        <div className="flex items-center bg-slate-100 border border-slate-300 p-1 rounded-xl gap-0.5">
          <button
            id="btn-layout-oneline"
            onClick={() => onDisplayModeChange('oneline')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'oneline'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="One Line horizontal layout (KSKs separated by -)"
          >
            <AlignJustify className="w-3.5 h-3.5 text-blue-600" />
            <span>One Line</span>
          </button>
          <button
            id="btn-layout-vertical"
            onClick={() => onDisplayModeChange('vertical')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'vertical'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Vertical stacked layout"
          >
            <Rows className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vertical</span>
          </button>
        </div>

        {/* Export Image PNG */}
        <button
          id="btn-export-image"
          onClick={onExportPng}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Export high-resolution PNG image of production board"
        >
          {isExporting ? (
            <RefreshCcw className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Download className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>EXPORT</span>
        </button>

        {/* Print */}
        <button
          id="btn-print"
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Print clean A4 landscape dashboard"
        >
          <Printer className="w-3.5 h-3.5 text-slate-700" />
          <span>PRINT</span>
        </button>

      </div>
    </div>
  );
};
