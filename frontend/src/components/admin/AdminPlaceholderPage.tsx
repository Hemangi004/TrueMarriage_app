import React from 'react';
import { Users, Clock, ShoppingBag, DollarSign, MessageSquare, ArrowRight } from 'lucide-react';
import type { AdminSection } from './AdminSidebar';

interface AdminPlaceholderPageProps {
  section: AdminSection;
}

export const AdminPlaceholderPage: React.FC<AdminPlaceholderPageProps> = ({ section }) => {
  const configs: Record<string, { title: string; phase: string; description: string; icon: any; color: string; }> = {
    users: {
      title: 'User Management',
      phase: 'Phase 10B',
      description: 'Comprehensive user directory, role assignments, audit activity, and account status controls.',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
    },
    orders: {
      title: 'Order Tracking & Invoices',
      phase: 'Phase 10B',
      description: 'Customer order logs, invoice generation, refund workflows, and payment reconciliation.',
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600',
    },
    revenue: {
      title: 'Revenue Analytics & MRR',
      phase: 'Phase 10C',
      description: 'Financial insights, plan breakdowns, coupon ROI, and currency conversion records.',
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
    },
    support: {
      title: 'Support Desk & Tickets',
      phase: 'Phase 10C',
      description: 'User inquiry triage, resolution SLAs, canned responses, and satisfaction ratings.',
      icon: MessageSquare,
      color: 'from-rose-600 to-pink-600',
    },
    dashboard: {
      title: 'Dashboard Overview',
      phase: 'Phase 10A',
      description: 'System control panel overview.',
      icon: Clock,
      color: 'from-purple-600 to-indigo-600',
    },
  };

  const config = configs[section] || configs.users;
  const Icon = config.icon;

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${config.color} text-white flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-900">{config.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                {config.phase}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Foundation Placeholder Page</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-purple-600 pl-4 py-1">
          {config.description}
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Backend authorization enforcement for this route is active.</span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            Scheduled in Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
