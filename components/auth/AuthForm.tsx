"use client";

import RecoverPasswordForm from "./RecoverPasswordForm";
import SignInForm from "./SignInForm";

import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import SignUpForm from "./SingUpForm";

export interface AuthFormProps {
  setTypeSelected: Dispatch<
    SetStateAction<"sign-in" | "recover-password" | "sign-up">
  >;
}

interface AuthModalProps {
  type: "sign-in" | "recover-password" | "sign-up";
}

const AuthForm = ({ type }: AuthModalProps) => {
  const [typeSelected, setTypeSelected] = useState<
    "sign-in" | "recover-password" | "sign-up"
  >(type);

  return (
    <div
      className="mx-auto bg-background max-w-lg lg:border lg:border-white/50 mt-10 lg:p-6"
      style={{ borderRadius: 20 }}
    >
      {typeSelected === "sign-in" && (
        <SignInForm setTypeSelected={setTypeSelected} />
      )}
      {typeSelected === "sign-up" && (
        <SignUpForm setTypeSelected={setTypeSelected} />
      )}
      {typeSelected === "recover-password" && (
        <RecoverPasswordForm setTypeSelected={setTypeSelected} />
      )}
    </div>
  );
};

export default AuthForm;
