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

interface ClientFilterProps {
  onSearchChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onPagadoChange: (value: string) => void;
  currentFilters: {
    search: string;
    estado: string;
    pagado: string;
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function ClientFilter({
  onSearchChange,
  onEstadoChange,
  onPagadoChange,
  currentFilters,
}: ClientFilterProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (currentFilters.search !== searchTerm)
      setSearchTerm(currentFilters.search);
  }, [currentFilters.search]);

  useEffect(() => {
    if (debouncedSearch !== currentFilters.search)
      onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange, currentFilters.search]);

  return (
    <div className="grid grid-cols-12 gap-4 pb-8">
      <div className="col-span-12 md:col-span-6 lg:col-span-7 space-y-2">
        <label className="text-sm font-medium">
          Buscar por proyecto o cliente
        </label>
        <Searchbar
          placeholder="Escribe para buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <div className="grid grid-cols-12 gap-4">
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
                <SelectItem value="en desarrollo">En desarrollo</SelectItem>
                <SelectItem value="en revision">En revisión</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-6">
            <label className="text-sm font-medium truncate block">Pago</label>
            <Select
              value={currentFilters.pagado}
              onValueChange={onPagadoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Pagado</SelectItem>
                <SelectItem value="false">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
