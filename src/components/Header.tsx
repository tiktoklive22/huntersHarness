import React, { useState, useEffect } from 'react';
import { ShiftType } from '../types';
import {
  SHIFT_OPTIONS,
  ddmmYYYYToISO,
  isoToDDMMYYYY,
  getShiftWindowLabel,
  getCurrentShiftAndDate,
  getShiftDisplayName,
  getShiftShortName,
} from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  Sparkles,
  Layers,
  Activity,
  ChevronDown,
  Hash,
  MapPin,
  Check,
  Radio,
} from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  selectedShift: ShiftType;
  totalKsks: number;
  totalEmplacements: number;
  onDateChange: (date: string) => void;
  onShiftChange: (shift: ShiftType) => void;
  onSetCurrentShift: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  selectedShift,
  totalKsks,
  totalEmplacements,
  onDateChange,
  onShiftChange,
  onSetCurrentShift,
}) => {
  const [liveTime, setLiveTime] = useState<string>('');
  const [liveFormattedDate, setLiveFormattedDate] = useState<string>('');

  // Live timer ticking every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${h}:${m}:${s}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      setLiveFormattedDate(now.toLocaleDateString(undefined, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isoDate = ddmmYYYYToISO(selectedDate);
  const shiftWindowLabel = getShiftWindowLabel(selectedDate, selectedShift);
  const currentDetected = getCurrentShiftAndDate();
  const isCurrentActive =
    selectedDate === currentDetected.date && selectedShift === currentDetected.shift;

  return (
    <header className="bg-[#0b1120] text-slate-100 border-b border-slate-800/90 shadow-lg relative select-none">
      {/* Top Ambient Glow / Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        {/* Row 1: Brand, Title, Status & KPI Metrics */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 pb-3 sm:pb-3.5 border-b border-slate-800/80">
          
          {/* Brand & App Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30 shrink-0 border border-blue-400/20">
              <Layers className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
            </div>
            <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wide text-white font-industrial uppercase whitespace-nowrap">
                KSK AREA — HARNESS / HT FOLLOW UP
              </h1>
              <span className="px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
          </div>

          {/* Right Metrics KPIs */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            {/* Total KSKs Metric */}
            <div className="bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 shadow-xs transition-colors">
              <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                <Hash className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Total KSKs</div>
                <div className="text-sm sm:text-base font-black font-mono text-white leading-tight">
                  {totalKsks} <span className="text-[10px] font-sans font-normal text-slate-400">Units</span>
                </div>
              </div>
            </div>

            {/* Total Emplacements Metric */}
            <div className="bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 shadow-xs transition-colors">
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Emplacements</div>
                <div className="text-sm sm:text-base font-black font-mono text-emerald-400 leading-tight">
                  {totalEmplacements} <span className="text-[10px] font-sans font-normal text-slate-400">Zones</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Live Time/Date & Global Shift Segmented Control */}
        <div className="pt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* Live System Time & Production Date Picker (5 cols on lg+) */}
          <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/70 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-inner">
            
            {/* Live Clock Display */}
            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 shrink-0">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Live System Clock</div>
                <div className="text-sm sm:text-base font-black font-mono text-white tracking-wide flex items-center gap-2 leading-tight">
                  <span className="text-blue-300">{liveTime || '--:--:--'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 font-sans font-medium">
                    {liveFormattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Switcher Input Capsule */}
            <div className="relative bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer shadow-inner shrink-0 group">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="text-left">
                  <div className="text-[8px] uppercase font-bold text-slate-400">Date</div>
                  <div className="text-xs font-bold font-mono text-slate-100 tracking-wider">{selectedDate}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors ml-0.5" />
              </div>
              <input
                id="header-date-input"
                type="date"
                value={isoDate}
                onChange={(e) => {
                  if (e.target.value) {
                    onDateChange(isoToDDMMYYYY(e.target.value));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Change active production date"
              />
            </div>

          </div>

          {/* Global Shift Segmented Selector & Sync Action (7 cols on lg+) */}
          <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/70 rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 pl-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Shift:
              </span>

              {/* Segmented Shift Pills */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 p-0.5 rounded-lg gap-1">
                {SHIFT_OPTIONS.map((shiftOpt) => {
                  const isSelected = selectedShift === shiftOpt;
                  return (
                    <button
                      key={shiftOpt}
                      type="button"
                      onClick={() => onShiftChange(shiftOpt)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                      title={getShiftDisplayName(shiftOpt)}
                    >
                      <span>{getShiftShortName(shiftOpt)}</span>
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Shift Auto-Detect Sync Button */}
            <button
              id="btn-sync-current-shift"
              onClick={onSetCurrentShift}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isCurrentActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-slate-700/90 hover:bg-slate-600 text-slate-200 border border-slate-600 hover:text-white'
              }`}
              title="Synchronize session to current clock time and shift"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isCurrentActive ? 'text-emerald-400' : 'text-blue-400'}`} />
              <span>CURRENT SHIFT</span>
              {isCurrentActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
              )}
            </button>

          </div>

        </div>

        {/* Bottom Status Sub-bar: Active Window details */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Window:</span>
            <span className="font-mono font-bold text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/70 text-xs">
              {shiftWindowLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-time persistence enabled</span>
          </div>
        </div>

      </div>
    </header>
  );
};
