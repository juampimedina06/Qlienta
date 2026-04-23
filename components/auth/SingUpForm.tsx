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

const SignUpForm = ({ setTypeSelected }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="w-full backdrop-blur-xl rounded-4xl pb-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold my-4">Registrar Cliente</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-4 space-y-4 ">
        {/* Name */}
        <div>
          <label className="text-sm">Nombre</label>
          <Input
            placeholder="Juan"
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <Input
            type="password"
            placeholder="*****"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
