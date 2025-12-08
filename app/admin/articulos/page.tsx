/**
 * Panel Administrativo - Artículos
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { ArticlesManager } from "../articles/components/ArticlesManager"

export default async function ArticulosPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <ArticlesManager />
      </div>
    </AdminLayout>
  )
}

