import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, Heart } from 'lucide-react';
import type { AdminSection } from './AdminSidebar';

interface AdminTopbarProps {
  activeSection?: AdminSection;
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onOpenMobileMenu,
}) => {
  const { logout } = useAuth();

  return (
    <header className="md:hidden h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-20 select-none shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5 text-[#F01472]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#F01472] flex items-center justify-center text-white shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="font-bold text-sm text-slate-900">TrueMarriage Admin</span>
        </div>
      </div>

      <button
        onClick={() => logout()}
        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        title="Log Out of Admin Panel"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
};
