/**
 * Panel Administrativo - Experiencia
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"

export default async function ExperienciaPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-yellow-800 rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-white">
            Experiencia
          </h1>
        </div>
        <div className="bg-red-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Experiencias Laborales</h2>
        </div>
        <div className="bg-blue-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Agregar Experiencia</h2>
        </div>
      </div>
    </AdminLayout>
  )
}

