"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Proyecto } from "@/interface/proyecto";
import { deleteProyecto } from "@/actions/proyectos/delete-proyecto";
import { toast } from "react-hot-toast";

interface ConfirmDeleteProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  onSuccess: () => void;
}

export function ConfirmDeleteProyectoModal({
  isOpen,
  onClose,
  proyecto,
  onSuccess,
}: ConfirmDeleteProyectoModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!proyecto) return;

    setLoading(true);
    try {
      const result = await deleteProyecto(proyecto.id);
      if (result.success) {
        toast.success("Proyecto eliminado correctamente");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al eliminar el proyecto");
      }
    } catch {
      toast.error("Error inesperado al eliminar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  if (!proyecto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <DialogTitle className="text-xl font-bold">¿Eliminar proyecto?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Estás a punto de eliminar el proyecto <span className="font-semibold text-foreground">"{proyecto.nombre_proyecto}"</span>. 
            Esta acción no se puede deshacer y se perderán todos los datos asociados.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 mt-4 sm:justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-full gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Eliminar ahora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
