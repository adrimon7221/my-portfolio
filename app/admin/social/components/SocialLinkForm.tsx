/**
 * Componente de formulario para crear/editar enlaces sociales
 * 
 * Componente reutilizable que encapsula la lógica del formulario
 */

"use client"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { SocialLinkFormData, SocialLinkFieldErrors } from "../types/social-link.types"

interface SocialLinkFormProps {
  formData: SocialLinkFormData
  fieldErrors: SocialLinkFieldErrors
  onFormDataChange: (data: SocialLinkFormData) => void
}

/**
 * Componente de formulario para crear/editar enlaces sociales
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const SocialLinkForm = memo(function SocialLinkForm({ 
  formData, 
  fieldErrors, 
  onFormDataChange 
}: SocialLinkFormProps) {
  const handleChange = useCallback((field: keyof SocialLinkFormData, value: string | number | boolean) => {
    onFormDataChange({ ...formData, [field]: value })
  }, [formData, onFormDataChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="modal-label" className="text-white font-semibold">
          Label *
        </Label>
        <Input
          id="modal-label"
          type="text"
          value={formData.label}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="GitHub"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.label}
        />
        {fieldErrors.label && (
          <p className="text-sm text-destructive">{fieldErrors.label}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-url" className="text-white font-semibold">
          URL *
        </Label>
        <Input
          id="modal-url"
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://github.com/username"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.url}
        />
        {fieldErrors.url && (
          <p className="text-sm text-destructive">{fieldErrors.url}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modal-icon" className="text-white font-semibold">
          Icono (react-icons) *
        </Label>
        <Input
          id="modal-icon"
          type="text"
          value={formData.icon}
          onChange={(e) => handleChange('icon', e.target.value)}
          placeholder="FaGithub"
          className="bg-white/10 border-white/30 text-white placeholder-white/50"
          aria-invalid={!!fieldErrors.icon}
        />
        {fieldErrors.icon && (
          <p className="text-sm text-destructive">{fieldErrors.icon}</p>
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
        />
        <Label htmlFor="modal-active" className="text-white font-semibold cursor-pointer">
          Enlace activo
        </Label>
      </div>
    </div>
  )
})

