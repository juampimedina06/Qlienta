import AuthForm from "@/components/auth/AuthForm";
import React from "react";

export default function registrarCliente() {
  return (
    <div className="max-w-2xl mx-auto my-10">
      <AuthForm type="sign-up" />
    </div>
  );
}
