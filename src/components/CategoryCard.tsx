import React from 'react';
import { Category, DisplayMode, KSKItem } from '../types';
import { getCategoryTheme, renderCategoryIcon } from '../utils/styleUtils';
import { Plus, Copy, Check, Edit3, Trash2 } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  items: KSKItem[];
  displayMode: DisplayMode;
  searchQuery: string;
  onKskClick: (item: KSKItem) => void;
  onQuickAdd: (categoryId: string) => void;
  onRemoveCategory: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  items,
  displayMode,
  searchQuery,
  onKskClick,
  onQuickAdd,
  onRemoveCategory,
}) => {
  const theme = getCategoryTheme(category.color);
  const [copied, setCopied] = React.useState(false);

  const handleCopyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length === 0) return;
    const text = items.map((i) => i.kskNumber).join(' - ');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMatched = (kskNumber: string) => {
    if (!searchQuery.trim()) return false;
    return kskNumber.toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  return (
    <div
      id={`category-card-${category.id}`}
      className={`flex flex-col rounded-2xl ${theme.cardBorder} bg-white transition-all duration-150 overflow-hidden shadow-xs hover:shadow-md border`}
    >
      {/* Top Accent Strip */}
      <div className={`h-2.5 w-full ${theme.accentBar}`} />

      {/* Card Header */}
      <div className={`px-4 py-3 ${theme.headerBg} ${theme.headerBorder} flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className={`p-1.5 rounded-lg ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} shrink-0`}>
            {renderCategoryIcon(category.icon, 'w-4 h-4')}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-black tracking-wide uppercase font-industrial text-slate-900 leading-snug break-words">
              {category.name}
            </h3>
            {category.meaning && (
              <span className="text-[10px] text-slate-500 block font-medium leading-tight break-words">
                {category.meaning}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Copy KSKs */}
          {items.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="p-1.5 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-900 transition-colors no-print no-export cursor-pointer"
              title="Copy all KSK numbers in this emplacement"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Quick Add KSK to this category */}
          <button
            onClick={() => onQuickAdd(category.id)}
            className="p-1.5 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-900 transition-colors no-print no-export cursor-pointer"
            title={`Add KSK directly to ${category.name}`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Remove Emplacement */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCategory(category.id);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors no-print no-export cursor-pointer"
            title={`Remove emplacement "${category.name}"`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Large Automatic KSK Counter Badge */}
          <span
            id={`counter-${category.id}`}
            className={`min-w-7 h-7 px-2 rounded-lg flex items-center justify-center text-xs font-black font-mono shadow-2xs ${theme.counterBg}`}
            title={`Total KSKs: ${items.length}`}
          >
            {items.length}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-3 flex-1 flex flex-col justify-start min-h-[70px]">
        {items.length === 0 ? (
          <div
            onClick={() => onQuickAdd(category.id)}
            className="flex-1 flex flex-col items-center justify-center py-3 px-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 cursor-pointer transition-all"
          >
            <span className="text-xs font-bold text-slate-500 mb-0.5">No KSK Assigned</span>
            <span className="text-[11px] text-blue-600 font-bold no-print no-export flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add KSK
            </span>
          </div>
        ) : displayMode === 'vertical' ? (
          /* Vertical Stacked Layout */
          <div className="flex flex-col gap-1.5">
            {items.map((item) => {
              const matched = isMatched(item.kskNumber);
              return (
                <button
                  key={item.id}
                  id={`ksk-item-${item.id}`}
                  onClick={() => onKskClick(item)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold tracking-wider transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    matched
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-400 shadow-xs'
                      : `bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 ${theme.itemBorderHover}`
                  }`}
                  title="Click to Edit KSK number, Move, or Remove"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-slate-900 font-bold">{item.kskNumber}</span>
                    {item.description && (
                      <span className="text-[10px] text-slate-500 font-sans truncate max-w-[120px] font-medium">
                        ({item.description})
                      </span>
                    )}
                  </div>
                  <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-1 no-print no-export" />
                </button>
              );
            })}
          </div>
        ) : (
          /* One Line Mode (KSKs separated by - in a single horizontal flow) */
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono tracking-wide">
            {items.map((item, idx) => {
              const matched = isMatched(item.kskNumber);
              return (
                <React.Fragment key={item.id}>
                  <button
                    id={`ksk-item-${item.id}`}
                    onClick={() => onKskClick(item)}
                    className={`px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      matched
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-xs'
                        : 'text-slate-900 hover:text-blue-700 hover:bg-slate-200/80'
                    }`}
                    title={
                      item.description
                        ? `KSK: ${item.kskNumber} (${item.description}) - Click to Edit / Move / Remove`
                        : 'Click to Edit KSK number, Move, or Remove'
                    }
                  >
                    {item.kskNumber}
                  </button>
                  {idx < items.length - 1 && (
                    <span className="text-slate-400 font-bold select-none">-</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
