"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CircleUserRound, Loader2, LoaderCircle, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import PhoneInput from "./PhoneInput";
import { getImagenUrl } from "@/lib/utils";
import { updatePerfil } from "@/actions/auth/update-perfil";
import { updateAvatar } from "@/actions/auth/update-avatar";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email().optional().or(z.string().length(0)),
  avatar_url: z.string().nullable().optional(),
  phone: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountForm({
  user,
  onSuccess,
}: {
  user: any;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatar_url || null,
  );
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar_url: user?.avatar_url || null,
      phone: user?.phone || "",
      country_code: user?.country_code || null,
    },
  });

  // Watch para el phone input manual
  const phoneValue = watch("phone");
  const countryCodeValue = watch("country_code");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        avatar_url: user.avatar_url || null,
        phone: user.phone || "",
        country_code: user.country_code || null,
      });
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user, reset]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      setLoading(true);

      console.log("values a subir", values);

      const res = await updatePerfil({
        id: user.id,
        name: values.name,
        phone: values.phone,
        country_code: values.country_code,
      });

      console.log("res", res);

      toast.success("Perfil actualizado con éxito");

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Hubo un error al actualizar el perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const chooseImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato no válido. Use JPG, PNG o WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es muy grande. Máximo 5MB.");
      return;
    }

    setIsLoadingImage(true);
    try {
      // Lógica de subida aquí

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await updateAvatar(formData);
      if (response.publicUrl) {
        setAvatarUrl(response.publicUrl);
        toast.success("Avatar actualizado con éxito");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Body exceeded 1 MB limit")) {
          toast.error("La imagen es muy grande. Máximo 1MB.");
        } else {
          toast.error("Hubo un error al actualizar la imagen.");
        }
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    } finally {
      setIsLoadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección del Avatar */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        {isLoadingImage ? (
          <div className="flex justify-center items-center w-full h-full">
            <LoaderCircle className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full  overflow-hidden border-2 border-gray-200">
              {avatarUrl ? (
                <Image
                  className="object-cover w-full h-full"
                  src={getImagenUrl(avatarUrl)}
                  width={100}
                  height={100}
                  alt="user-img"
                  onError={() => setAvatarUrl(null)}
                />
              ) : (
                <CircleUserRound className="w-full h-full text-gray-400" />
              )}
            </div>
            <label
              htmlFor="files"
              className="absolute -bottom-1 -right-1 w-8 h-8 cursor-pointer rounded-full bg-primary text-white flex justify-center items-center shadow-lg hover:bg-primary/90 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <input
                id="files"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={chooseImage}
                disabled={isLoadingImage}
              />
            </label>
          </>
        )}
      </div>

      {/* Formulario Nativo con React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo Email (Read Only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            disabled
            className="bg-transparent text-muted-foreground"
          />
        </div>

        {/* Campo Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input id="name" placeholder="Tu nombre" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Campo Teléfono (Controlado manualmente) */}

        <div className="space-y-2">
          <Label htmlFor="phone">Número de Teléfono</Label>
          <PhoneInput
            defaultCountryCode={countryCodeValue || "VE"}
            value={phoneValue || ""}
            onChange={(val) => setValue("phone", val)}
            onCountryChange={(country) =>
              setValue("country_code", country.code)
            }
            placeholder="Número de teléfono"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Actualizar Perfil"
          )}
        </Button>
      </form>
    </div>
  );
}
