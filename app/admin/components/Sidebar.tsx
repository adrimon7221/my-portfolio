"use client"

/**
 * Sidebar del Panel Administrativo
 * 
 * Navegación lateral con las diferentes secciones del CRUD
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  User, 
  Briefcase, 
  Link2,
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "bg-blue-800" },
  { name: "Proyectos", href: "/admin/proyectos", icon: FolderKanban, color: "bg-red-800" },
  { name: "Artículos", href: "/admin/articulos", icon: FileText, color: "bg-green-900" },
  { name: "Sobre Mí", href: "/admin/about", icon: User, color: "bg-purple-800" },
  { name: "Experiencia", href: "/admin/experiencia", icon: Briefcase, color: "bg-yellow-800" },
  { name: "Enlaces Sociales", href: "/admin/social", icon: Link2, color: "bg-pink-800" },
  { name: "Tecnologías", href: "/admin/tecnologias", icon: Settings, color: "bg-indigo-800" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-white/10 bg-blue-800">
        <h2 className="text-xl font-semibold text-white">Panel Admin</h2>
        <p className="text-sm text-white/60 mt-1">Gestión de contenido</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#1a1a1a]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? `${item.color} text-white shadow-lg` 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-white/10 bg-green-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

