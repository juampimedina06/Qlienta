import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search as SearchIcon } from "lucide-react";
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
    <div className="grid grid-cols-12 gap-6 pb-8">
      {/* Búsqueda */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 space-y-2.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
          Búsqueda Global
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-emerald-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Searchbar
            placeholder="Buscar por negocio, contacto, categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 text-white placeholder:text-zinc-600 rounded-xl h-12 transition-all"
          />
        </div>
      </div>

      {/* Selects */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Estado */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
              <Filter size={12} className="text-emerald-500" /> Estado
            </label>
            <Select
              value={currentFilters.estado}
              onValueChange={onEstadoChange}
            >
              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="en creacion">En creación</SelectItem>
                <SelectItem value="creado">Nuevos</SelectItem>
                <SelectItem value="aceptado">Aceptados</SelectItem>
                <SelectItem value="rechazado">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoría */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 truncate block">
              categoria de Negocio
            </label>
            <Select
              value={currentFilters.categoria}
              onValueChange={onCategoriaChange}
            >
              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500/50">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                <SelectItem value="all">Todas las categorias</SelectItem>
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
