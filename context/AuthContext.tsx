"use client";

import { getUser } from "@/actions/auth/get-user";
import { User } from "@/interface/user";
import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Memorizamos el cliente para evitar recrearlo
  const supabase = useMemo(() => createClient(), []);

  const getUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Al iniciar sesión o refrescar, traemos los datos frescos
        await getUserData();
        if (event === "SIGNED_IN") {
          router.refresh();
        }
      } else {
        // CRÍTICO: Limpieza total inmediata si no hay sesión
        setUser(null);
        setIsLoading(false);
        if (event === "SIGNED_OUT") {
          router.refresh();
          router.push("/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, getUserData, supabase]);

  return (
    <AuthContext.Provider value={{ user, isLoading, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
