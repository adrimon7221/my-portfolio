/**
 * Panel Administrativo - Proyectos
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { ProjectsManager } from "../projects/components/ProjectsManager"

export default async function ProyectosPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <ProjectsManager />
      </div>
    </AdminLayout>
  )
}
