import React from "react";
import { getFuturosClientes } from "@/actions/futuros-clientes/get-futuro-cliente";
import Link from "next/link";
import { ArrowRight, Users, UserPlus, Building2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

export default async function AdminPage() {
  const { data: recentProspects, count: totalProspects } =
    await getFuturosClientes({
      page: 0,
      limit: 5,
    });

  const stats = [
    {
      title: "Total Prospectos",
      value: totalProspects || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Nuevos Hoy",
      value:
        recentProspects?.filter((p) => {
          const today = new Date().toISOString().split("T")[0];
          return p.created_at.startsWith(today);
        }).length || 0,
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 w-full ">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control de Codiarg.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex w-full justify-between gap-4 md:flex-row flex-col">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-white/5 w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white/70">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="">
        {/* Recent Prospects */}
        <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="text-indigo-400" size={20} />
              Prospectos Recientes
            </CardTitle>
            <Link
              href="/admin/futurosClientes"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProspects && recentProspects.length > 0 ? (
                recentProspects.map((prospect) => (
                  <div
                    key={prospect.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        {prospect.logo_negocio ? (
                          <Image
                            width={40}
                            height={40}
                            src={prospect.logo_negocio}
                            alt={prospect.nombre_negocio}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Building2 className="text-indigo-400" size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                          {prospect.nombre_negocio}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {prospect.nombre_contacto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase border-white/10 bg-white/5 text-white/70"
                      >
                        {prospect.estado}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {format(new Date(prospect.created_at), "d MMM", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground italic">
                  No hay prospectos recientes.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
