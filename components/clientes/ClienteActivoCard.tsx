"use client";

import { User } from "@/interface/user";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import {
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

interface ClienteActivoCardProps {
  cliente: User;
  onEdit: (cliente: User) => void;
  onDelete: (cliente: User) => void;
}

export function ClienteActivoCard({ cliente, onEdit, onDelete }: ClienteActivoCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm flex flex-col h-full ring-1 ring-border/50 hover:ring-primary/20">
      <div className="flex flex-col flex-1 min-w-0">
        <CardHeader className="space-y-3">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <AvatarBadge
              name={cliente.name || "Cliente"}
              avatar_url={getImagenUrl(cliente.avatar_url || "")}
              className="h-11 w-11"
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm md:text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                {cliente.name || "Sin nombre"}
              </CardTitle>
              <Badge className="px-1.5 py-0 text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mt-1">
                Cliente
              </Badge>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-1.5">
            {cliente.email && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Mail size={12} className="shrink-0 text-blue-500" />
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
            {cliente.phone && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Phone size={12} className="shrink-0 text-emerald-500" />
                <span>
                  {cliente.country_code ? `${cliente.country_code} ` : ""}
                  {cliente.phone}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardFooter className="p-3 md:p-4 pt-2 md:pt-0 border-t border-border/10 mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center text-[10px] text-muted-foreground font-medium truncate">
            <Calendar size={12} className="mr-1 opacity-70 shrink-0" />
            {cliente.created_at
              ? format(new Date(cliente.created_at), "d MMM yyyy", { locale: es })
              : "—"}
          </div>

          <div className="flex items-center gap-0.5 md:gap-1">
            <Link href={`/admin/clientes/${cliente.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Eye size={14} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => onEdit(cliente)}
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors"
              onClick={() => onDelete(cliente)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
