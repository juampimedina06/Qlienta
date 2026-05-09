"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FuturoCliente } from "@/interface/futuro-cliente";
import { getFuturosClientes } from "@/actions/futuros-clientes/get-futuro-cliente";
import { deleteFuturoCliente } from "@/actions/futuros-clientes/delete-futuro-cliente";
import { FuturoClienteCard } from "./FuturoClienteCard";
import { FuturoClienteForm } from "./FormFuturoCliente";
import { FuturoClientesFilters } from "./FuturosClientesFilters";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, SearchX, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

const LIMIT = 10;

export function FuturosClientesList({
  soloDesplegados = false,
  basePath = "/admin/futurosClientes",
}: {
  soloDesplegados?: boolean;
  basePath?: string;
}) {
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
    async (
      pageNum: number,
      currentFilters: typeof filters,
      isNewSearch = false,
    ) => {
      setLoading(true);
      try {
        const result = await getFuturosClientes({
          page: pageNum,
          limit: LIMIT,
          search: currentFilters.search,
          estado: currentFilters.estado,
          categoria: currentFilters.categoria,
          soloDesplegados,
        });

        if (result.success && result.data) {
          setItems((prev) =>
            isNewSearch ? result.data! : [...prev, ...result.data!],
          );
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
    [soloDesplegados],
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
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !initialLoading
        ) {
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
    if (!confirm(`¿Estás seguro de eliminar a "${item.nombre_negocio}"?`))
      return;

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">
            {soloDesplegados ? "Clientes Desplegados" : "Clientes Potenciales"}
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Gestión de leads y oportunidades activas
          </p>
        </div>
        {!soloDesplegados && (
          <Button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="group relative overflow-hidden bg-white hover:bg-white text-black font-black uppercase tracking-widest px-6 py-6 rounded-2xl transition-all active:scale-95 "
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <Plus size={20} className="mr-2" />
            Futuro cliente
          </Button>
        )}
      </div>

      {!soloDesplegados && (
        <FuturoClientesFilters
          currentFilters={filters}
          onSearchChange={(search) =>
            setFilters((prev) => ({ ...prev, search }))
          }
          onEstadoChange={(estado) =>
            setFilters((prev) => ({ ...prev, estado }))
          }
          onCategoriaChange={(categoria) =>
            setFilters((prev) => ({ ...prev, categoria }))
          }
        />
      )}
      {initialLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500 relative z-10" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">
            Sincronizando Leads...
          </p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <FuturoClienteCard
                key={item.id}
                futuroCliente={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                basePath={basePath}
              />
            ))}
          </div>

          {/* Sentinel para scroll infinito */}
          <div
            ref={observerTarget}
            className="h-24 flex items-center justify-center"
          >
            {loading && hasMore && (
              <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span>Cargando más registros</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                <Sparkles size={12} className="text-emerald-500/30" />
                Fin del pipeline
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border border-zinc-800 border-dashed rounded-[2rem] bg-zinc-900/10">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl mb-6">
            <SearchX size={48} className="text-zinc-700" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Sin resultados
          </h3>
          <p className="text-zinc-500 text-center max-w-xs mt-3 font-medium">
            No encontramos leads que coincidan con tu criterio de búsqueda
            actual.
          </p>
          <Button
            variant="outline"
            className="mt-8 border-zinc-700 hover:bg-zinc-800 text-zinc-400 font-bold px-8 rounded-xl"
            onClick={() =>
              setFilters({ search: "", estado: "all", categoria: "all" })
            }
          >
            Resetear Pipeline
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
