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
  onUserCreated?: (userId: string) => void;
}

interface AuthModalProps {
  type: "sign-in" | "recover-password" | "sign-up";
  onUserCreated?: (userId: string) => void;
}

const AuthForm = ({ type, onUserCreated }: AuthModalProps) => {
  const [typeSelected, setTypeSelected] = useState<
    "sign-in" | "recover-password" | "sign-up"
  >(type);

  return (
    <div className="mx-auto w-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 p-8 rounded-2xl">
      {typeSelected === "sign-in" && (
        <SignInForm setTypeSelected={setTypeSelected} />
      )}
      {typeSelected === "sign-up" && (
        <SignUpForm
          setTypeSelected={setTypeSelected}
          onUserCreated={onUserCreated}
        />
      )}
      {typeSelected === "recover-password" && (
        <RecoverPasswordForm setTypeSelected={setTypeSelected} />
      )}
    </div>
  );
};

export default AuthForm;
