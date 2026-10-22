import React, { useState } from 'react';

interface UserAvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoUrl,
  name,
  size = 'sm',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name || 'User profile photo'}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-slate-200 shadow-2xs shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  // Blank profile photo like social media platforms (neutral silhouette avatar)
  return (
    <div
      className={`${sizeClasses} rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ${className}`}
      title={name || 'No profile photo'}
    >
      <svg
        className={`${iconSizes} text-slate-400 translate-y-0.5`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};
