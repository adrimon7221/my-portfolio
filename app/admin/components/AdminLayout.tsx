/**
 * Layout del Panel Administrativo
 * 
 * Layout compartido que incluye el sidebar y el área de contenido
 */

import { Sidebar } from "./Sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <div className="w-64 bg-[#1a1a1a] fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8 bg-[#121212]">
        {children}
      </main>
    </div>
  )
}

