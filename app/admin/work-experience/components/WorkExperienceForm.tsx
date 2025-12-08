/**
 * Componente de formulario para crear/editar experiencias laborales
 * 
 * Componente reutilizable que encapsula la lógica del formulario
 */

"use client"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { WorkExperienceFormData, WorkExperienceFieldErrors } from "../types/work-experience.types"

interface WorkExperienceFormProps {
  formData: WorkExperienceFormData
  fieldErrors: WorkExperienceFieldErrors
  onFormDataChange: (data: WorkExperienceFormData) => void
  isSaving: boolean
}

/**
 * Componente de formulario para crear/editar experiencias laborales
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const WorkExperienceForm = memo(function WorkExperienceForm({ 
  formData, 
  fieldErrors, 
  onFormDataChange,
  isSaving
}: WorkExperienceFormProps) {
  const handleChange = useCallback((field: keyof WorkExperienceFormData, value: string | number | boolean) => {
    onFormDataChange({ ...formData, [field]: value })
  }, [formData, onFormDataChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-company" className="text-white font-semibold">
          Empresa *
        </Label>
        <Input
          id="modal-company"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="ITHUB"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.company}
          disabled={isSaving}
        />
        {fieldErrors.company && (
          <p className="text-sm text-destructive">{fieldErrors.company}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="modal-position" className="text-white font-semibold">
          Posición *
        </Label>
        <Input
          id="modal-position"
          type="text"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          placeholder="Frontend developer | React & Vue"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.position}
          disabled={isSaving}
        />
        {fieldErrors.position && (
          <p className="text-sm text-destructive">{fieldErrors.position}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-period" className="text-white font-semibold">
          Período *
        </Label>
        <Input
          id="modal-period"
          type="text"
          value={formData.period}
          onChange={(e) => handleChange('period', e.target.value)}
          placeholder="2022 -"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.period}
          disabled={isSaving}
        />
        {fieldErrors.period && (
          <p className="text-sm text-destructive">{fieldErrors.period}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-duration" className="text-white font-semibold">
          Duración *
        </Label>
        <Input
          id="modal-duration"
          type="text"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          placeholder="1 year 5 months"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.duration}
          disabled={isSaving}
        />
        {fieldErrors.duration && (
          <p className="text-sm text-destructive">{fieldErrors.duration}</p>
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
          Experiencia activa
        </Label>
      </div>
    </div>
  )
})

