import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ShieldAlert,
  TrendingUp,
  X,
  Bell,
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'user_analysis'
  | 'notifications'
  | 'templates'
  | 'security'
  | 'settings';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const navGroups: NavGroup[] = [
    {
      title: 'Mission Control',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Directory', icon: Users },
      ],
    },
    {
      title: 'Growth & Engagement',
      items: [
        { id: 'user_analysis', label: 'User Intent & Funnel', icon: TrendingUp },
        { id: 'notifications', label: 'Broadcast Alerts', icon: Bell },
        { id: 'templates', label: 'Template Studio', icon: FileText },
      ],
    },
    {
      title: 'Platform Governance',
      items: [
        { id: 'security', label: 'Security & SOC Logs', icon: ShieldAlert },
        { id: 'settings', label: 'System Configuration', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200/90 select-none shadow-xs">
      {/* Branding Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200/80 bg-white">
        <div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 block">TrueMarriage</span>
          <p className="text-[10px] font-mono text-slate-400 tracking-wider">COMMAND CONSOLE</p>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition cursor-pointer group ${
                    isActive
                      ? 'bg-[#F01472] text-white font-bold shadow-sm shadow-[#F01472]/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin Identity Footer */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F01472] to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono shadow-xs">
            {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.full_name || 'Admin Console'}
            </p>
            <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          title="Sign out of Admin Session"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
