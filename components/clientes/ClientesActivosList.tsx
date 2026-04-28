"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/interface/user";
import { getClientes } from "@/actions/clientes/get-clientes";
import { deleteCliente } from "@/actions/clientes/delete-cliente";
import { ClienteActivoCard } from "@/components/clientes/ClienteActivoCard";
import { ClienteEditForm } from "@/components/clientes/ClienteEditForm";
import { Searchbar } from "@/components/Searchbar";
import { Loader2, SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const LIMIT = 12;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function ClientesActivosList() {
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<User | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(
    async (pageNum: number, search: string, isNewSearch = false) => {
      setLoading(true);
      try {
        const result = await getClientes({
          page: pageNum,
          limit: LIMIT,
          search: search || undefined,
        });

        if (result.success && result.data) {
          setItems((prev) => (isNewSearch ? result.data! : [...prev, ...result.data!]));
          setHasMore(result.hasMore ?? false);
        } else {
          toast.error(result.error || "Error al cargar clientes");
        }
      } catch {
        toast.error("Error inesperado al cargar clientes");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [],
  );

  // Efecto para cambios en búsqueda
  useEffect(() => {
    setPage(0);
    setInitialLoading(true);
    fetchItems(0, debouncedSearch, true);
  }, [debouncedSearch, fetchItems]);

  // Scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchItems(nextPage, debouncedSearch);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, initialLoading, page, debouncedSearch, fetchItems]);

  const handleEdit = (cliente: User) => {
    setEditingCliente(cliente);
    setIsEditOpen(true);
  };

  const handleDelete = async (cliente: User) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar al cliente "${cliente.name || cliente.email}"? Esta acción eliminará su cuenta y no se puede deshacer.`,
      )
    )
      return;

    try {
      const result = await deleteCliente(cliente.id);
      if (result.success) {
        toast.success("Cliente eliminado");
        setItems((prev) => prev.filter((i) => i.id !== cliente.id));
      } else {
        toast.error(result.error || "Error al eliminar");
      }
    } catch {
      toast.error("Error inesperado");
    }
  };

  const handleEditSuccess = () => {
    setPage(0);
    fetchItems(0, debouncedSearch, true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users size={28} className="text-primary" />
            Clientes Activos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Usuarios con rol de cliente en la plataforma
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <label className="text-sm font-medium mb-2 block">Buscar cliente</label>
        <Searchbar
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {initialLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Cargando clientes...</p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((cliente) => (
              <ClienteActivoCard
                key={cliente.id}
                cliente={cliente}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

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
          <h3 className="text-xl font-semibold">No se encontraron clientes</h3>
          <p className="text-muted-foreground text-center max-w-xs mt-2">
            {searchTerm
              ? "Probá ajustando la búsqueda."
              : "Todavía no hay usuarios con rol de cliente."}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setSearchTerm("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}

      <ClienteEditForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        cliente={editingCliente}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
