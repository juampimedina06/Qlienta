import Link from "next/link"; // ¡EL CORRECTO!
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth/get-user";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.role !== "admin") redirect("/login");

  return (
    <section className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-6 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <ul className="flex gap-8 font-medium">
            <li>
              <Link href="/admin" className="hover:text-gray-400 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/clientes"
                className="hover:text-gray-400 transition"
              >
                Clientes
              </Link>
            </li>
            <li>
              <Link
                href="/admin/registrarCliente"
                className="hover:text-gray-400 transition"
              >
                Nuevo Cliente
              </Link>
            </li>
          </ul>
          <LogoutButton />
        </nav>
      </header>

      <main className="flex-1 container mx-auto py-8">{children}</main>
    </section>
  );
}
