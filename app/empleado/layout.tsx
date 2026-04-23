// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth/get-user";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";

export default async function EmpleadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.role !== "empleado") redirect("/login");

  return (
    <section className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-6 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <ul className="flex gap-8 font-medium">
            <li>
              <Link href="/empleado" className="hover:text-gray-400 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/empleado/cargar"
                className="hover:text-gray-400 transition"
              >
                Cargar Cliente
              </Link>
            </li>
            <li>
              <Link
                href="/empleado/listado"
                className="hover:text-gray-400 transition"
              >
                Listado Clientes
              </Link>
            </li>
          </ul>
          <LogoutButton />
          <Link href="/empleado/profile">
            <AvatarBadge
              name={user.name || "Usuario"}
              avatar_url={getImagenUrl(user.avatar_url || "")}
            />
          </Link>
        </nav>
      </header>
      <main className="flex-1 container mx-auto py-8">{children}</main>
    </section>
  );
}
