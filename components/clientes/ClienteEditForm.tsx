"use client";

import { useState, useEffect } from "react";
import { User } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateCliente } from "@/actions/clientes/update-cliente";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ClienteEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: User | null;
  onSuccess: () => void;
}

export function ClienteEditForm({
  isOpen,
  onClose,
  cliente,
  onSuccess,
}: ClienteEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (isOpen && cliente) {
      setName(cliente.name || "");
      setPhone(cliente.phone || "");
      setCountryCode(cliente.country_code || "");
    }
  }, [isOpen, cliente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;

    setLoading(true);
    try {
      const result = await updateCliente({
        id: cliente.id,
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        country_code: countryCode.trim() || undefined,
      });

      if (result.success) {
        toast.success("Cliente actualizado");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al actualizar");
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
              Editar Cliente
            </p>
            <DialogTitle className="text-xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {cliente?.name || "Cliente"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit_name">Nombre</Label>
            <Input
              id="edit_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_email">Email</Label>
            <Input
              id="edit_email"
              value={cliente?.email || ""}
              disabled
              className="opacity-50"
            />
            <p className="text-[10px] text-muted-foreground">
              El email no se puede cambiar desde acá.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit_country_code">Código</Label>
              <Input
                id="edit_country_code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+54"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit_phone">Teléfono</Label>
              <Input
                id="edit_phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1123456789"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
