/**
 * Página de Login - Administración
 * 
 * Página de login mejorada para el panel administrativo con:
 * - Componentes shadcn/ui
 * - Validación en frontend
 * - Mejor UX y accesibilidad
 * - Diseño escalable y mantenible
 * - Modo oscuro por defecto
 */

import { LoginForm } from "./components/LoginForm"
import { DarkModeWrapper } from "./components/DarkModeWrapper"

export default function LoginPage() {
  return (
    <DarkModeWrapper>
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </DarkModeWrapper>
  )
}

