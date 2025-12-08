/**
 * Componente de modal de confirmación para eliminar proyectos
 * 
 * Componente reutilizable que muestra un modal de confirmación antes de eliminar
 */

"use client"

import { memo } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteConfirmDialogProps {
  open: boolean
  projectTitle: string | null
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

/**
 * Componente de modal de confirmación para eliminar proyectos
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const DeleteConfirmDialog = memo(function DeleteConfirmDialog({ 
  open, 
  projectTitle, 
  onConfirm, 
  onCancel,
  isDeleting
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-md [&_[data-slot='dialog-close']]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-white font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-white/60">
            ¿Estás seguro de que deseas eliminar el proyecto{' '}
            <span className="font-semibold text-white">{projectTitle || 'este proyecto'}</span>? 
            Esta acción no se puede deshacer y se eliminarán todas las imágenes asociadas.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onConfirm}
            aria-label={`Confirmar eliminación del proyecto ${projectTitle || ''}`}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
                <span>Eliminando...</span>
              </span>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Eliminar</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

