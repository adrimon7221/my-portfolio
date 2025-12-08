/**
 * Componente de formulario para crear/editar tecnologías
 * 
 * Componente reutilizable que encapsula la lógica del formulario
 */

"use client"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_LABELS } from "../constants/technologies.constants"
import type { TechnologyFormData, TechnologyFieldErrors } from "../types/technology.types"

interface TechnologyFormProps {
  formData: TechnologyFormData
  fieldErrors: TechnologyFieldErrors
  onFormDataChange: (data: TechnologyFormData) => void
  isSaving: boolean
}

/**
 * Componente de formulario para crear/editar tecnologías
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const TechnologyForm = memo(function TechnologyForm({ 
  formData, 
  fieldErrors, 
  onFormDataChange,
  isSaving
}: TechnologyFormProps) {
  const handleChange = useCallback((field: keyof TechnologyFormData, value: string | number | boolean) => {
    onFormDataChange({ ...formData, [field]: value })
  }, [formData, onFormDataChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-name" className="text-white font-semibold">
          Nombre *
        </Label>
        <Input
          id="modal-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="React"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.name}
          disabled={isSaving}
        />
        {fieldErrors.name && (
          <p className="text-sm text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-category" className="text-white font-semibold">
          Categoría *
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange('category', value as TechnologyFormData['category'])}
          disabled={isSaving}
        >
          <SelectTrigger 
            id="modal-category"
            className="bg-white/10 border-white/30 text-white"
            aria-invalid={!!fieldErrors.category}
          >
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">{CATEGORY_LABELS.frontend}</SelectItem>
            <SelectItem value="styles">{CATEGORY_LABELS.styles}</SelectItem>
            <SelectItem value="backend">{CATEGORY_LABELS.backend}</SelectItem>
            <SelectItem value="devops">{CATEGORY_LABELS.devops}</SelectItem>
          </SelectContent>
        </Select>
        {fieldErrors.category && (
          <p className="text-sm text-destructive">{fieldErrors.category}</p>
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
          placeholder="0"
          className="bg-white/10 border-white/30 text-white placeholder-white/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          aria-invalid={!!fieldErrors.order}
          disabled={isSaving}
        />
        {fieldErrors.order && (
          <p className="text-sm text-destructive">{fieldErrors.order}</p>
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
          Tecnología activa
        </Label>
      </div>
    </div>
  )
})

