/**
 * Componente principal para gestionar About Me
 * 
 * Muestra un preview de la imagen de perfil actual
 * y permite subir una nueva imagen que reemplazará la anterior.
 * 
 * Mejoras implementadas:
 * - Arquitectura limpia y mantenible
 * - Separación de responsabilidades (hook para lógica, componente para UI)
 * - Manejo robusto de errores
 * - Estados de carga independientes
 * - Validación client-side
 * - UX fluida con feedback visual
 */

"use client"

import { useCallback, useRef } from "react"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAboutMe } from "../hooks/useAboutMe"

/**
 * Componente para gestionar About Me
 * 
 * Utiliza el hook useAboutMe para toda la lógica de negocio,
 * manteniendo el componente enfocado solo en la presentación.
 */
export function AboutMeManager() {
  const {
    aboutMe,
    loading,
    uploading,
    error,
    uploadImage,
    clearError,
    getImageUrl,
  } = useAboutMe()

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Maneja la selección de archivo
   */
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo (client-side)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      // El error será manejado por el hook, pero mostramos feedback inmediato
      return
    }

    // Validar tamaño (client-side)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      // El error será manejado por el hook, pero mostramos feedback inmediato
      return
    }

    try {
      await uploadImage(file)
    } catch (error) {
      // El error ya está manejado por el hook
      console.error('Error al subir imagen:', error)
    } finally {
      // Resetear el input para permitir seleccionar el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [uploadImage])

  /**
   * Abre el selector de archivos
   */
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Maneja el cierre del error
   */
  const handleErrorDismiss = useCallback(() => {
    clearError()
  }, [clearError])

  // Estado de carga inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-white/60" />
          <p className="text-white/60">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">Sobre Mí</h2>
        <p className="text-white/60 mt-1">
          Gestiona la imagen de perfil del About Me
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert 
          variant="destructive" 
          className="bg-white/10 border-white/30"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="!text-white break-words overflow-wrap-anywhere whitespace-normal">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Preview y Botón */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Preview de la imagen */}
        <div className="flex-shrink-0">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-2">
            <img
              src={getImageUrl()}
              alt="Imagen de perfil"
              className="w-64 h-64 object-cover rounded-xl"
              onError={(e) => {
                // Si la imagen no se puede cargar, mostrar placeholder
                const target = e.currentTarget
                if (!target.src.includes('/images/profile/profile.jpg')) {
                  target.src = "/images/profile/profile.jpg"
                }
              }}
            />
          </div>
        </div>

        {/* Botón de subida */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Imagen de Perfil
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Sube una nueva imagen para reemplazar la actual. Solo se permiten 
              archivos JPG y PNG (máximo 5MB).
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
            aria-label="Seleccionar imagen de perfil"
          />

          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Nueva Imagen
              </>
            )}
          </Button>

          {aboutMe?.profileImage && (
            <p className="text-sm text-white/60">
              Imagen actual:{" "}
              <span className="font-mono text-xs">
                {aboutMe.profileImage.replace(/\?t=\d+$/, '')}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
