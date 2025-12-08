/**
 * Hook personalizado para gestionar Articles
 * 
 * Encapsula toda la lógica de negocio relacionada con artículos:
 * - Estado de los artículos
 * - Operaciones CRUD
 * - Manejo de errores
 * - Estado del formulario
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArticleService, ArticleServiceError } from '../services/article.service'
import { validateCreateArticle, validateUpdateArticle } from '@/lib/validations'
import { MAX_ACTIVE_ARTICLES, ITEMS_PER_PAGE } from '../constants/articles.constants'
import type { 
  Article, 
  ArticleFormData, 
  ArticleFieldErrors,
  ModalMode 
} from '../types/article.types'

/**
 * Estado inicial del formulario
 */
const INITIAL_FORM_DATA: ArticleFormData = {
  title: '',
  description: '',
  url: '',
  image: '',
  order: 0,
  active: true,
  featured: false,
}

/**
 * Hook para gestionar artículos
 */
export function useArticles() {
  // Estado de los artículos
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado del modal
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<ArticleFormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<ArticleFieldErrors>({})
  
  // Estado de errores
  const [error, setError] = useState<string | null>(null)
  
  // Estado del modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null)

  // Ref para almacenar el estado anterior (para rollback en caso de error)
  const previousStateRef = useRef<Article[]>([])

  /**
   * Carga todos los artículos
   */
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const articlesData = await ArticleService.getAll()
      setArticles(articlesData)
    } catch (err) {
      const message = err instanceof ArticleServiceError 
        ? err.message 
        : 'Error desconocido al cargar artículos'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carga los artículos al montar el componente
   */
  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    setFieldErrors({})
    setError(null)
  }, [])

  /**
   * Abre el modal en modo creación
   */
  const openCreateModal = useCallback(() => {
    resetForm()
    setModalMode('create')
    setEditingId(null)
  }, [resetForm])

  /**
   * Abre el modal en modo edición
   */
  const openEditModal = useCallback((article: Article) => {
    setFormData({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image || '',
      order: article.order,
      active: article.active,
      featured: article.featured,
    })
    setFieldErrors({})
    setError(null)
    setModalMode('edit')
    setEditingId(article.id)
  }, [])

  /**
   * Cierra el modal
   */
  const closeModal = useCallback(() => {
    setModalMode(null)
    setEditingId(null)
    resetForm()
  }, [resetForm])

  /**
   * Crea un nuevo artículo con optimistic update
   */
  const createArticle = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      setFieldErrors({})

      // Validar límite de artículos activos antes de crear
      if (formData.active === true) {
        const activeCount = articles.filter(article => article.active).length
        if (activeCount >= MAX_ACTIVE_ARTICLES) {
          setError(`No se pueden tener más de ${MAX_ACTIVE_ARTICLES} artículos activos. Desactiva otro artículo primero.`)
          return false
        }
      }
      
      setSaving(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...articles]
      
      // Optimistic update: agregar temporalmente el nuevo artículo
      const optimisticArticle: Article = {
        id: `temp-${Date.now()}`,
        ...formData,
        image: formData.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setArticles((prev) => [...prev, optimisticArticle])
      
      // Realizar la petición real
      const newArticle = await ArticleService.create(formData)
      
      // Reemplazar el artículo temporal con el real y ordenar
      setArticles((prev) => {
        const updated = prev.map((article) => article.id === optimisticArticle.id ? newArticle : article)
        // Ordenar por order para mantener consistencia
        return updated.sort((a, b) => a.order - b.order)
      })
      
      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setArticles(previousStateRef.current)
      
      if (err instanceof ArticleServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors as ArticleFieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al crear artículo')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, articles, closeModal, fetchArticles])

  /**
   * Actualiza un artículo existente con optimistic update
   */
  const updateArticle = useCallback(async (): Promise<boolean> => {
    if (!editingId) return false

    try {
      setError(null)
      setFieldErrors({})
      
      // Encontrar el artículo existente
      const existingArticle = articles.find(article => article.id === editingId)
      if (!existingArticle) {
        setError('Artículo no encontrado')
        return false
      }

      // Validar límite de artículos activos (solo si se está intentando activar)
      if (formData.active === true && existingArticle.active === false) {
        const activeCount = articles.filter(article => article.active).length
        if (activeCount >= MAX_ACTIVE_ARTICLES) {
          setError(`No se pueden tener más de ${MAX_ACTIVE_ARTICLES} artículos activos. Desactiva otro artículo primero.`)
          return false
        }
      }
      
      setSaving(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...articles]
      
      // Optimistic update: actualizar localmente
      setArticles((prev) =>
        prev.map((article) =>
          article.id === editingId
            ? { ...article, ...formData, image: formData.image || null, updatedAt: new Date().toISOString() }
            : article
        )
      )
      
      // Realizar la petición real
      const updatedArticle = await ArticleService.update(editingId, formData)
      
      // Actualizar con la respuesta del servidor y ordenar
      setArticles((prev) => {
        const updated = prev.map((article) => (article.id === editingId ? updatedArticle : article))
        // Ordenar por order para mantener consistencia
        return updated.sort((a, b) => a.order - b.order)
      })
      
      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setArticles(previousStateRef.current)
      
      if (err instanceof ArticleServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors as ArticleFieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al actualizar artículo')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [editingId, formData, articles, closeModal, fetchArticles])

  /**
   * Abre el modal de confirmación de eliminación
   */
  const openDeleteModal = useCallback((article: Article) => {
    setArticleToDelete({ id: article.id, title: article.title })
    setDeleteModalOpen(true)
  }, [])

  /**
   * Cierra el modal de confirmación de eliminación
   */
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setArticleToDelete(null)
  }, [])

  /**
   * Elimina un artículo con optimistic update
   */
  const deleteArticle = useCallback(async (): Promise<boolean> => {
    if (!articleToDelete) return false

    try {
      setError(null)
      setDeleting(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...articles]
      
      // Optimistic update: eliminar localmente
      setArticles((prev) => prev.filter((article) => article.id !== articleToDelete.id))
      
      // Realizar la petición real
      await ArticleService.delete(articleToDelete.id)
      
      closeDeleteModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setArticles(previousStateRef.current)
      
      const message = err instanceof ArticleServiceError 
        ? err.message 
        : 'Error al eliminar artículo'
      setError(message)
      closeDeleteModal()
      return false
    } finally {
      setDeleting(false)
    }
  }, [articleToDelete, articles, closeDeleteModal])

  /**
   * Valida el formulario antes de guardar
   * Extrae errores de campo de Zod si la validación falla
   */
  const validateForm = useCallback((): boolean => {
    try {
      if (modalMode === 'create') {
        validateCreateArticle(formData)
      } else if (modalMode === 'edit') {
        validateUpdateArticle(formData)
      }
      setFieldErrors({})
      return true
    } catch (error) {
      // Extraer errores de campo de Zod
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> }
        const errors: Partial<ArticleFieldErrors> = {}
        
        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ArticleFormData
          if (field) {
            errors[field] = issue.message
          }
        })
        
        setFieldErrors(errors as ArticleFieldErrors)
        setError('Por favor, corrige los errores en el formulario.')
      }
      return false
    }
  }, [formData, modalMode])

  /**
   * Guarda el artículo (crea o actualiza según el modo)
   * Incluye validación en el cliente antes de enviar
   */
  const saveArticle = useCallback(async (): Promise<boolean> => {
    // Validación en el cliente antes de enviar
    if (!validateForm()) {
      setError('Por favor, completa todos los campos requeridos.')
      return false
    }

    if (modalMode === 'create') {
      return createArticle()
    } else if (modalMode === 'edit') {
      return updateArticle()
    }
    return false
  }, [modalMode, createArticle, updateArticle, validateForm])

  /**
   * Verifica si el formulario es válido (para deshabilitar botón)
   */
  const isFormValid = useMemo(() => {
    return formData.title.trim() !== '' && 
           formData.description.trim() !== '' && 
           formData.url.trim() !== ''
  }, [formData])

  /**
   * Calcula los artículos paginados
   */
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return articles.slice(startIndex, endIndex)
  }, [articles, currentPage])

  /**
   * Calcula el total de páginas
   */
  const totalPages = useMemo(() => {
    return Math.ceil(articles.length / ITEMS_PER_PAGE)
  }, [articles.length])

  /**
   * Cambia a una página específica
   */
  const setPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  /**
   * Resetea la paginación cuando cambian los artículos
   * Ajusta la página actual si está fuera de rango
   */
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    } else if (totalPages === 0 && currentPage > 1) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  return {
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
    modalMode,
    isModalOpen: modalMode !== null,
    editingId,
    
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
    refetch: fetchArticles,
  }
}

