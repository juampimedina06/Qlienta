"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { updatePassword } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ✅ Schema con validación cruzada
const formSchema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const UpdatePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const valorRuta = () => {
    switch (user?.role) {
      case "admin":
        return "/admin/profile";
      case "cliente":
        return "/cliente/profile";
      case "empleado":
        return "/empleado/profile";
      default:
        return "/";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const res = await updatePassword(data);

      if (res.success) {
        toast.success("Contraseña actualizada exitosamente", {
          duration: 3000,
        });

        router.push("/");
      } else {
        toast.error(res.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm backdrop-blur-xl bg-background py-6 rounded-4xl lg:border lg:border-white/50">
      <div className="px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold my-4">Nueva Contraseña</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          {/* Password */}
          <div>
            <label className="text-sm">Nueva Contraseña</label>
            <Input
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm">Confirmar Contraseña</label>
            <Input
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Actualizar Contraseña
          </Button>

          {/* Volver */}
          <Link
            href={valorRuta()}
            className="block text-center text-sm mt-3 underline"
          >
            Volver
          </Link>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
