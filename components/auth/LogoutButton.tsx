import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action="/api/auth/signout" method="post">
      <Button
        variant="outline"
        className="w-full justify-start h-14 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
      >
        <LogOut className="mr-3 h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">Cerrar sesión</div>
          <div className="text-xs text-muted-foreground">
            Salir de tu cuenta actual
          </div>
        </div>
      </Button>
    </form>
  );
}
