import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Botão de Toggle no topo direito */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Seu código de formulário de login existente aqui... */}
      <main>
         {/* ... conteúdo do login ... */}
      </main>
    </div>
  );
}