"use client";

import { getUser } from "@/actions/auth/get-user";
import { User } from "@/interface/user";
import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
}

//este contexto sirve para poder acceder al usuario en cualquier parte de la aplicacion
// sin necesidad de pasarlo como props. osea una vez iniciado sesion el usuario se guarda en este contexto
// y se puede acceder a el en cualquier parte de la aplicacion
// para usarlo en cualquier componente usamos
// const { user, loading, getUserData } = useContext(AuthContext);
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authState = async () => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event, session) => {
      const eventTypes = [
        "INITIAL_SESSION",
        "USER_UPDATED",
        "TOKEN_REFRESHED",
        "PASSWORD_RECOVERY",
        "SIGNED_OUT",
      ];

      if (eventTypes.includes(event)) {
        if (session) {
          getUserData();
        } else {
          setUser(null);
        }
      }
    });
  };

  useEffect(() => {
    authState();
  }, []);

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
