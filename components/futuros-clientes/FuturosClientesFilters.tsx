import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Searchbar } from "@/components/Searchbar";

export type FuturoClienteEstado =
  | "en creacion"
  | "creado"
  | "rechazado"
  | "aceptado";

interface FuturoClientesFiltersProps {
  onSearchChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  currentFilters: {
    search: string;
    estado: string;
    categoria: string;
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const CATEGORIAS = [
  "Gastronomía",
  "Retail",
  "Servicios",
  "Tecnología",
  "Salud",
  "Educación",
  "Inmobiliaria",
  "Otro",
];

export function FuturoClientesFilters({
  onSearchChange,
  onEstadoChange,
  onCategoriaChange,
  currentFilters,
}: FuturoClientesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (currentFilters.search !== searchTerm) {
      setSearchTerm(currentFilters.search);
    }
  }, [currentFilters.search]);

  useEffect(() => {
    if (debouncedSearch !== currentFilters.search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, currentFilters.search]);

  return (
    <div className="grid grid-cols-12 gap-4 pb-8">
      {/* Búsqueda */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 space-y-2">
        <label className="text-sm font-medium">
          Buscar por negocio o contacto
        </label>
        <Searchbar
          placeholder="Escribe para buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Selects */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <div className="grid grid-cols-12 gap-4">
          {/* Estado */}
          <div className="space-y-2 col-span-6">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter size={16} /> Estado
            </label>
            <Select
              value={currentFilters.estado}
              onValueChange={onEstadoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="en creacion">En creación</SelectItem>
                <SelectItem value="creado">Creado</SelectItem>
                <SelectItem value="aceptado">Aceptado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoría */}
          <div className="space-y-2 col-span-6">
            <label className="text-sm font-medium truncate block">
              Categoría
            </label>
            <Select
              value={currentFilters.categoria}
              onValueChange={onCategoriaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {CATEGORIAS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
