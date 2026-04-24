import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <section className="flex items-center justify-center min-h-screen">
      <AuthForm type="sign-in" />
    </section>
  );
}
