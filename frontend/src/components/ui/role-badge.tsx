import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

const roleConfig = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-gradient-to-r from-[hsl(var(--role-super-admin-from))] to-[hsl(var(--role-super-admin-to))] text-white border-0 font-semibold",
  },
  ADMIN: {
    label: "Administrador",
    className: "bg-gradient-to-r from-[hsl(var(--role-admin-from))] to-[hsl(var(--role-admin-to))] text-white border-0 font-semibold",
  },
  USER: {
    label: "Usuário",
    className: "bg-gradient-to-r from-[hsl(var(--role-user-from))] to-[hsl(var(--role-user-to))] text-white border-0 font-semibold",
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}