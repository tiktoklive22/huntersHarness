import React, { useState, useEffect } from 'react';
import { ShiftType } from '../types';
import { SHIFT_OPTIONS, ddmmYYYYToISO, isoToDDMMYYYY, getShiftWindowLabel, getCurrentShiftAndDate } from '../utils/dateUtils';
import { Calendar, Clock, Sparkles, Activity, Layers, Hash } from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  selectedShift: ShiftType;
  totalKsks: number;
  onDateChange: (date: string) => void;
  onShiftChange: (shift: ShiftType) => void;
  onSetCurrentShift: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  selectedShift,
  totalKsks,
  onDateChange,
  onShiftChange,
  onSetCurrentShift,
}) => {
  const [liveTime, setLiveTime] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isoDate = ddmmYYYYToISO(selectedDate);
  const shiftWindowLabel = getShiftWindowLabel(selectedDate, selectedShift);
  const currentDetected = getCurrentShiftAndDate();
  const isCurrentActive = selectedDate === currentDetected.date && selectedShift === currentDetected.shift;

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 shadow-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Industrial Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-black font-industrial">
                  KSK AREA
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  Live Follow Up
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-2">
                <span>HARNESS / HT FOLLOW UP</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                <span className="text-slate-700 text-xs font-mono font-medium">{liveTime}</span>
              </p>
            </div>
          </div>

          {/* Date and Shift System Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 p-1.5 sm:p-2 rounded-xl border border-slate-200">
            
            {/* Date Selector */}
            <div className="relative flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 hover:border-slate-400 transition-colors shadow-2xs">
              <Calendar className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
              <label htmlFor="date-input-hidden" className="text-xs font-bold text-slate-700 mr-1.5 cursor-pointer">
                Date:
              </label>
              <span className="text-xs sm:text-sm font-bold font-mono text-black tracking-wide">
                {selectedDate}
              </span>
              
              {/* Native invisible date picker overlaid on top for native calendar popup */}
              <input
                id="date-input-hidden"
                type="date"
                value={isoDate}
                onChange={(e) => {
                  if (e.target.value) {
                    onDateChange(isoToDDMMYYYY(e.target.value));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Click to choose production date"
              />
            </div>

            {/* Shift Selector */}
            <div className="relative flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 hover:border-slate-400 transition-colors shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
              <label htmlFor="shift-select" className="text-xs font-bold text-slate-700 mr-1.5">
                Shift:
              </label>
              <select
                id="shift-select"
                value={selectedShift}
                onChange={(e) => onShiftChange(e.target.value as ShiftType)}
                className="bg-transparent text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none cursor-pointer pr-1"
              >
                {SHIFT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-white text-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* "CURRENT SHIFT" Quick Sync Button */}
            <button
              id="btn-current-shift"
              onClick={onSetCurrentShift}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                isCurrentActive
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 hover:text-black'
              }`}
              title="Detect real current date and active shift based on local time"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isCurrentActive ? 'text-emerald-700' : 'text-blue-600'}`} />
              <span>CURRENT SHIFT</span>
              {isCurrentActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 ml-0.5" />
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-700 font-bold">TOTAL KSKs:</span>
                <span className="text-sm font-black font-mono text-white bg-blue-600 px-2 py-0.5 rounded shadow-2xs">
                  {totalKsks}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Shift Window Sub-header line */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600">Active Production Window:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {shiftWindowLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auto-saving state permanently</span>
          </div>
        </div>
      </div>
    </header>
  );
};
