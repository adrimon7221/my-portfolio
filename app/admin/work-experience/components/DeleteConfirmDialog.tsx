/**
 * Componente de modal de confirmación para eliminar experiencias laborales
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
  companyName: string | null
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

/**
 * Componente de modal de confirmación para eliminar experiencias laborales
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const DeleteConfirmDialog = memo(function DeleteConfirmDialog({ 
  open, 
  companyName, 
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
            ¿Estás seguro de que deseas eliminar la experiencia laboral en <span className="font-semibold text-white">{companyName}</span>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="cursor-pointer"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Eliminando...
              </span>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

