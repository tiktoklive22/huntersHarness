import React from 'react';
import { Category, DisplayMode, KSKItem, ShiftType } from '../types';
import { getShiftDisplayName } from '../utils/dateUtils';
import { getCategoryTheme, renderCategoryIcon } from '../utils/styleUtils';
import {
  Layers,
  Calendar,
  Clock,
  MapPin,
  Hash,
  CheckCircle2,
} from 'lucide-react';

interface ExportReportViewProps {
  selectedDate: string;
  selectedShift: ShiftType;
  categories: Category[];
  ksksByCategory: Map<string, KSKItem[]>;
  totalKsks: number;
  displayMode: DisplayMode;
}

export const ExportReportView: React.FC<ExportReportViewProps> = ({
  selectedDate,
  selectedShift,
  categories,
  ksksByCategory,
  totalKsks,
  displayMode,
}) => {
  const exportTimestamp = new Date().toLocaleString();

  return (
    <div className="bg-white text-slate-900 font-sans border-2 border-slate-300 rounded-3xl p-7 shadow-2xl space-y-6">
      
      {/* 1. Report Header Banner */}
      <div className="bg-[#0b1120] text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-start gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black font-industrial text-2xl shadow-md border border-blue-400/30 shrink-0">
              <Layers className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-industrial tracking-wide text-white uppercase whitespace-nowrap">
              KSK AREA — HARNESS / HT FOLLOW UP
            </h1>
          </div>
        </div>

        {/* Executive Metric Cards (4 Pillars) */}
        <div className="grid grid-cols-4 gap-3 pt-3.5">
          {/* 1. Date */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-inner">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Production Date</div>
              <div className="text-sm font-black font-mono text-white">{selectedDate}</div>
            </div>
          </div>

          {/* 2. Shift */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-inner">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Operational Shift</div>
              <div className="text-xs font-black text-slate-100 leading-tight">
                {getShiftDisplayName(selectedShift)}
              </div>
            </div>
          </div>

          {/* 3. Total KSKs */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-inner">
            <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total KSK Units</div>
              <div className="text-sm font-black font-mono text-emerald-400">
                {totalKsks} <span className="text-[10px] font-sans font-normal text-slate-300">Units</span>
              </div>
            </div>
          </div>

          {/* 4. Emplacements */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-inner">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Emplacements</div>
              <div className="text-sm font-black font-mono text-blue-300">
                {categories.length} <span className="text-[10px] font-sans font-normal text-slate-300">Zones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Emplacement Columns Content */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-500">
            No emplacements registered in this report.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 items-start">
            {categories.map((category) => {
              const items = ksksByCategory.get(category.id) || [];
              const theme = getCategoryTheme(category.color);

              return (
                <div
                  key={category.id}
                  className={`flex flex-col rounded-2xl ${theme.cardBorder} bg-white shadow-xs overflow-hidden border`}
                >
                  {/* Card Top Strip */}
                  <div className={`h-2.5 w-full ${theme.accentBar}`} />

                  {/* Header */}
                  <div className={`px-3.5 py-2.5 ${theme.headerBg} ${theme.headerBorder} flex items-center justify-between gap-2`}>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`p-1.5 rounded-lg ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} shrink-0`}>
                        {renderCategoryIcon(category.icon, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black uppercase tracking-wide font-industrial text-slate-900 leading-snug break-words">
                          {category.name}
                        </div>
                        {category.meaning && (
                          <div className="text-[9px] text-slate-500 font-medium truncate">
                            {category.meaning}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`min-w-6 h-6 px-1.5 rounded-lg flex items-center justify-center text-xs font-black font-mono ${theme.counterBg}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-3 min-h-[60px] flex flex-col justify-start">
                    {items.length === 0 ? (
                      <div className="py-3 px-2 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic">
                        0 KSKs Assigned
                      </div>
                    ) : displayMode === 'vertical' ? (
                      <div className="flex flex-col gap-1">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 flex items-center justify-between"
                          >
                            <span>{item.kskNumber}</span>
                            {item.description && (
                              <span className="text-[9px] text-slate-500 font-sans truncate max-w-[90px]">
                                ({item.description})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 p-2 bg-slate-50/90 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900">
                        {items.map((item, idx) => (
                          <React.Fragment key={item.id}>
                            <span className="px-1 py-0.5 rounded bg-white border border-slate-300 shadow-2xs">
                              {item.kskNumber}
                            </span>
                            {idx < items.length - 1 && (
                              <span className="text-slate-400 font-bold select-none">-</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Executive Quality Traceability Footer */}
      <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between gap-4 text-xs text-slate-600 font-mono">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-slate-500">Traceability & Verification</div>
          <div className="text-slate-800 font-medium">Export Generated: {exportTimestamp}</div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-bold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Data Verified & Synchronized
        </div>
      </div>

    </div>
  );
};
