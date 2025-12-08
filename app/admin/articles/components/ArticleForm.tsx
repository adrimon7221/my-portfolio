/**
 * Componente de formulario para crear/editar artículos
 * 
 * Componente reutilizable que encapsula la lógica del formulario
 */

"use client"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadButton } from "./ImageUploadButton"
import type { ArticleFormData, ArticleFieldErrors } from "../types/article.types"

interface ArticleFormProps {
  formData: ArticleFormData
  fieldErrors: ArticleFieldErrors
  onFormDataChange: (data: ArticleFormData) => void
  isSaving: boolean
}

/**
 * Componente de formulario para crear/editar artículos
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const ArticleForm = memo(function ArticleForm({ 
  formData, 
  fieldErrors, 
  onFormDataChange,
  isSaving
}: ArticleFormProps) {
  const handleChange = useCallback((field: keyof ArticleFormData, value: string | number | boolean) => {
    onFormDataChange({ ...formData, [field]: value })
  }, [formData, onFormDataChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-title" className="text-white font-semibold">
          Título *
        </Label>
        <Input
          id="modal-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Título del artículo"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.title}
          disabled={isSaving}
        />
        {fieldErrors.title && (
          <p className="text-sm text-destructive">{fieldErrors.title}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-description" className="text-white font-semibold">
          Descripción *
        </Label>
        <Textarea
          id="modal-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descripción del artículo"
          className="bg-white/10 border-white/30 text-white placeholder-white/50 min-h-[100px]"
          aria-invalid={!!fieldErrors.description}
          disabled={isSaving}
        />
        {fieldErrors.description && (
          <p className="text-sm text-destructive">{fieldErrors.description}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-url" className="text-white font-semibold">
          URL *
        </Label>
        <Input
          id="modal-url"
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://medium.com/@username/article"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.url}
          disabled={isSaving}
        />
        {fieldErrors.url && (
          <p className="text-sm text-destructive">{fieldErrors.url}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-image" className="text-white font-semibold">
          Imagen
        </Label>
        <ImageUploadButton
          onImageUploaded={(imageUrl) => handleChange('image', imageUrl)}
          currentImageUrl={formData.image}
          disabled={isSaving}
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Vista previa"
              className="w-full h-auto max-h-48 object-contain rounded-lg border border-white/10"
              onError={(e) => {
                // Si la imagen no se puede cargar, ocultar el error
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        {fieldErrors.image && (
          <p className="text-sm text-destructive">{fieldErrors.image}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-order" className="text-white font-semibold">
          Orden
        </Label>
        <Input
          id="modal-order"
          type="number"
          value={formData.order}
          onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
          min="0"
          placeholder="Orden"
          className="bg-white/10 border-white/30 text-white placeholder-white/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          aria-invalid={!!fieldErrors.order}
          disabled={isSaving}
        />
        {fieldErrors.order && (
          <p className="text-sm text-destructive">{fieldErrors.order}</p>
        )}
      </div>

      <div className="md:col-span-2 flex flex-col space-y-3">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Switch
            id="modal-active"
            checked={formData.active}
            onCheckedChange={(checked) => handleChange('active', checked)}
            disabled={isSaving}
          />
          <Label htmlFor="modal-active" className="text-white font-semibold cursor-pointer">
            Artículo activo
          </Label>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer">
          <Switch
            id="modal-featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleChange('featured', checked)}
            disabled={isSaving}
          />
          <Label htmlFor="modal-featured" className="text-white font-semibold cursor-pointer">
            Destacado (aparece en carrusel)
          </Label>
        </div>
      </div>
    </div>
  )
})

