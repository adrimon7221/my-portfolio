"use client"

/**
 * Formulario de Login
 * 
 * Componente simple de login sin shadcn/ui:
 * - Validación en frontend con Zod
 * - Manejo de errores mejorado
 * - Estados de carga
 * - Card con borde blanco
 */

import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { loginCredentialsSchema } from "@/lib/validations"

// Schema de validación para el formulario
const formSchema = loginCredentialsSchema

type FormData = z.infer<typeof formSchema>

interface LoginFormProps {
  defaultEmail?: string
  onSuccess?: () => void
}

export function LoginForm({ defaultEmail = "", onSuccess }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Validar campos individuales en tiempo real
  const validateField = (field: keyof FormData, value: string) => {
    try {
      if (field === "email") {
        formSchema.shape.email.parse(value)
      } else if (field === "password") {
        formSchema.shape.password.parse(value)
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: err.issues[0]?.message,
        }))
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setErrors({})

    // Validar todo el formulario
    const result = formSchema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData
        if (field) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const signInResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
      } else if (signInResult?.ok) {
        // Login exitoso
        onSuccess?.()
        router.push("/admin")
        router.refresh()
      } else {
        setError("Error inesperado al iniciar sesión. Por favor, intenta de nuevo.")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md border border-white/20 rounded-2xl p-8 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Panel Administrativo
          </h1>
          <p className="text-white/80 text-sm">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error general */}
          {error && (
            <div className="border border-white/30 text-white px-4 py-3 rounded-xl">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Campo Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  validateField("email", e.target.value)
                }
              }}
              onBlur={(e) => validateField("email", e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border-2 ${
                errors.email 
                  ? "border-white/50" 
                  : "border-white/30 bg-white/10"
              } text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-colors`}
              disabled={loading}
              required
            />
            {errors.email && (
              <p className="text-sm text-white/80">{errors.email}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-white">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="tu contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) {
                  validateField("password", e.target.value)
                }
              }}
              onBlur={(e) => validateField("password", e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border-2 ${
                errors.password 
                  ? "border-white/50" 
                  : "border-white/30 bg-white/10"
              } text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-colors`}
              disabled={loading}
              required
            />
            {errors.password && (
              <p className="text-sm text-white/80">{errors.password}</p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded-xl border border-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Información de credenciales por defecto (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-center text-xs text-white/70 space-y-1 pt-4 border-t border-white/20">
            <p className="font-semibold">Credenciales por defecto:</p>
            <p>Email: admin@portfolio.com</p>
            <p>Contraseña: admin123</p>
          </div>
        )}
      </div>
    </div>
  )
}

