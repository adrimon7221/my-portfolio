/**
 * Ruta de NextAuth.js (Auth.js v5)
 * 
 * Esta ruta maneja todas las peticiones de autenticación:
 * - POST /api/auth/signin - Iniciar sesión
 * - POST /api/auth/signout - Cerrar sesión
 * - GET /api/auth/session - Obtener sesión actual
 * - GET /api/auth/csrf - Obtener token CSRF
 * 
 * El patrón [...nextauth] captura todas las rutas bajo /api/auth/*
 */

import { handlers } from "@/lib/auth"

// Exportar los handlers de NextAuth
// GET y POST son manejados automáticamente por NextAuth
export const { GET, POST } = handlers

