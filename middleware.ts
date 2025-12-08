/**
 * Middleware de Next.js
 * 
 * Se ejecuta antes de cada request. Aquí podemos:
 * - Proteger rutas con autenticación
 * - Aplicar rate limiting
 * - Agregar headers de seguridad
 * - Redirigir requests
 * 
 * Documentación: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

/**
 * Rutas que requieren autenticación
 */
const protectedRoutes = ['/admin']

/**
 * Rutas de API que requieren autenticación
 */
const protectedApiRoutes = ['/api/admin']

/**
 * Verifica si una ruta requiere autenticación
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route)) && pathname !== '/admin/login'
}

/**
 * Verifica si una ruta de API requiere autenticación
 */
function isProtectedApiRoute(pathname: string): boolean {
  return protectedApiRoutes.some((route) => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request.headers)

  // Rate limiting SOLO para intentos de login (POST), no para cargar la página (GET)
  // Aplicar rate limiting solo a POST requests de autenticación
  if (
    (pathname.startsWith('/api/auth/signin') && request.method === 'POST') ||
    (pathname.startsWith('/api/auth/callback/credentials') && request.method === 'POST')
  ) {
    const rateLimit = checkRateLimit(ip, {
      maxAttempts: 5, // 5 intentos
      windowMs: 15 * 60 * 1000, // 15 minutos
    })

    if (!rateLimit.allowed) {
      logger.warn('Rate limit excedido', { ip, pathname, method: request.method })
      return NextResponse.json(
        {
          error: 'Demasiados intentos. Por favor, intenta de nuevo en unos minutos.',
        },
        { status: 429 }
      )
    }
  }

  // Proteger rutas de admin
  if (isProtectedRoute(pathname)) {
    try {
      const session = await auth()

      if (!session?.user) {
        logger.info('Acceso no autorizado a ruta protegida', { ip, pathname })
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      logger.error('Error verificando autenticación en middleware', error, { pathname })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Proteger rutas de API de admin
  if (isProtectedApiRoute(pathname)) {
    try {
      const session = await auth()

      if (!session?.user) {
        logger.warn('Acceso no autorizado a API protegida', { ip, pathname })
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
    } catch (error) {
      logger.error('Error verificando autenticación en API', error, { pathname })
      return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 })
    }
  }

  // Headers de seguridad
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Solo en producción, agregar CSP y HSTS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

/**
 * Configuración de matcher para optimizar qué rutas ejecutan el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

