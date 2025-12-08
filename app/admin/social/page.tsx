/**
 * Panel Administrativo - Enlaces Sociales
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"

export default async function SocialPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-pink-800 rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-white">
            Enlaces Sociales
          </h1>
        </div>
        <div className="bg-green-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Redes Sociales</h2>
        </div>
        <div className="bg-yellow-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white">Gestionar Enlaces</h2>
        </div>
      </div>
    </AdminLayout>
  )
}

