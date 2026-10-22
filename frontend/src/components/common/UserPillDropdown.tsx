import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBiodata } from '../../context/BiodataContext';
import { EditProfileModal } from '../profile/EditProfileModal';
import { MyProfileModal } from '../profile/MyProfileModal';

export interface UserPillDropdownProps {
  className?: string;
  pillClassName?: string;
  dropdownClassName?: string;
  align?: 'left' | 'right';
  onEditProfile?: () => void;
  onOpenMyProfile?: () => void;
  onLogout?: () => void;
}

export const UserPillDropdown: React.FC<UserPillDropdownProps> = ({
  className = '',
  pillClassName = '',
  dropdownClassName = '',
  align = 'right',
  onEditProfile,
  onOpenMyProfile,
  onLogout,
}) => {
  const { user, logout } = useAuth();
  const { formData } = useBiodata();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const displayName = user.full_name || user.email?.split('@')[0] || 'My Account';
  const displayEmail = user.email || '';
  const avatarImage = formData?.profilePictureUrl || (user as any)?.profile_picture_url;
  const initials = (user.full_name || user.email || 'U').substring(0, 2).toUpperCase();

  const handleToggle = () => {
    handleOpenMyProfile();
  };

  const handleOpenMyProfile = () => {
    setIsOpen(false);
    if (onOpenMyProfile) {
      onOpenMyProfile();
    } else {
      setIsProfileModalOpen(true);
    }
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('profile');
        url.searchParams.delete('edit');
        url.searchParams.delete('tab');
        window.history.replaceState(null, '', url.toString());
        localStorage.removeItem('edit_profile_open');
      } catch (e) {}
    }
  };

  const handleEditProfileClick = () => {
    setIsOpen(false);
    if (onEditProfile) {
      onEditProfile();
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        url.searchParams.delete('tab');
        url.searchParams.delete('section');
        window.history.replaceState(null, '', url.toString());
        localStorage.removeItem('edit_profile_open');
      } catch (e) {}
    }
  };

  const handleLogoutClick = async () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <>
      <div ref={dropdownRef} className={`relative text-left ${className || 'inline-block'}`}>
        {/* Pill Trigger Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100/90 text-purple-900 border border-purple-200/80 transition-all duration-150 cursor-pointer shadow-2xs select-none active:scale-[0.98] ${pillClassName}`}
        >
          {/* Avatar / Photo */}
          {avatarImage ? (
            <img
              src={avatarImage}
              alt={displayName}
              className="w-5.5 h-5.5 rounded-full object-cover border border-purple-300 ring-1 ring-purple-200/50 shrink-0"
            />
          ) : (
            <div
              className="w-5.5 h-5.5 rounded-full bg-purple-700 text-white font-black text-[10px] flex items-center justify-center shrink-0 notranslate"
              translate="no"
            >
              {initials}
            </div>
          )}

          {/* User Display Name */}
          <span className="text-xs font-bold max-w-[110px] sm:max-w-[140px] truncate text-slate-800">
            {displayName}
          </span>

          {/* Rotating Chevron */}
          <ChevronDown
            size={13}
            className={`text-purple-600/70 group-hover:text-purple-700 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-purple-800' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute ${alignmentClass} top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 ring-1 ring-black/5 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden ${dropdownClassName}`}
          >
            {/* User Quick Info Header - Clicking username or card opens My Profile */}
            <button
              type="button"
              onClick={handleOpenMyProfile}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-purple-50/80 border-b border-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer group/user"
              title="View My Profile"
            >
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-purple-200 group-hover/user:border-purple-300 shrink-0 transition-colors"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-purple-600 group-hover/user:bg-purple-700 text-white font-black text-xs flex items-center justify-center shrink-0 transition-colors notranslate"
                  translate="no"
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 group-hover/user:text-purple-900 truncate leading-tight transition-colors">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="text-[10px] text-slate-500 truncate leading-normal">
                    {displayEmail}
                  </p>
                )}
              </div>
              <ChevronRight
                size={14}
                className="text-slate-400 group-hover/user:text-purple-600 group-hover/user:translate-x-0.5 transition-all shrink-0"
              />
            </button>

            {/* Menu Options */}
            <div className="p-1 space-y-0.5">
              {/* My Profile */}
              <button
                type="button"
                onClick={handleOpenMyProfile}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-100/70 group-hover:bg-purple-200/80 flex items-center justify-center text-purple-700 transition-colors shrink-0">
                  <User size={13} />
                </div>
                <span>My Profile</span>
              </button>

              {/* Edit Profile */}
              <button
                type="button"
                onClick={handleEditProfileClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-100/70 group-hover:bg-purple-200/80 flex items-center justify-center text-purple-700 transition-colors shrink-0">
                  <Edit3 size={13} />
                </div>
                <span>Edit Profile</span>
              </button>

              {/* Separator */}
              <div className="my-1 border-t border-slate-100" />

              {/* Logout Option - Styled in Vivid Red */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-red-100/60 group-hover:bg-red-200/80 flex items-center justify-center text-red-600 group-hover:text-red-700 transition-colors shrink-0">
                  <LogOut size={13} />
                </div>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* My Profile Modal Dialog (fallback if onOpenMyProfile not passed) */}
      {!onOpenMyProfile && (
        <MyProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
        />
      )}
    </>
  );
};
