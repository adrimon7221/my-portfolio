/**
 * Panel Administrativo - Enlaces Sociales
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "../components/AdminLayout"
import { SocialLinksManager } from "./components/SocialLinksManager"

export default async function SocialPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <SocialLinksManager />
      </div>
    </AdminLayout>
  )
}

