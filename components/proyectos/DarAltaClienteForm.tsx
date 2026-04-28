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
import { darAltaCliente } from "@/actions/proyectos/dar-alta-cliente";
import { toast } from "react-hot-toast";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

interface DarAltaClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  proyectoId: string;
  proyectoNombre: string;
  onSuccess: () => void;
}

export function DarAltaClienteForm({
  isOpen,
  onClose,
  proyectoId,
  proyectoNombre,
  onSuccess,
}: DarAltaClienteFormProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const result = await darAltaCliente({
        proyecto_id: proyectoId,
        nombre: nombre.trim(),
        email: email.trim(),
        password: password,
      });

      if (result.success) {
        toast.success(result.message || "Cliente dado de alta exitosamente");
        setNombre("");
        setEmail("");
        setPassword("");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al dar de alta el cliente");
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
              Alta de Cliente
            </p>
            <DialogTitle className="text-xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Vincular al proyecto
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Proyecto: <span className="font-semibold text-foreground">{proyectoNombre}</span>
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Se creará un usuario con rol <strong>cliente</strong> y se vinculará automáticamente a este proyecto.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alta_nombre">Nombre completo</Label>
            <Input
              id="alta_nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alta_email">Email</Label>
            <Input
              id="alta_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alta_password">Contraseña</Label>
            <div className="relative">
              <Input
                id="alta_password"
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
