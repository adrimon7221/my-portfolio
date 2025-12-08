/**
 * Componente principal para gestionar Artículos
 * 
 * Orquestador que coordina los diferentes componentes y hooks
 * para proporcionar funcionalidad CRUD completa.
 * 
 * Arquitectura:
 * - useArticles: Hook personalizado con toda la lógica de negocio
 * - ArticleForm: Componente reutilizable del formulario
 * - ArticleTable: Componente reutilizable de la tabla
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useArticles } from "../hooks/useArticles"
import { ArticleForm } from "./ArticleForm"
import { ArticleTable } from "./ArticleTable"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

export function ArticlesManager() {
  const {
    // Estado
    articles,
    paginatedArticles,
    loading,
    saving,
    deleting,
    error,
    fieldErrors,
    
    // Estado de paginación
    currentPage,
    totalPages,
    setPage,
    
    // Estado del modal
    isModalOpen,
    modalMode,
    
    // Estado del formulario
    formData,
    setFormData,
    isFormValid,
    
    // Estado del modal de eliminación
    deleteModalOpen,
    articleToDelete,
    
    // Acciones
    openCreateModal,
    openEditModal,
    closeModal,
    saveArticle,
    openDeleteModal,
    closeDeleteModal,
    deleteArticle,
  } = useArticles()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">Cargando artículos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Artículos</h2>
        <Button 
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          disabled={saving || deleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Modal Crear/Editar */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open && !saving) {
          closeModal()
        }
      }}>
        <DialogContent className="bg-[#3D3D3D] border border-white/10 rounded-2xl max-w-3xl h-[90vh] flex flex-col overflow-hidden p-0 gap-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
            <DialogTitle className="text-white font-semibold">
              {modalMode === 'create' ? "Crear Artículo" : "Editar Artículo"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {modalMode === 'create'
                ? "Completa el formulario para agregar un nuevo artículo."
                : "Modifica los datos del artículo."}
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
                <ArticleForm
                  formData={formData}
                  fieldErrors={fieldErrors}
                  onFormDataChange={setFormData}
                  isSaving={saving}
                />
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
            <Button
              onClick={saveArticle}
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
        articleTitle={articleToDelete?.title || null}
        onConfirm={deleteArticle}
        onCancel={closeDeleteModal}
        isDeleting={deleting}
      />

      {/* Tabla de Artículos */}
      {articles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-white/60 mb-4">No hay artículos creados</p>
          <Button 
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            disabled={saving || deleting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primer artículo
          </Button>
        </div>
      ) : (
        <>
          <ArticleTable
            articles={paginatedArticles}
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
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setPage(currentPage - 1)
                      }
                    }}
                    className={currentPage === 1 
                      ? 'pointer-events-none opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-white/10 text-white'}
                    style={currentPage === 1 ? undefined : { pointerEvents: 'auto' }}
                  />
                </PaginationItem>
                
                {(() => {
                  const pages: (number | 'ellipsis')[] = []
                  
                  // Siempre mostrar primera página
                  pages.push(1)
                  
                  // Si hay más de 7 páginas, usar lógica compleja
                  if (totalPages > 7) {
                    if (currentPage <= 4) {
                      // Cerca del inicio
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i)
                      }
                      pages.push('ellipsis')
                      pages.push(totalPages)
                    } else if (currentPage >= totalPages - 3) {
                      // Cerca del final
                      pages.push('ellipsis')
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i)
                      }
                    } else {
                      // En el medio
                      pages.push('ellipsis')
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                      }
                      pages.push('ellipsis')
                      pages.push(totalPages)
                    }
                  } else {
                    // Menos de 7 páginas, mostrar todas
                    for (let i = 2; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  }
                  
                  // Eliminar duplicados y ellipsis consecutivos
                  const cleanedPages: (number | 'ellipsis')[] = []
                  let lastWasEllipsis = false
                  
                  for (let i = 0; i < pages.length; i++) {
                    if (pages[i] === 'ellipsis') {
                      if (!lastWasEllipsis) {
                        cleanedPages.push('ellipsis')
                        lastWasEllipsis = true
                      }
                    } else {
                      cleanedPages.push(pages[i])
                      lastWasEllipsis = false
                    }
                  }
                  
                  return cleanedPages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(page)
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white data-[active=true]:border-white/30"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })
                })()}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        setPage(currentPage + 1)
                      }
                    }}
                    className={currentPage === totalPages 
                      ? 'pointer-events-none opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-white/10 text-white'}
                    style={currentPage === totalPages ? undefined : { pointerEvents: 'auto' }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

