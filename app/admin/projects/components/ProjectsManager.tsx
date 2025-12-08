/**
 * Componente principal para gestionar Projects
 * 
 * Orquestador que coordina los diferentes componentes y hooks
 * para proporcionar funcionalidad CRUD completa.
 * 
 * Arquitectura:
 * - useProjects: Hook personalizado con toda la lógica de negocio
 * - ProjectForm: Componente reutilizable del formulario
 * - ProjectTable: Componente reutilizable de la tabla
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
import { useProjects } from "../hooks/useProjects"
import { ProjectForm } from "./ProjectForm"
import { ProjectTable } from "./ProjectTable"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

export function ProjectsManager() {
  const {
    // Estado
    projects,
    paginatedProjects,
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
    editingId,
    deleteModalOpen,
    projectToDelete,
    
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
    deleteProject,
  } = useProjects()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          <p className="text-white/60">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  const isModalOpen = modalMode !== null

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Proyectos</h2>
        <Button 
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          disabled={saving || deleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
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
      {projects.length === 0 ? (
        <div className="py-12 text-center border border-white/10 rounded-2xl">
          <p className="text-white/60 mb-4">No hay proyectos creados</p>
          <Button 
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            disabled={saving || deleting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primer proyecto
          </Button>
        </div>
      ) : (
        <>
          <ProjectTable
            projects={paginatedProjects}
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
        <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-3xl h-[90vh] flex flex-col overflow-hidden p-0 gap-0 [&_[data-slot='dialog-close']]:cursor-pointer">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
            <DialogTitle className="text-white font-semibold">
              {modalMode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {modalMode === 'create' 
                ? 'Completa el formulario para crear un nuevo proyecto'
                : 'Modifica los datos del proyecto'}
            </DialogDescription>
          </DialogHeader>

          {/* Error general */}
          {error && (
            <div className="flex-shrink-0 mx-6 mb-4">
              <Alert variant="destructive" className="bg-white/10 border-white/30 w-full">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <AlertDescription className="!text-white break-words overflow-wrap-anywhere whitespace-normal">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Formulario con scroll */}
          <div className="flex-1 min-h-0 overflow-hidden px-6">
            <ScrollArea className="h-full">
              <div className="pr-4 pb-4">
                <ProjectForm
                  formData={formData}
                  fieldErrors={fieldErrors}
                  onFormDataChange={setFormData}
                  isSaving={saving}
                  isEditMode={modalMode === 'edit'}
                  currentOrder={editingId ? projects.find(p => p.id === editingId)?.order : formData.order}
                />
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
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
        projectTitle={projectToDelete?.title || null}
        onConfirm={deleteProject}
        onCancel={closeDeleteModal}
        isDeleting={deleting}
      />
    </div>
  )
}

