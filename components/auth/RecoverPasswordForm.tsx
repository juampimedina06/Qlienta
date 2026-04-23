"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
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
    <div className="w-full backdrop-blur-xl py-6 rounded-4xl">
      <div className="px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold my-4">Recuperar Contraseña</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Te enviaremos un correo para recuperar tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Recuperar
          </Button>
        </form>

        {/* Volver */}
        <p className="text-center text-sm mt-4">
          <span
            onClick={() => setTypeSelected("sign-in")}
            className="underline cursor-pointer"
          >
            Volver
          </span>
        </p>
      </div>
    </div>
  );
};

export default RecoverPasswordForm;
