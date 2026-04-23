import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth/get-user";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.role !== "cliente") redirect("/login");

  return <>{children}</>;
}
