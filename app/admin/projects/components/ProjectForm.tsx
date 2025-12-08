/**
 * Componente de formulario para crear/editar proyectos
 * 
 * Componente reutilizable que encapsula la lógica del formulario
 */

"use client"

import { memo, useCallback, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUploadButton } from "./ImageUploadButton"
import { getProjectImagesLimitByCollageType, COLLAGE_TYPE_LABELS } from "../constants/projects.constants"
import type { ProjectFormData, ProjectFieldErrors } from "../types/project.types"

interface ProjectFormProps {
  formData: ProjectFormData
  fieldErrors: ProjectFieldErrors
  onFormDataChange: (data: ProjectFormData) => void
  isSaving: boolean
  isEditMode?: boolean
  currentOrder?: number
}

/**
 * Componente de formulario para crear/editar proyectos
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const ProjectForm = memo(function ProjectForm({ 
  formData, 
  fieldErrors, 
  onFormDataChange,
  isSaving,
  isEditMode = false,
  currentOrder = 0
}: ProjectFormProps) {
  const [newTag, setNewTag] = useState('')

  // Calcular el límite de imágenes según el orden del proyecto
  const imagesLimit = useMemo(() => {
    return getProjectImagesLimitByCollageType(formData.collageType)
  }, [formData.collageType])

  const handleChange = useCallback((field: keyof ProjectFormData, value: string | number | boolean | string[]) => {
    onFormDataChange({ ...formData, [field]: value })
  }, [formData, onFormDataChange])

  const handleRemoveImage = useCallback((index: number) => {
    handleChange('images', formData.images.filter((_, i) => i !== index))
  }, [formData.images, handleChange])

  const handleAddImageFromUpload = useCallback((imageUrl: string) => {
    if (formData.images.length < imagesLimit) {
      handleChange('images', [...formData.images, imageUrl])
    }
  }, [formData.images, imagesLimit, handleChange])

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && formData.tags.length < 20) {
      handleChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }, [newTag, formData.tags, handleChange])

  const handleRemoveTag = useCallback((index: number) => {
    handleChange('tags', formData.tags.filter((_, i) => i !== index))
  }, [formData.tags, handleChange])

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
          placeholder="Gostat"
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
          placeholder="Descripción del proyecto (puede contener markdown)"
          className="bg-white/10 border-white/30 text-white placeholder-white/50 min-h-[120px]"
          aria-invalid={!!fieldErrors.description}
          disabled={isSaving}
        />
        {fieldErrors.description && (
          <p className="text-sm text-destructive">{fieldErrors.description}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="text-white font-semibold">
          Imágenes Adicionales {imagesLimit > 0 ? `(máx. ${imagesLimit})` : ''}
        </Label>
        <div className="space-y-2">
          <ImageUploadButton
            onImageUploaded={handleAddImageFromUpload}
            disabled={isSaving || formData.images.length >= imagesLimit}
            label="Agregar Imagen Adicional"
          />
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <img 
                    src={image} 
                    alt={`Preview imagen ${index + 1} del proyecto`}
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSaving}
                    aria-label={`Eliminar imagen ${index + 1}`}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {fieldErrors.images && (
          <p className="text-sm text-destructive">{fieldErrors.images}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="text-white font-semibold">
          Tags * (máx. 20)
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Golang"
            className="bg-white/10 border-white/30 text-white placeholder-white/50"
            disabled={isSaving || formData.tags.length >= 20}
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={isSaving || !newTag.trim() || formData.tags.length >= 20}
            className="bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg"
              >
                <span className="text-white text-sm">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  disabled={isSaving}
                  aria-label={`Eliminar tag ${tag}`}
                  className="text-white/60 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
        {fieldErrors.tags && (
          <p className="text-sm text-destructive">{fieldErrors.tags}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-demoUrl" className="text-white font-semibold">
          URL Demo
        </Label>
        <Input
          id="modal-demoUrl"
          type="url"
          value={formData.demoUrl}
          onChange={(e) => handleChange('demoUrl', e.target.value)}
          placeholder="https://demo.example.com"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.demoUrl}
          disabled={isSaving}
        />
        {fieldErrors.demoUrl && (
          <p className="text-sm text-destructive">{fieldErrors.demoUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-githubUrl" className="text-white font-semibold">
          URL GitHub
        </Label>
        <Input
          id="modal-githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={(e) => handleChange('githubUrl', e.target.value)}
          placeholder="https://github.com/user/repo"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.githubUrl}
          disabled={isSaving}
        />
        {fieldErrors.githubUrl && (
          <p className="text-sm text-destructive">{fieldErrors.githubUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-order" className="text-white font-semibold">
          Orden (Posición)
        </Label>
        <Input
          id="modal-order"
          type="number"
          value={formData.order}
          onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
          min="0"
          max="2"
          placeholder="0"
          className="bg-white/10 border-white/30 text-white placeholder-white/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          aria-invalid={!!fieldErrors.order}
          disabled={isSaving || isEditMode}
          readOnly={isEditMode}
        />
        {isEditMode && (
          <p className="text-sm text-white/60">El orden no se puede cambiar después de crear el proyecto</p>
        )}
        {fieldErrors.order && (
          <p className="text-sm text-destructive">{fieldErrors.order}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-collageType" className="text-white font-semibold">
          Tipo de Collage *
        </Label>
        <Select
          value={formData.collageType}
          onValueChange={(value) => handleChange('collageType', value as 'first' | 'second' | 'third')}
          disabled={isSaving}
        >
          <SelectTrigger 
            id="modal-collageType"
            className="bg-white/10 border-white/30 text-white"
            aria-invalid={!!fieldErrors.collageType}
          >
            <SelectValue placeholder="Selecciona un tipo de collage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first">{COLLAGE_TYPE_LABELS.first}</SelectItem>
            <SelectItem value="second">{COLLAGE_TYPE_LABELS.second}</SelectItem>
            <SelectItem value="third">{COLLAGE_TYPE_LABELS.third}</SelectItem>
          </SelectContent>
        </Select>
        {fieldErrors.collageType && (
          <p className="text-sm text-destructive">{fieldErrors.collageType}</p>
        )}
      </div>

      <div className="md:col-span-2 flex items-center space-x-2">
        <Switch
          id="modal-active"
          checked={formData.active}
          onCheckedChange={(checked) => handleChange('active', checked)}
          disabled={isSaving}
        />
        <Label htmlFor="modal-active" className="text-white font-semibold cursor-pointer">
          Proyecto activo
        </Label>
      </div>
    </div>
  )
})

