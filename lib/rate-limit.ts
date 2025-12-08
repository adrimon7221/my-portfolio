/**
 * Rate Limiting Simple
 * 
 * Sistema de rate limiting en memoria para proteger endpoints.
 * Limita el número de intentos por IP en un período de tiempo.
 * 
 * NOTA: Para producción con múltiples instancias, considera usar Redis.
 * 
 * Documentación: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// Almacenamiento en memoria (se limpia al reiniciar el servidor)
const store: RateLimitStore = {}

// Limpiar entradas expiradas cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  /**
   * Número máximo de intentos permitidos
   */
  maxAttempts: number
  /**
   * Ventana de tiempo en milisegundos
   */
  windowMs: number
  /**
   * Mensaje de error personalizado
   */
  message?: string
}

/**
 * Verifica si una IP ha excedido el límite de intentos
 * 
 * @param identifier - Identificador único (IP, email, etc.)
 * @param options - Opciones de rate limiting
 * @returns true si está dentro del límite, false si lo excedió
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = store[identifier]

  // Si no existe entrada o expiró, crear nueva
  if (!entry || entry.resetTime < now) {
    store[identifier] = {
      count: 1,
      resetTime: now + options.windowMs,
    }
    return {
      allowed: true,
      remaining: options.maxAttempts - 1,
      resetTime: now + options.windowMs,
    }
  }

  // Si existe y no expiró, incrementar contador
  entry.count++

  // Verificar si excedió el límite
  if (entry.count > options.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  return {
    allowed: true,
    remaining: options.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Obtiene la IP del request
 * 
 * @param headers - Headers del request
 * @returns IP del cliente
 */
export function getClientIP(headers: Headers): string {
  // Intentar obtener IP de headers comunes de proxy/load balancer
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback a 'unknown' si no se puede determinar
  return 'unknown'
}

