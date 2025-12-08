/**
 * Componente principal para gestionar Enlaces Sociales
 * 
 * Orquestador que coordina los diferentes componentes y hooks
 * para proporcionar funcionalidad CRUD completa.
 * 
 * Arquitectura:
 * - useSocialLinks: Hook personalizado con toda la lógica de negocio
 * - SocialLinkForm: Componente reutilizable del formulario
 * - SocialLinkTable: Componente reutilizable de la tabla
 * - DeleteConfirmDialog: Componente reutilizable del modal de confirmación
 */

"use client"

import { Plus, Save, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSocialLinks } from "../hooks/useSocialLinks"
import { SocialLinkForm } from "./SocialLinkForm"
import { SocialLinkTable } from "./SocialLinkTable"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

export function SocialLinksManager() {
  const {
    // Estado
    socialLinks,
    loading,
    saving,
    deleting,
    error,
    fieldErrors,
    
    // Estado del modal
    isModalOpen,
    modalMode,
    
    // Estado del formulario
    formData,
    setFormData,
    isFormValid,
    
    // Estado del modal de eliminación
    deleteModalOpen,
    linkToDelete,
    
    // Acciones
    openCreateModal,
    openEditModal,
    closeModal,
    saveLink,
    openDeleteModal,
    closeDeleteModal,
    deleteLink,
  } = useSocialLinks()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">Cargando enlaces sociales...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Enlaces Sociales</h2>
        <Button 
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Enlace
        </Button>
      </div>

      {/* Modal Crear/Editar */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open && !saving) {
          closeModal()
        }
      }}>
        <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold">
              {modalMode === 'create' ? "Crear Enlace Social" : "Editar Enlace Social"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {modalMode === 'create'
                ? "Completa el formulario para agregar un nuevo enlace social."
                : "Modifica los datos del enlace social."}
            </DialogDescription>
          </DialogHeader>

          {/* Error general */}
          {error && (
            <Alert variant="destructive" className="bg-white/10 border-white/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="!text-white">{error}</AlertDescription>
            </Alert>
          )}

          {/* Formulario */}
          <SocialLinkForm
            formData={formData}
            fieldErrors={fieldErrors}
            onFormDataChange={setFormData}
          />

          <DialogFooter>
            <Button
              onClick={saveLink}
              disabled={saving || !isFormValid}
              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación para Eliminar */}
      <DeleteConfirmDialog
        open={deleteModalOpen}
        linkLabel={linkToDelete?.label || null}
        deleting={deleting}
        onConfirm={deleteLink}
        onCancel={closeDeleteModal}
      />

      {/* Tabla de Enlaces */}
      {socialLinks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-white/60 mb-4">No hay enlaces sociales creados</p>
          <Button 
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primer enlace
          </Button>
        </div>
      ) : (
        <SocialLinkTable
          socialLinks={socialLinks}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}
    </div>
  )
}
