/**
 * Componente para subir imágenes de artículos
 * 
 * Permite seleccionar y subir imágenes JPG/PNG
 * Guarda las imágenes en public/images/articles/
 */

"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadButtonProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
  disabled?: boolean
}

export function ImageUploadButton({ 
  onImageUploaded, 
  currentImageUrl,
  disabled = false 
}: ImageUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten archivos JPG y PNG")
      return
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. Máximo 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)
      
      // Incluir la imagen anterior si existe para eliminarla
      if (currentImageUrl && currentImageUrl.startsWith('/images/articles/')) {
        formData.append("previousImageUrl", currentImageUrl)
      }

      // Subir imagen
      const response = await fetch("/api/admin/articles/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al subir la imagen")
      }

      const data = await response.json()
      
      // Llamar al callback con la URL de la imagen
      onImageUploaded(data.imageUrl)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido al subir la imagen"
      setError(message)
      console.error("Error subiendo imagen:", err)
    } finally {
      setUploading(false)
      // Resetear el input para permitir seleccionar el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [onImageUploaded])

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled || uploading}
        className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {currentImageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

