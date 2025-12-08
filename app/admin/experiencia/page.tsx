/**
 * Panel Administrativo - Experiencia Laboral
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { WorkExperienceManager } from "../work-experience/components/WorkExperienceManager"

export default async function ExperienciaPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <WorkExperienceManager />
      </div>
    </AdminLayout>
  )
}
