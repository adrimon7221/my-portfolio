/**
 * Panel Administrativo - Tecnologías
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { TechnologiesManager } from "../technologies/components/TechnologiesManager"

export default async function TecnologiasPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <TechnologiesManager />
      </div>
    </AdminLayout>
  )
}

