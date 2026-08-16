import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Truck,
  CornerDownRight,
  RefreshCw,
  LayoutGrid,
  Users,
  MapPin,
  Star,
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Package,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const AVAILABLE_COLORS = [
  { id: 'emerald', label: 'Green / Emerald', bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-300' },
  { id: 'amber', label: 'Amber / Yellow', bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-300' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-300' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-600', text: 'text-teal-700', border: 'border-teal-300' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-300' },
  { id: 'red', label: 'Red', bg: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-300' },
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-600', text: 'text-sky-700', border: 'border-sky-300' },
  { id: 'indigo', label: 'Indigo / Dark Teal', bg: 'bg-indigo-600', text: 'text-indigo-700', border: 'border-indigo-300' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-600', text: 'text-violet-700', border: 'border-violet-300' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-600', text: 'text-pink-700', border: 'border-pink-300' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-300' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600', text: 'text-cyan-700', border: 'border-cyan-300' },
];

export const AVAILABLE_ICONS = [
  { id: 'check', label: 'Checkmark', component: Check },
  { id: 'check-circle', label: 'Check Circle', component: CheckCircle2 },
  { id: 'clock', label: 'Clock / Wait', component: Clock },
  { id: 'truck', label: 'Truck / Departure', component: Truck },
  { id: 'corner-down-right', label: 'Entry Point', component: CornerDownRight },
  { id: 'refresh-cw', label: 'Rework / Rotate', component: RefreshCw },
  { id: 'grid', label: 'Audit / Grid', component: LayoutGrid },
  { id: 'users', label: 'VK / Validation', component: Users },
  { id: 'map-pin', label: 'Line Side Pin', component: MapPin },
  { id: 'star', label: 'Star', component: Star },
  { id: 'clipboard', label: 'Clipboard', component: ClipboardList },
  { id: 'alert-triangle', label: 'Alert / Warning', component: AlertTriangle },
  { id: 'shield', label: 'Shield / Quality', component: ShieldCheck },
  { id: 'wrench', label: 'Wrench / Fix', component: Wrench },
  { id: 'box', label: 'Box / Package', component: Package },
  { id: 'layers', label: 'Layers', component: Layers },
  { id: 'sparkles', label: 'Sparkles', component: Sparkles },
  { id: 'zap', label: 'Speed / HT', component: Zap },
];

export function renderCategoryIcon(iconKey: string, className: string = 'w-4 h-4') {
  const match = AVAILABLE_ICONS.find((i) => i.id === iconKey);
  const IconComponent = match ? match.component : Check;
  return <IconComponent className={className} />;
}

export interface CategoryColorTheme {
  cardBorder: string;
  headerBg: string;
  headerText: string;
  headerBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  counterBg: string;
  counterText: string;
  itemBorderHover: string;
  accentBar: string;
  indicatorDot: string;
}

export function getCategoryTheme(color: string): CategoryColorTheme {
  switch (color) {
    case 'emerald':
    case 'green':
      return {
        cardBorder: 'border-2 border-emerald-400/90 shadow-sm',
        headerBg: 'bg-emerald-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-emerald-200',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
        badgeBorder: 'border border-emerald-300',
        counterBg: 'bg-emerald-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-emerald-500 hover:bg-emerald-50/60',
        accentBar: 'bg-emerald-600',
        indicatorDot: 'bg-emerald-600',
      };
    case 'amber':
    case 'yellow':
      return {
        cardBorder: 'border-2 border-amber-400/90 shadow-sm',
        headerBg: 'bg-amber-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-amber-200',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        badgeBorder: 'border border-amber-300',
        counterBg: 'bg-amber-500 text-slate-950 font-black',
        counterText: 'text-slate-950',
        itemBorderHover: 'hover:border-amber-500 hover:bg-amber-50/60',
        accentBar: 'bg-amber-500',
        indicatorDot: 'bg-amber-500',
      };
    case 'blue':
      return {
        cardBorder: 'border-2 border-blue-400/90 shadow-sm',
        headerBg: 'bg-blue-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-blue-200',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
        badgeBorder: 'border border-blue-300',
        counterBg: 'bg-blue-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-blue-500 hover:bg-blue-50/60',
        accentBar: 'bg-blue-600',
        indicatorDot: 'bg-blue-600',
      };
    case 'orange':
      return {
        cardBorder: 'border-2 border-orange-400/90 shadow-sm',
        headerBg: 'bg-orange-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-orange-200',
        badgeBg: 'bg-orange-100',
        badgeText: 'text-orange-800',
        badgeBorder: 'border border-orange-300',
        counterBg: 'bg-orange-500 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-orange-500 hover:bg-orange-50/60',
        accentBar: 'bg-orange-500',
        indicatorDot: 'bg-orange-500',
      };
    case 'teal':
    case 'cyan':
      return {
        cardBorder: 'border-2 border-teal-400/90 shadow-sm',
        headerBg: 'bg-teal-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-teal-200',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800',
        badgeBorder: 'border border-teal-300',
        counterBg: 'bg-teal-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-teal-500 hover:bg-teal-50/60',
        accentBar: 'bg-teal-600',
        indicatorDot: 'bg-teal-600',
      };
    case 'purple':
      return {
        cardBorder: 'border-2 border-purple-400/90 shadow-sm',
        headerBg: 'bg-purple-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-purple-200',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
        badgeBorder: 'border border-purple-300',
        counterBg: 'bg-purple-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-purple-500 hover:bg-purple-50/60',
        accentBar: 'bg-purple-600',
        indicatorDot: 'bg-purple-600',
      };
    case 'red':
    case 'rose':
      return {
        cardBorder: 'border-2 border-rose-400/90 shadow-sm',
        headerBg: 'bg-rose-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-rose-200',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        badgeBorder: 'border border-rose-300',
        counterBg: 'bg-rose-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-rose-500 hover:bg-rose-50/60',
        accentBar: 'bg-rose-600',
        indicatorDot: 'bg-rose-600',
      };
    case 'sky':
      return {
        cardBorder: 'border-2 border-sky-400/90 shadow-sm',
        headerBg: 'bg-sky-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-sky-200',
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-800',
        badgeBorder: 'border border-sky-300',
        counterBg: 'bg-sky-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-sky-500 hover:bg-sky-50/60',
        accentBar: 'bg-sky-600',
        indicatorDot: 'bg-sky-600',
      };
    case 'indigo':
      return {
        cardBorder: 'border-2 border-indigo-400/90 shadow-sm',
        headerBg: 'bg-indigo-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-indigo-200',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800',
        badgeBorder: 'border border-indigo-300',
        counterBg: 'bg-indigo-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-indigo-500 hover:bg-indigo-50/60',
        accentBar: 'bg-indigo-600',
        indicatorDot: 'bg-indigo-600',
      };
    case 'violet':
      return {
        cardBorder: 'border-2 border-violet-400/90 shadow-sm',
        headerBg: 'bg-violet-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-violet-200',
        badgeBg: 'bg-violet-100',
        badgeText: 'text-violet-800',
        badgeBorder: 'border border-violet-300',
        counterBg: 'bg-violet-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-violet-500 hover:bg-violet-50/60',
        accentBar: 'bg-violet-600',
        indicatorDot: 'bg-violet-600',
      };
    case 'pink':
      return {
        cardBorder: 'border-2 border-pink-400/90 shadow-sm',
        headerBg: 'bg-pink-50/80',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-pink-200',
        badgeBg: 'bg-pink-100',
        badgeText: 'text-pink-800',
        badgeBorder: 'border border-pink-300',
        counterBg: 'bg-pink-600 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-pink-500 hover:bg-pink-50/60',
        accentBar: 'bg-pink-600',
        indicatorDot: 'bg-pink-600',
      };
    default:
      return {
        cardBorder: 'border-2 border-slate-300 shadow-sm',
        headerBg: 'bg-slate-100',
        headerText: 'text-slate-900',
        headerBorder: 'border-b-2 border-slate-200',
        badgeBg: 'bg-slate-200',
        badgeText: 'text-slate-800',
        badgeBorder: 'border border-slate-300',
        counterBg: 'bg-slate-700 text-white font-black',
        counterText: 'text-white',
        itemBorderHover: 'hover:border-slate-500 hover:bg-slate-50',
        accentBar: 'bg-slate-500',
        indicatorDot: 'bg-slate-500',
      };
  }
}

