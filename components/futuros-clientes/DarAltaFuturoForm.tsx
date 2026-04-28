"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { darAltaFuturoCliente } from "@/actions/futuros-clientes/dar-alta-futuro-cliente";
import { FuturoCliente } from "@/interface/futuro-cliente";
import { toast } from "react-hot-toast";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

interface DarAltaFuturoFormProps {
  isOpen: boolean;
  onClose: () => void;
  futuroCliente: FuturoCliente;
  onSuccess: () => void;
}

export function DarAltaFuturoForm({
  isOpen,
  onClose,
  futuroCliente,
  onSuccess,
}: DarAltaFuturoFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nombreProyecto, setNombreProyecto] = useState(
    `Proyecto ${futuroCliente.nombre_negocio}`,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("La contraseña es obligatoria");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const result = await darAltaFuturoCliente({
        futuro_cliente_id: futuroCliente.id,
        password,
        nombre_proyecto: nombreProyecto.trim() || undefined,
      });

      if (result.success) {
        toast.success(result.message || "Cliente dado de alta exitosamente", {
          duration: 4000,
          icon: "🎉",
        });
        setPassword("");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al dar de alta");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              Dar de Alta
            </p>
            <DialogTitle className="text-xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {futuroCliente.nombre_negocio}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Se creará una cuenta con los datos del prospecto y un proyecto vinculado.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground">Nombre:</span>{" "}
                <span className="font-medium">{futuroCliente.nombre_contacto}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{futuroCliente.email_contacto}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alta_fc_proyecto">Nombre del proyecto</Label>
            <Input
              id="alta_fc_proyecto"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
              placeholder="Ej: Sitio web para Tienda X"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alta_fc_password">Contraseña para el cliente</Label>
            <div className="relative">
              <Input
                id="alta_fc_password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              Dar de alta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
