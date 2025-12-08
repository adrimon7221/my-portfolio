/**
 * Panel Administrativo - Sobre Mí
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { AboutMeManager } from "./components/AboutMeManager"

export default async function AboutMePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <AboutMeManager />
      </div>
    </AdminLayout>
  )
}
