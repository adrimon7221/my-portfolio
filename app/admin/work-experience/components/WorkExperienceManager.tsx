/**
 * Componente principal para gestionar Work Experience
 * 
 * Orquestador que coordina los diferentes componentes y hooks
 * para proporcionar funcionalidad CRUD completa.
 * 
 * Arquitectura:
 * - useWorkExperiences: Hook personalizado con toda la lógica de negocio
 * - WorkExperienceForm: Componente reutilizable del formulario
 * - WorkExperienceTable: Componente reutilizable de la tabla
 * - DeleteConfirmDialog: Componente reutilizable del modal de confirmación
 * 
 * Mejoras implementadas:
 * - Separación de responsabilidades (lógica en hook, UI en componente)
 * - Manejo robusto de errores con feedback visual
 * - Estados de carga independientes
 * - Paginación
 * - UX fluida con optimistic updates
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkExperiences } from "../hooks/useWorkExperiences"
import { WorkExperienceForm } from "./WorkExperienceForm"
import { WorkExperienceTable } from "./WorkExperienceTable"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

export function WorkExperienceManager() {
  const {
    // Estado
    workExperiences,
    paginatedWorkExperiences,
    loading,
    saving,
    deleting,
    error,
    
    // Estado de paginación
    currentPage,
    totalPages,
    setPage,
    
    // Estado del modal
    modalMode,
    deleteModalOpen,
    workExperienceToDelete,
    
    // Estado del formulario
    formData,
    setFormData,
    fieldErrors,
    
    // Acciones
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    openDeleteModal,
    closeDeleteModal,
    deleteWorkExperience,
  } = useWorkExperiences()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">Cargando experiencias laborales...</p>
      </div>
    )
  }

  const isModalOpen = modalMode !== null

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Experiencia Laboral</h2>
        <Button 
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          disabled={saving || deleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Experiencia
        </Button>
      </div>

      {/* Error general */}
      {error && (
        <Alert variant="destructive" className="bg-white/10 border-white/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="!text-white break-words overflow-wrap-anywhere whitespace-normal">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabla */}
      {workExperiences.length === 0 ? (
        <div className="py-12 text-center border border-white/10 rounded-2xl">
          <p className="text-white/60 mb-4">No hay experiencias laborales creadas</p>
          <Button 
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            disabled={saving || deleting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primera experiencia
          </Button>
        </div>
      ) : (
        <>
          <WorkExperienceTable
            workExperiences={paginatedWorkExperiences}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            isDeleting={deleting}
          />
          
          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar siempre la primera y última página
                  // Mostrar páginas alrededor de la actual
                  const showPage = 
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  
                  if (!showPage) {
                    // Mostrar ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Modal de crear/editar */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-2xl [&_[data-slot='dialog-close']]:cursor-pointer overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-white font-semibold">
              {modalMode === 'create' ? 'Nueva Experiencia Laboral' : 'Editar Experiencia Laboral'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {modalMode === 'create' 
                ? 'Completa el formulario para crear una nueva experiencia laboral'
                : 'Modifica los datos de la experiencia laboral'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6">
                <WorkExperienceForm
                  formData={formData}
                  fieldErrors={fieldErrors}
                  onFormDataChange={setFormData}
                  isSaving={saving}
                />
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button
              onClick={handleSave}
              disabled={saving}
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

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmDialog
        open={deleteModalOpen}
        companyName={workExperienceToDelete?.company || null}
        onConfirm={deleteWorkExperience}
        onCancel={closeDeleteModal}
        isDeleting={deleting}
      />
    </div>
  )
}

