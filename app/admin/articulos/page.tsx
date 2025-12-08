/**
 * Panel Administrativo - Artículos
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"

export default async function ArticulosPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#3D3D3D] rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-semibold text-white">
            Artículos
          </h1>
        </div>
        <div className="bg-[#3D3D3D] rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white">Lista de Artículos</h2>
        </div>
        <div className="bg-[#3D3D3D] rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white">Crear Artículo</h2>
        </div>
      </div>
    </AdminLayout>
  )
}

