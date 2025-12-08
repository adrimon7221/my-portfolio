/**
 * Componente principal para gestionar Technologies
 * 
 * Orquestador que coordina los diferentes componentes y hooks
 * para proporcionar funcionalidad CRUD completa.
 * 
 * Arquitectura:
 * - useTechnologies: Hook personalizado con toda la lógica de negocio
 * - TechnologyForm: Componente reutilizable del formulario
 * - TechnologyTable: Componente reutilizable de la tabla
 * - DeleteConfirmDialog: Componente reutilizable del modal de confirmación
 * 
 * Mejoras implementadas:
 * - Separación de responsabilidades (lógica en hook, UI en componente)
 * - Manejo robusto de errores con feedback visual
 * - Estados de carga independientes
 * - Filtrado por categoría con paginación
 * - UX fluida con optimistic updates
 */

"use client"

import { Plus, Save, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { useTechnologies } from "../hooks/useTechnologies"
import { TechnologyForm } from "./TechnologyForm"
import { TechnologyTable } from "./TechnologyTable"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { CATEGORY_LABELS, TECHNOLOGY_CATEGORIES } from "../constants/technologies.constants"

export function TechnologiesManager() {
  const {
    // Estado
    technologies,
    paginatedTechnologies,
    loading,
    saving,
    deleting,
    error,
    
    // Estado de filtro y paginación
    selectedCategory,
    currentPage,
    totalPages,
    setCategory,
    setPage,
    
    // Estado del modal
    modalMode,
    deleteModalOpen,
    technologyToDelete,
    
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
    deleteTechnology,
  } = useTechnologies()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">Cargando tecnologías...</p>
      </div>
    )
  }

  const isModalOpen = modalMode !== null

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Tecnologías</h2>
        <Button 
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          disabled={saving || deleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tecnología
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

      {/* Filtro por categoría */}
      <div className="flex items-center gap-4">
        <Label htmlFor="category-filter" className="text-white font-semibold">
          Filtrar por categoría:
        </Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setCategory(value as typeof selectedCategory)}
        >
          <SelectTrigger 
            id="category-filter"
            className="bg-white/10 border-white/30 text-white w-[200px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {TECHNOLOGY_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      {technologies.length === 0 ? (
        <div className="py-12 text-center border border-white/10 rounded-2xl">
          <p className="text-white/60 mb-4">No hay tecnologías creadas</p>
          <Button 
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            disabled={saving || deleting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primera tecnología
          </Button>
        </div>
      ) : paginatedTechnologies.length === 0 ? (
        <div className="py-12 text-center border border-white/10 rounded-2xl">
          <p className="text-white/60 mb-4">
            {selectedCategory !== 'all' 
              ? `No hay tecnologías en la categoría "${CATEGORY_LABELS[selectedCategory]}"`
              : 'No hay tecnologías para mostrar'}
          </p>
        </div>
      ) : (
        <>
          <TechnologyTable
            technologies={paginatedTechnologies}
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
              {modalMode === 'create' ? 'Nueva Tecnología' : 'Editar Tecnología'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {modalMode === 'create' 
                ? 'Completa el formulario para crear una nueva tecnología'
                : 'Modifica los datos de la tecnología'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6">
                <TechnologyForm
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
        technologyName={technologyToDelete?.name || null}
        onConfirm={deleteTechnology}
        onCancel={closeDeleteModal}
        isDeleting={deleting}
      />
    </div>
  )
}

