/**
 * Modal de confirmación para eliminar un enlace social
 * 
 * Componente reutilizable para confirmar acciones destructivas
 */

"use client"

import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
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
  linkLabel: string | null
  deleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ 
  open, 
  linkLabel, 
  deleting = false,
  onConfirm, 
  onCancel 
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !deleting) {
        onCancel()
      }
    }}>
      <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-md [&_[data-slot='dialog-close']]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-white font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-white/60">
            ¿Estás seguro de que deseas eliminar el enlace social{" "}
            <span className="font-semibold text-white">{linkLabel}</span>? 
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
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
}

