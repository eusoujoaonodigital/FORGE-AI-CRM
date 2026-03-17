import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">
          FORGE AI CRM
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          O sistema de temas Dark/Light agora está ativo!
        </p>
      </div>
    </main>
  );
}