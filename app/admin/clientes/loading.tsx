import LoadingAnimado from "@/components/LoadingAnimado";
import React from "react";

export default function loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingAnimado />
    </div>
  );
}
