/**
 * Configuración de NextAuth.js (Auth.js v5)
 * 
 * Este archivo configura NextAuth para autenticación con credenciales
 * (email y contraseña encriptada con bcrypt).
 * 
 * Arquitectura:
 * - Autenticación: Credenciales (email + password)
 * - Sesiones: JWT (no requiere tabla Session en BD)
 * - Encriptación: bcrypt con 10 rounds
 * - CSRF: Protección automática integrada
 * - Rate Limiting: Protección contra ataques de fuerza bruta (en middleware)
 * 
 * Documentación: https://authjs.dev/getting-started/installation?framework=nextjs
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { validateLoginCredentials } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { env } from "@/lib/env"

/**
 * Configuración de NextAuth
 * 
 * NOTA: No usamos PrismaAdapter porque:
 * - Usamos JWT para sesiones (no necesitamos tabla Session)
 * - Solo usamos credenciales (no necesitamos tabla Account)
 * - Esto hace el sistema más simple, seguro y eficiente
 * 
 * @returns {Object} handlers, auth, signIn, signOut
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  
  // Proveedores de autenticación
  providers: [
    // Proveedor de Credenciales (email + contraseña)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      /**
       * Función que valida las credenciales del usuario
       * 
       * @param credentials - Email y contraseña del usuario
       * @returns Usuario si las credenciales son válidas, null si no
       * 
       * Seguridad:
       * - No expone información sobre si el email existe o no
       * - Usa timing-safe comparison para contraseñas
       * - Valida formato de email antes de consultar BD
       * - Rate limiting manejado en middleware
       */
      async authorize(credentials) {
        // Validar que se enviaron email y contraseña
        if (!credentials?.email || !credentials?.password) {
          logger.debug('Intento de login sin credenciales completas')
          return null
        }

        try {
          // Validar y parsear credenciales con Zod
          const { email, password } = validateLoginCredentials({
            email: credentials.email,
            password: credentials.password,
          })

          // Buscar usuario en la base de datos por email
          // Usar select específico para optimizar la query
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true, // Necesario para comparar
            }
          })

          // Si no existe el usuario, retornar null (sin exponer que no existe)
          // Esto previene user enumeration attacks
          if (!user) {
            logger.debug('Intento de login con email no existente', { email: email.substring(0, 3) + '***' })
            return null
          }

          // Comparar la contraseña ingresada con la contraseña encriptada en la BD
          // bcrypt.compare es timing-safe por defecto
          const isPasswordValid = await bcrypt.compare(password, user.password)

          // Si la contraseña no coincide, retornar null
          if (!isPasswordValid) {
            logger.warn('Intento de login con contraseña incorrecta', { userId: user.id })
            return null
          }

          // Login exitoso
          logger.info('Login exitoso', { userId: user.id, email: user.email })
          
          // Retornar el usuario (sin la contraseña)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          // Si es error de validación de Zod, no loggear como error
          if (error instanceof Error && error.name === 'ZodError') {
            logger.debug('Validación de credenciales falló', { error: error.message })
            return null
          }

          // En caso de error de BD u otro error, loggear pero no exponer detalles
          const emailForLog = 
            credentials?.email && typeof credentials.email === 'string'
              ? credentials.email.substring(0, 3) + '***'
              : 'unknown'
          logger.error('Error en authorize', error, {
            email: emailForLog,
          })
          return null
        }
      }
    })
  ],

  // Configuración de sesión
  session: {
    strategy: "jwt", // Usar JWT para sesiones (más simple que database sessions)
    maxAge: 30 * 24 * 60 * 60, // 30 días (en segundos)
  },

  // Páginas personalizadas
  pages: {
    signIn: "/admin/login", // Ruta de login personalizada
  },

  // Callbacks para personalizar el token y la sesión
  callbacks: {
    /**
     * Callback que se ejecuta cuando se crea/actualiza el JWT
     * 
     * Se ejecuta:
     * - Cuando el usuario inicia sesión
     * - Cada vez que se accede a la sesión (para refrescar si es necesario)
     * 
     * @param token - Token JWT actual
     * @param user - Usuario autenticado (solo en el primer login)
     * @returns Token JWT actualizado
     */
    async jwt({ token, user }) {
      // Si es la primera vez que se crea el token, agregar info del usuario
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    /**
     * Callback que se ejecuta cuando se lee la sesión
     * 
     * Se ejecuta cada vez que se accede a la sesión desde el cliente o servidor.
     * Aquí podemos personalizar qué información se expone en la sesión.
     * 
     * @param session - Sesión actual
     * @param token - Token JWT con información del usuario
     * @returns Sesión personalizada
     */
    async session({ session, token }) {
      // Agregar información del token a la sesión
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },

  // Configuración de seguridad
  secret: env.AUTH_SECRET, // Secret para firmar los JWT (validado con Zod)
  
  // Configuración adicional de seguridad
  trustHost: true, // Necesario para algunos entornos de producción
})

