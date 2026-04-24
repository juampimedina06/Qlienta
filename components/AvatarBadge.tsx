import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarBadgeProps {
  name: string | null;
  avatar_url?: string | null;
  className?: string;
}

export const AvatarBadge = ({ name, avatar_url, className }: AvatarBadgeProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className="h-7 w-7 border border-inherit/20">
        <AvatarImage src={avatar_url || ""} />
        <AvatarFallback className="text-xs font-medium bg-transparent">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-inherit">{name}</span>
    </div>
  );
};