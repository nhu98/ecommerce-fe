import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  url: string;
  className?: string;
}

export function AvatarUser({ url, className }: UserAvatarProps) {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage
        src={url ? url : 'https://github.com/shadcn.png'}
        alt="avatar"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
