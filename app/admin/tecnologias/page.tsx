/**
 * Panel Administrativo - Tecnologías
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"

export default async function TecnologiasPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-indigo-800 rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-white">
            Tecnologías
          </h1>
        </div>
        <div className="bg-purple-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Lista de Tecnologías</h2>
        </div>
        <div className="bg-red-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Agregar Tecnología</h2>
        </div>
      </div>
    </AdminLayout>
  )
}

