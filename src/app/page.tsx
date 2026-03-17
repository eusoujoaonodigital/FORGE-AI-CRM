import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-slate-950 transition-colors duration-500 text-slate-900 dark:text-white">
      {/* BOTÃO FIXO NO TOPO DIREITO */}
      <div className="fixed right-6 top-6 z-[100]">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black tracking-tighter">
          FORGE AI <span className="text-blue-600">CRM</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          O sistema de temas Dark/Light agora está ativo e configurado.
        </p>
        
        <div className="pt-8">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
            Começar Agora
          </button>
        </div>
      </div>
    </main>
  );
}