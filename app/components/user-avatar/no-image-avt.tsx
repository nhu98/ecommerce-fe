import { UserRound } from 'lucide-react';
import React from 'react';

interface UserAvatarProps {
  isClickable?: boolean;
}

export function NoAvatar({ isClickable }: UserAvatarProps) {
  return (
    <div
      className={`w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center ${isClickable ? 'hover:bg-red-500 cursor-pointer transition-all duration-500' : ''}`}
    >
      <UserRound size={18} />
    </div>
  );
}
