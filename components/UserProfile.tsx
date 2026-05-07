"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Key, LogOut, Mail, Phone, User } from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AccountForm from "./AccountForm";
import { getImagenUrl } from "@/lib/utils";

// Función para obtener las iniciales del nombre
export const getInitials = (name: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export interface UserProfileData {
  id: string;
  updated_at: string | null;
  created_at: string | null;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone?: string | null;
}

interface UserProfileProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onEditProfile,
  onChangePassword,
  onLogout,
  className = "",
}) => {
  const { user, isLoading, getUserData } = useAuth();
  const profile = user as UserProfileData | null;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    if (onEditProfile) onEditProfile();
  };

  if (isLoading) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <CardTitle className="text-xl">Perfil no encontrado</CardTitle>
          <CardDescription>
            No se pudo cargar la información del perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              El perfil de usuario no está disponible en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className={`w-full max-w-md ${className} glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-blue-500/5`}>
        <div className="space-y-8">
          {/* Información del usuario */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 blur-md animate-pulse" />
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                {profile.avatar_url ? (
                  <Image
                    src={getImagenUrl(profile.avatar_url)}
                    alt={profile.name || "Usuario"}
                    className="object-cover rounded-full"
                    width={1000}
                    height={1000}
                  />
                ) : (
                  <AvatarFallback className="text-2xl font-black bg-blue-600 text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight text-stone-900">
                {profile.name || "Usuario sin nombre"}
              </h3>
              <div className="flex flex-col items-center gap-1.5 text-stone-500">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-3.5 w-3.5 text-blue-500" />
                  <span>{profile.email || "Sin email"}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Phone className="h-3.5 w-3.5 text-stone-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones del perfil */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1">
               <span className="h-[1px] flex-1 bg-stone-100" />
               <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
                 Gestión de Cuenta
               </h4>
               <span className="h-[1px] flex-1 bg-stone-100" />
            </div>

            <div className="grid gap-3">
              <button
                className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-100 transition-all hover:ring-blue-200 hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.98]"
                onClick={handleEditClick}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Edit size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-black text-stone-900">Editar Perfil</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">Nombre y Avatar</div>
                </div>
              </button>

              <Link href="/update-password" intermediate-link="true" className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-100 transition-all hover:ring-purple-200 hover:shadow-lg hover:shadow-purple-500/5 active:scale-[0.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <Key size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-black text-stone-900">Seguridad</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">Cambiar Contraseña</div>
                </div>
              </Link>
              
              <form action="/api/auth/signout" method="post">
                <button
                  className="group flex w-full items-center gap-4 rounded-2xl bg-rose-50/30 p-4 ring-1 ring-rose-100 transition-all hover:bg-rose-50 hover:ring-rose-200 active:scale-[0.98]"
                  onClick={onLogout}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                    <LogOut size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-black text-stone-900">Cerrar Sesión</div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">Salir de la cuenta</div>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Realiza cambios en tu perfil aqui. Haz clic en guardar para
              guardar los cambios.
            </DialogDescription>
          </DialogHeader>
          <AccountForm
            user={profile}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              getUserData();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
