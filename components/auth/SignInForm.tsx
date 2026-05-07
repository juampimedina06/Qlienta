"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AuthFormProps } from "./AuthForm";
import { login } from "@/actions/auth/auth";

const formSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const SignInForm = ({ setTypeSelected }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await login(data);

      if (res.success) {
        toast.success("Inicio de sesion exitoso");

        const role = res.data?.role;
        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "empleado") {
          window.location.href = "/empleado";
        } else if (role === "cliente") {
          window.location.href = "/cliente";
        } else {
          toast.error(res.error || "Error al iniciar sesión");
        }
      } else {
        toast.error(res.error || "Error al iniciar sesión");
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
    <div className="w-full backdrop-blur-xl py-2 rounded-4xl">
      <div className="text-center">
        <h1 className="text-3xl font-semibold my-4">Iniciar Sesión</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Ingresa para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-4 space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm">Correo</label>
          <Input
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm">Contraseña</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="*****"
              disabled={isLoading}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Recover */}
        <div
          onClick={() => setTypeSelected("recover-password")}
          className="underline text-sm text-end cursor-pointer"
        >
          ¿Olvidaste tu contraseña?
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Ingresar
        </Button>
      </form>
    </div>
  );
};

export default SignInForm;
