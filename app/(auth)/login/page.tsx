import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video_login.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-purple-950/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Qlienta
          </h2>
          <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">
            Gestión de Clientes
          </p>
        </div>

        <AuthForm type="sign-in" />

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-8">
          © {new Date().getFullYear()} Qlienta · Todos los derechos reservados
        </p>
      </div>
    </section>
  );
}
