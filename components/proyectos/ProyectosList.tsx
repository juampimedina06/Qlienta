"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Proyecto } from "@/interface/proyecto";
import { getProyectos } from "@/actions/proyectos/get-proyectos";
import { deleteProyecto } from "@/actions/proyectos/delete-proyecto";
import { ClientCard } from "@/components/clientes/ClienteCard";
import { ClientFilter } from "@/components/clientes/ClienteFilter";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, SearchX } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const LIMIT = 12;

export function ProyectosList() {
  const router = useRouter();

  // Estado de los datos
  const [items, setItems] = useState<Proyecto[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado de los filtros
  const [filters, setFilters] = useState({
    search: "",
    estado: "all",
    pagado: "all",
  });

  // Estado del modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Proyecto | null>(null);

  // Ref para el observador de scroll infinito
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(
    async (pageNum: number, currentFilters: typeof filters, isNewSearch = false) => {
      setLoading(true);
      try {
        const result = await getProyectos({
          page: pageNum,
          limit: LIMIT,
          search: currentFilters.search,
          estado: currentFilters.estado,
          pagado: currentFilters.pagado,
        });

        if (result.success && result.data) {
          setItems((prev) => (isNewSearch ? result.data! : [...prev, ...result.data!]));
          setHasMore(result.hasMore ?? false);
        } else {
          toast.error(result.error || "Error al cargar proyectos");
        }
      } catch {
        toast.error("Error inesperado al cargar proyectos");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [],
  );

  // Efecto para cambios en filtros
  useEffect(() => {
    setPage(0);
    setInitialLoading(true);
    fetchItems(0, filters, true);
  }, [filters, fetchItems]);

  // Efecto para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchItems(nextPage, filters);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, initialLoading, page, filters, fetchItems]);

  const handleEdit = (proyecto: Proyecto) => {
    setEditingItem(proyecto);
    setIsFormOpen(true);
  };

  const handleDelete = async (proyecto: Proyecto) => {
    if (!confirm(`¿Estás seguro de eliminar el proyecto "${proyecto.nombre_proyecto}"?`)) return;

    try {
      const result = await deleteProyecto(proyecto.id);
      if (result.success) {
        toast.success("Proyecto eliminado");
        setItems((prev) => prev.filter((i) => i.id !== proyecto.id));
      } else {
        toast.error(result.error || "Error al eliminar");
      }
    } catch {
      toast.error("Error inesperado");
    }
  };

  const handleCreateSuccess = () => {
    setPage(0);
    fetchItems(0, filters, true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestión de todos los proyectos de la plataforma
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={18} /> Nuevo Proyecto
        </Button>
      </div>

      <ClientFilter
        currentFilters={filters}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        onEstadoChange={(estado) => setFilters((prev) => ({ ...prev, estado }))}
        onPagadoChange={(pagado) => setFilters((prev) => ({ ...prev, pagado }))}
      />

      {initialLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Cargando proyectos...</p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((proyecto) => (
              <ClientCard
                key={proyecto.id}
                proyecto={proyecto}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Sentinel para scroll infinito */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {loading && hasMore && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando más...</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-sm text-muted-foreground italic">
                Has llegado al final de la lista
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <SearchX size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No se encontraron proyectos</h3>
          <p className="text-muted-foreground text-center max-w-xs mt-2">
            Probá ajustando los filtros o creá un nuevo proyecto para empezar.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setFilters({ search: "", estado: "all", pagado: "all" })}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      <ProyectoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        proyecto={editingItem}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
