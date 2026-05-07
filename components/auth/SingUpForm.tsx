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
import { signup } from "@/actions/admin/admin";

const formSchema = z.object({
  name: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const SignUpForm = ({ setTypeSelected, onUserCreated }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await signup(data);

      if (res.success) {
        toast.success(
          `El usuario ${data.name} fue agregado exitosamente, indícale que le llegara un mail a su correo para verificar su cuenta`,
          {
            duration: 3000,
            icon: "🎉",
          },
        );
        // Notify parent with the new user ID
        if (onUserCreated && res.data?.user?.id) {
          onUserCreated(res.data.user.id);
        }
        reset();
        setTypeSelected("sign-in");
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
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Registrar Usuario</h1>
        <p className="text-sm text-white/40 mt-1">
          Completa los datos para crear una cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/70">Nombre</label>
          <Input
            placeholder="Juan"
            disabled={isLoading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-white/10 h-11"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/70">Correo</label>
          <Input
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-white/10 h-11"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/70">Contraseña</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-white/10 h-11 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200"
        >
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
