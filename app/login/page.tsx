"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import React from "react"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Botão de Tema no Topo */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FORGE AI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Faça login para acessar o CRM</p>
        </div>

        {/* ESPAÇO PARA O SEU FORMULÁRIO DE LOGIN ATUAL */}
        <form className="space-y-4">
           {/* Seus inputs aqui */}
        </form>
      </main>
    </div>
  )
}