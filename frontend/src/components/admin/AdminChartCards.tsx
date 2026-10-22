import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Users,
  HeartHandshake,
  Zap,
  MapPin,
  CheckCircle2,
  Clock,
  Ban,
} from 'lucide-react';

export interface GrowthPoint {
  date: string;
  label: string;
  count: number;
  deletions?: number;
}

export interface AccountHealthData {
  total: number;
  active: number;
  pending: number;
  blocked: number;
  deactivated: number;
  admins: number;
  verified_emails: number;
  unverified_emails: number;
  email_verification_rate: number;
}

export interface DemographicsData {
  gender: { Male: number; Female: number; Other: number };
  marital_status: {
    'Never Married': number;
    Divorced: number;
    Widowed: number;
    'Awaiting Divorce': number;
  };
  age_brackets: {
    '18-24': number;
    '25-29': number;
    '30-34': number;
    '35+': number;
  };
  top_locations: { name: string; count: number }[];
}

export interface EngagementFunnelData {
  total_interests: number;
  pending: number;
  accepted: number;
  matched: number;
  declined: number;
  total_shortlists: number;
  match_rate: number;
}

export interface PremiumTelemetryData {
  total_clicks: number;
  registered_clicks: number;
  guest_clicks: number;
  unique_premium_users: number;
  intent_rate: number;
}

// -------------------------------------------------------------
// 1. User Acquisition & Growth Velocity Chart (Area / Line SVG)
// -------------------------------------------------------------
export const GrowthVelocityChart: React.FC<{ data: GrowthPoint[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center min-h-[260px] text-slate-400 text-xs">
        No growth data recorded yet
      </div>
    );
  }

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.count, d.deletions || 0)),
    5
  );
  const totalSignups = data.reduce((acc, curr) => acc + curr.count, 0);
  const totalDeletions = data.reduce((acc, curr) => acc + (curr.deletions || 0), 0);
  const netGrowth = totalSignups - totalDeletions;

  const width = 600;
  const height = 180;
  const paddingX = 24;
  const paddingY = 24;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1 || 1)) * graphWidth;
    const y = height - paddingY - (d.count / maxVal) * graphHeight;
    const delY = height - paddingY - ((d.deletions || 0) / maxVal) * graphHeight;
    return { x, y, delY, ...d, deletions: d.deletions || 0 };
  });

  const linePath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  const delLinePath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.delY}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.delY} ${cx},${pt.delY} ${pt.x},${pt.delY}`;
  }, '');

  const delAreaPath = `${delLinePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-black text-slate-900">User Acquisition & Churn Velocity</h4>
              <p className="text-[11px] text-slate-400 font-medium">Daily registrations vs account deletions over trailing 14 days</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-nowrap overflow-x-auto pb-0.5 sm:pb-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80 whitespace-nowrap">
            <span className="text-purple-500">Signups</span>
            <span className="font-bold">+{totalSignups}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80 whitespace-nowrap">
            <span className="text-rose-500">Deletions</span>
            <span className="font-bold">-{totalDeletions}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
              netGrowth >= 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border-amber-200/80'
            }`}
          >
            <span className="text-slate-400">Net</span>
            <span className="font-bold">{netGrowth >= 0 ? `+${netGrowth}` : netGrowth}</span>
          </span>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex items-center gap-4 text-xs font-semibold px-1">
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] inline-block shadow-xs" /> Registrations
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] inline-block shadow-xs" /> Deletions & Churn
        </span>
      </div>

      {/* SVG Chart */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="delGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Baseline */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area Fills */}
          <path d={areaPath} fill="url(#growthGradient)" />
          {totalDeletions > 0 && <path d={delAreaPath} fill="url(#delGradient)" />}

          {/* Smooth Curves */}
          {/* Deletions Curve */}
          <path
            d={delLinePath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Signups Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={pt.date}>
                {/* Deletions point */}
                <circle
                  cx={pt.x}
                  cy={pt.delY}
                  r={isHovered ? 5 : 3}
                  className="fill-white stroke-[#f43f5e] transition-all cursor-pointer"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {/* Signups point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  className="fill-white stroke-[#7c3aed] transition-all cursor-pointer"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute -top-3 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] font-bold p-2.5 rounded-xl shadow-xl pointer-events-none transition-all duration-150 z-20 border border-slate-700/60 min-w-[135px]"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
            }}
          >
            <div className="text-slate-300 font-mono text-[10px] border-b border-slate-700/80 pb-1 mb-1">
              {points[hoveredIdx].label}
            </div>
            <div className="flex items-center justify-between text-purple-300">
              <span>Signups:</span>
              <span className="font-mono">+{points[hoveredIdx].count}</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span>Deletions:</span>
              <span className="font-mono">-{points[hoveredIdx].deletions}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 border-t border-slate-700/80 pt-1 mt-1 font-black">
              <span>Net:</span>
              <span className="font-mono">
                {points[hoveredIdx].count - points[hoveredIdx].deletions >= 0 ? '+' : ''}
                {points[hoveredIdx].count - points[hoveredIdx].deletions}
              </span>
            </div>
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 px-1">
          <span>{data[0]?.label}</span>
          <span>{data[Math.floor(data.length / 2)]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. User Account Health & Verification Donut
// -------------------------------------------------------------
export const AccountHealthDonut: React.FC<{ data: AccountHealthData }> = ({ data }) => {
  const total = data.total || 1;
  const activePercent = Math.round((data.active / total) * 100);
  const pendingPercent = Math.round((data.pending / total) * 100);
  const blockedPercent = Math.round(((data.blocked + data.deactivated) / total) * 100);

  // Donut geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const activeStroke = (activePercent / 100) * circumference;
  const pendingStroke = (pendingPercent / 100) * circumference;
  const blockedStroke = (blockedPercent / 100) * circumference;

  const pendingOffset = -activeStroke;
  const blockedOffset = -(activeStroke + pendingStroke);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-start space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Account Health & Moderation</h4>
            <p className="text-[11px] text-slate-400 font-medium">Platform member standing & validation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6 my-auto py-2">
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="12"
            />
            {/* Active (Emerald) */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${activeStroke} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Pending (Amber) */}
            {pendingPercent > 0 && (
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray={`${pendingStroke} ${circumference}`}
                strokeDashoffset={pendingOffset}
              />
            )}
            {/* Blocked (Rose) */}
            {blockedPercent > 0 && (
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="transparent"
                stroke="#f43f5e"
                strokeWidth="12"
                strokeDasharray={`${blockedStroke} ${circumference}`}
                strokeDashoffset={blockedOffset}
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 font-mono">{activePercent}%</span>
            <span className="text-[9px] uppercase font-bold text-slate-400">Active</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active Members
            </span>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {data.active} ({activePercent}%)
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Verification
            </span>
            <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              {data.pending} ({pendingPercent}%)
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Ban className="w-3.5 h-3.5 text-rose-500" /> Blocked / Inactive
            </span>
            <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              {data.blocked + data.deactivated} ({blockedPercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Demographic & Community Distributions
// -------------------------------------------------------------
export const DemographicsCard: React.FC<{ data: DemographicsData }> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Auto-slide every 3.5s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slideTitles = [
    { label: 'Gender Distribution', tag: 'Gender' },
    { label: 'Marital Status Breakdown', tag: 'Marital' },
    { label: 'Age Bracket Distribution', tag: 'Age' },
    { label: 'Candidate State Distribution', tag: 'States' },
  ];

  const totalProfiles =
    (data.gender.Male || 0) + (data.gender.Female || 0) + (data.gender.Other || 0) || 1;
  const malePercent = Math.round(((data.gender.Male || 0) / totalProfiles) * 100);
  const femalePercent = Math.round(((data.gender.Female || 0) / totalProfiles) * 100);
  const otherPercent = Math.max(0, 100 - malePercent - femalePercent);

  // Marital status calculations
  const totalMarital =
    Object.values(data.marital_status).reduce((acc, c) => acc + c, 0) || 1;

  // Age brackets calculations & Line Chart coordinates
  const ageEntries = Object.entries(data.age_brackets);
  const maxAgeValue = Math.max(...ageEntries.map(([, c]) => c), 4);

  const chartW = 600;
  const chartH = 175;
  const padLeft = 40;
  const padRight = 40;
  const padTop = 32;
  const padBottom = 28;
  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;
  const baselineY = padTop + innerH;

  const agePoints = ageEntries.map(([bracket, count], index) => {
    const x = padLeft + (index / (ageEntries.length - 1)) * innerW;
    const y = padTop + innerH - (count / maxAgeValue) * innerH;
    return { bracket, count, x, y };
  });

  const ageLinePath = agePoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = agePoints[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const firstPt = agePoints[0];
  const lastPt = agePoints[agePoints.length - 1];
  const ageAreaPath = `${ageLinePath} L ${lastPt.x} ${baselineY} L ${firstPt.x} ${baselineY} Z`;

  const yTicks = [
    { value: maxAgeValue, y: padTop },
    { value: Math.round(maxAgeValue / 2), y: padTop + innerH / 2 },
    { value: 0, y: baselineY },
  ];

  // Top states calculations
  const maxCityCount = Math.max(...(data.top_locations?.map((l) => l.count) || [1]), 1);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 transition hover:border-slate-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F01472] flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Demographics & Attributes</h4>
            <p className="text-[11px] text-slate-400 font-medium">{slideTitles[currentSlide].label}</p>
          </div>
        </div>

        {/* Carousel Indicators & Pause Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isHovered && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider animate-fadeIn">
              Paused
            </span>
          )}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            {slideTitles.map((s, idx) => (
              <button
                key={s.tag}
                onClick={() => setCurrentSlide(idx)}
                title={s.label}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-5 bg-[#F01472]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sliding Carousel Viewport */}
      <div className="overflow-hidden w-full relative flex-1 flex flex-col justify-center my-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 0: GENDER GRAPH */}
          <div className="w-full shrink-0 min-h-[190px] flex flex-col justify-center space-y-3 px-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Male ({data.gender.Male || 0})
              </span>
              <span className="flex items-center gap-1.5 text-pink-600">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Female ({data.gender.Female || 0})
              </span>
              {otherPercent > 0 && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Other ({data.gender.Other || 0})
                </span>
              )}
            </div>

            {/* Segmented Graph Bar */}
            <div className="h-5 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
              <div
                style={{ width: `${Math.max(malePercent, 2)}%` }}
                className="bg-blue-500 h-full rounded-l-full transition-all duration-500"
                title={`Male: ${malePercent}%`}
              />
              <div
                style={{ width: `${Math.max(femalePercent, 2)}%` }}
                className="bg-pink-500 h-full transition-all duration-500"
                title={`Female: ${femalePercent}%`}
              />
              {otherPercent > 0 && (
                <div
                  style={{ width: `${otherPercent}%` }}
                  className="bg-slate-400 h-full rounded-r-full transition-all duration-500"
                  title={`Other: ${otherPercent}%`}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                <span className="text-[10px] text-blue-600 font-bold block uppercase">Male Ratio</span>
                <span className="text-base font-black text-blue-700 font-mono">{malePercent}%</span>
              </div>
              <div className="p-2.5 bg-pink-50/70 border border-pink-100 rounded-xl">
                <span className="text-[10px] text-pink-600 font-bold block uppercase">Female Ratio</span>
                <span className="text-base font-black text-pink-700 font-mono">{femalePercent}%</span>
              </div>
            </div>
          </div>

          {/* SLIDE 1: MARITAL STATUS GRAPH */}
          <div className="w-full shrink-0 min-h-[190px] flex flex-col justify-center space-y-2 px-1">
            {Object.entries(data.marital_status).map(([status, count]) => {
              const pct = Math.round((count / totalMarital) * 100);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate">{status}</span>
                    <span className="font-mono text-slate-500 font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SLIDE 2: AGE BRACKETS LINE CHART */}
          <div className="w-full shrink-0 min-h-[190px] flex flex-col justify-center px-1">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-40 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ageLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="ageStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Y-Axis Horizontal Grid Lines & Y-Axis Numbers */}
              {yTicks.map((tick, i) => (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={tick.y}
                    x2={chartW - padRight}
                    y2={tick.y}
                    stroke="#f1f5f9"
                    strokeDasharray={i === 2 ? 'none' : '3 3'}
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 6}
                    y={tick.y + 3.5}
                    textAnchor="end"
                    className="text-[10px] font-mono font-bold fill-slate-400"
                  >
                    {tick.value}
                  </text>
                </g>
              ))}

              {/* Y-axis line */}
              <line
                x1={padLeft}
                y1={padTop}
                x2={padLeft}
                y2={baselineY}
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Shaded Area Fill */}
              <path d={ageAreaPath} fill="url(#ageLineGradient)" />

              {/* Smooth Spline Curve */}
              <path
                d={ageLinePath}
                fill="none"
                stroke="url(#ageStrokeGrad)"
                strokeWidth="2.75"
                strokeLinecap="round"
              />

              {/* Data Points, Value Badges & X-Axis Labels */}
              {agePoints.map((pt, i) => (
                <g key={i}>
                  {/* Vertical dashed guide line to baseline */}
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={baselineY}
                    stroke="#f1f5f9"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />

                  {/* Value Number badge above the point */}
                  <rect
                    x={pt.x - 11}
                    y={pt.y - 18}
                    width="22"
                    height="14"
                    rx="4"
                    className="fill-purple-50 stroke stroke-purple-200"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-extrabold fill-purple-700"
                  >
                    {pt.count}
                  </text>

                  {/* Circle dot on the line */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    className="fill-white stroke-purple-600"
                    strokeWidth="2.5"
                  />

                  {/* X-axis age bracket label */}
                  <text
                    x={pt.x}
                    y={baselineY + 16}
                    textAnchor="middle"
                    className="text-[11px] font-mono font-bold fill-slate-600"
                  >
                    {pt.bracket}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* SLIDE 3: CANDIDATE STATES GRAPH */}
          <div className="w-full shrink-0 min-h-[190px] flex flex-col justify-center space-y-2.5 px-1">
            {data.top_locations && data.top_locations.length > 0 ? (
              data.top_locations.slice(0, 4).map((loc) => {
                const pct = Math.round((loc.count / maxCityCount) * 100);
                return (
                  <div key={loc.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{loc.name}</span>
                      </span>
                      <span className="font-mono text-slate-500 font-bold shrink-0">
                        {loc.count} candidates ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pct, 8)}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No candidate state distribution recorded yet
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// -------------------------------------------------------------
// 5. Engagement & Matchmaking Funnel
// -------------------------------------------------------------
export const EngagementFunnelCard: React.FC<{ data: EngagementFunnelData }> = ({ data }) => {
  const total = data.total_interests || 1;
  const acceptedRate = Math.round(((data.accepted + data.matched) / total) * 100);
  const pendingRate = Math.round((data.pending / total) * 100);
  const declinedRate = Math.round((data.declined / total) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900">Engagement & Match Funnel</h4>
          <p className="text-[11px] text-slate-400 font-medium">Interest proposals & mutual connection rates</p>
        </div>
      </div>

      {/* Stepped Funnel Progress */}
      <div className="space-y-2.5 py-1">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>1. Total Proposals Sent</span>
            <span className="font-mono">{data.total_interests}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full w-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span className="text-amber-700">2. Awaiting Decision (Pending)</span>
            <span className="font-mono text-amber-700">
              {data.pending} ({pendingRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              style={{ width: `${Math.max(pendingRate, 4)}%` }}
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span className="text-emerald-700">3. Accepted & Mutual Matches</span>
            <span className="font-mono text-emerald-700">
              {data.accepted + data.matched} ({acceptedRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              style={{ width: `${Math.max(acceptedRate, 4)}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span className="text-rose-700">4. Declined Proposals</span>
            <span className="font-mono text-rose-700">
              {data.declined} ({declinedRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              style={{ width: `${Math.max(declinedRate, 4)}%` }}
              className="bg-rose-400 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Premium Intent & Monetization Telemetry
// -------------------------------------------------------------
export const PremiumIntentCard: React.FC<{ data: PremiumTelemetryData }> = ({ data }) => {
  const total = data.total_clicks || 1;
  const regPercent = Math.round((data.registered_clicks / total) * 100);
  const guestPercent = 100 - regPercent;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Monetization & Upgrade Intent</h4>
            <p className="text-[11px] text-slate-400 font-medium">Premium action clicks & high-intent visitors</p>
          </div>
        </div>

        <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          {data.intent_rate}% Intent Rate
        </span>
      </div>

      {/* KPI Split */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Premium Clicks</span>
          <span className="text-xl font-black text-slate-900 font-mono">{data.total_clicks}</span>
          <span className="text-[10px] text-slate-400 block">Button interactions</span>
        </div>

        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
          <span className="text-[10px] uppercase font-mono text-amber-700 block">High-Intent Users</span>
          <span className="text-xl font-black text-amber-700 font-mono">{data.unique_premium_users}</span>
          <span className="text-[10px] text-amber-600 block">Unique member accounts</span>
        </div>
      </div>

      {/* Ratio Bar: Registered vs Guest */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-purple-700">Registered Accounts: {data.registered_clicks}</span>
          <span className="text-slate-500">Clicks from unregistered: {data.guest_clicks}</span>
        </div>

        <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
          <div
            style={{ width: `${Math.max(regPercent, 4)}%` }}
            className="bg-purple-600 h-full rounded-l-full transition-all duration-500"
            title={`Registered: ${regPercent}%`}
          />
          <div
            style={{ width: `${Math.max(guestPercent, 4)}%` }}
            className="bg-slate-300 h-full rounded-r-full transition-all duration-500"
            title={`Clicks from unregistered: ${guestPercent}%`}
          />
        </div>

        <p className="text-[10px] text-slate-400 text-center font-medium">
          {regPercent}% of conversion clicks originate from logged-in members
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. Skeleton Loaders for Graphs
// -------------------------------------------------------------
export const AnalyticsSkeletonGrid: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Row 1: 2 Cards (Growth Velocity & Account Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1 Skeleton: Growth Velocity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-44 h-2.5 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-20 h-9 bg-slate-100 rounded-xl" />
              <div className="w-20 h-9 bg-slate-100 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="w-full h-36 bg-slate-50 rounded-xl flex items-end justify-between p-3 gap-2 border border-slate-100">
              {[40, 65, 30, 80, 55, 90, 45, 70, 85, 60, 95, 75, 50, 85].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-slate-200/70 rounded-t-sm" />
              ))}
            </div>
            <div className="flex justify-between px-1">
              <div className="w-12 h-2 bg-slate-200 rounded" />
              <div className="w-12 h-2 bg-slate-200 rounded" />
              <div className="w-12 h-2 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Card 2 Skeleton: Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-36 h-2.5 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="w-16 h-3 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-3 py-2">
            <div className="flex justify-between">
              <div className="w-20 h-3 bg-slate-200 rounded" />
              <div className="w-20 h-3 bg-slate-200 rounded" />
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
          <div className="w-full h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Row 2: 3 Cards (Account Health, Engagement Funnel, Premium Intent) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 3 Skeleton: Account Health Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="w-36 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-48 h-2.5 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="flex items-center justify-around gap-6 py-2">
            <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center">
              <div className="w-10 h-3 bg-slate-200 rounded" />
            </div>
            <div className="space-y-3 w-44">
              <div className="w-full h-4 bg-slate-100 rounded" />
              <div className="w-full h-4 bg-slate-100 rounded" />
              <div className="w-full h-4 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="w-full h-10 bg-slate-100 rounded-xl" />
        </div>

        {/* Card 4 Skeleton: Engagement Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-40 h-2.5 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="space-y-3 py-1">
            {[90, 50, 65, 30].map((w, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="w-28 h-2.5 bg-slate-200 rounded" />
                  <div className="w-10 h-2.5 bg-slate-200 rounded" />
                </div>
                <div style={{ width: `${w}%` }} className="h-2.5 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
          <div className="w-full h-10 bg-slate-100 rounded-xl" />
        </div>

        {/* Card 5 Skeleton: Premium Intent */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
                <div className="w-40 h-2.5 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="w-20 h-6 bg-slate-100 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="w-24 h-2.5 bg-slate-200 rounded" />
              <div className="w-24 h-2.5 bg-slate-200 rounded" />
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full" />
            <div className="w-48 h-2 bg-slate-100 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
