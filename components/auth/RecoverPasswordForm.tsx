"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { AuthFormProps } from "./AuthForm";
import { sendRecoveryEmail } from "@/actions/auth/auth";

// ✅ Schema correcto
const formSchema = z.object({
  email: z.string().email("Correo inválido"),
});

type FormData = z.infer<typeof formSchema>;

const RecoverPasswordForm = ({ setTypeSelected }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await sendRecoveryEmail(data);
      if (res.success) {
        toast.success(
          "Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.",
          { duration: 5000 },
        );
        setTypeSelected("sign-in");
      } else {
        toast.error(res.error || "Error al enviar el correo");
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
        <h1 className="text-2xl font-semibold text-white">Recuperar Contraseña</h1>
        <p className="text-sm text-white/40 mt-1">
          Te enviaremos un correo para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <p className="text-red-400 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200"
        >
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          Enviar enlace
        </Button>
      </form>

      {/* Volver */}
      <button
        onClick={() => setTypeSelected("sign-in")}
        className="flex items-center justify-center gap-2 w-full mt-4 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default RecoverPasswordForm;
