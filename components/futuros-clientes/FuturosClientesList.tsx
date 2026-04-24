"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FuturoCliente } from "@/interface/futuro-cliente";
import { getFuturosClientes } from "@/actions/futuros-clientes/get-futuro-cliente";
import { deleteFuturoCliente } from "@/actions/futuros-clientes/delete-futuro-cliente";
import { FuturoClienteCard } from "./FuturoClienteCard";
import { FuturoClienteForm } from "./FormFuturoCliente";
import { FuturoClientesFilters } from "./FuturosClientesFilters";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, SearchX } from "lucide-react";
import { toast } from "react-hot-toast";

const LIMIT = 10;

export function FuturosClientesList() {
  // Estado de los datos
  const [items, setItems] = useState<FuturoCliente[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado de los filtros
  const [filters, setFilters] = useState({
    search: "",
    estado: "all",
    categoria: "all",
  });

  // Estado del modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FuturoCliente | null>(null);

  // Ref para el observador de scroll infinito
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(
    async (pageNum: number, currentFilters: typeof filters, isNewSearch = false) => {
      setLoading(true);
      try {
        const result = await getFuturosClientes({
          page: pageNum,
          limit: LIMIT,
          search: currentFilters.search,
          estado: currentFilters.estado,
          categoria: currentFilters.categoria,
        });

        if (result.success && result.data) {
          setItems((prev) => (isNewSearch ? result.data! : [...prev, ...result.data!]));
          setHasMore(result.hasMore);
        } else {
          toast.error(result.error || "Error al cargar prospectos");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Error inesperado al cargar prospectos");
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

  const handleEdit = (item: FuturoCliente) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: FuturoCliente) => {
    if (!confirm(`¿Estás seguro de eliminar a "${item.nombre_negocio}"?`)) return;

    try {
      const result = await deleteFuturoCliente(item.id);
      if (result.success) {
        toast.success("Prospecto eliminado");
        // Refrescar lista actualizando el estado local
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        toast.error(result.error || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error inesperado");
    }
  };

  const handleCreateSuccess = () => {
    // Resetear a la primera página para ver el nuevo item
    setPage(0);
    fetchItems(0, filters, true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Futuros Clientes</h1>
        <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="gap-2">
          <Plus size={18} /> Nuevo Prospecto
        </Button>
      </div>

      <FuturoClientesFilters
        currentFilters={filters}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        onEstadoChange={(estado) => setFilters((prev) => ({ ...prev, estado }))}
        onCategoriaChange={(categoria) => setFilters((prev) => ({ ...prev, categoria }))}
      />

      {initialLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Cargando prospectos...</p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <FuturoClienteCard
                key={item.id}
                futuroCliente={item}
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
          <h3 className="text-xl font-semibold">No se encontraron prospectos</h3>
          <p className="text-muted-foreground text-center max-w-xs mt-2">
            Probá ajustando los filtros o cargá un nuevo cliente para empezar.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setFilters({ search: "", estado: "all", categoria: "all" })}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      <FuturoClienteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        futuroCliente={editingItem}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
