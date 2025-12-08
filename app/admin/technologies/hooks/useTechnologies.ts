/**
 * Hook personalizado para gestionar Technologies
 * 
 * Encapsula toda la lógica de negocio relacionada con tecnologías:
 * - Estado de las tecnologías
 * - Operaciones CRUD con optimistic updates
 * - Manejo robusto de errores
 * - Estado del formulario
 * - Filtrado por categoría
 * - Paginación
 * - Agrupación por categoría
 * 
 * Mejoras implementadas:
 * - Optimistic updates para mejor UX
 * - Rollback automático en caso de error
 * - Gestión inteligente de paginación al filtrar/crear/editar/eliminar
 * - Memoización de cálculos costosos
 * - Estados de carga independientes
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { TechnologyService, TechnologyServiceError } from '../services/technology.service'
import { ITEMS_PER_PAGE } from '../constants/technologies.constants'
import type { 
  Technology, 
  TechnologyFormData, 
  TechnologyFieldErrors,
  ModalMode,
  TechnologiesByCategory,
  TechnologyCategory
} from '../types/technology.types'

/**
 * Estado inicial del formulario
 */
const INITIAL_FORM_DATA: TechnologyFormData = {
  name: '',
  category: 'frontend',
  order: 0,
  active: true,
}

/**
 * Hook para gestionar tecnologías
 */
export function useTechnologies() {
  // Estado de las tecnologías
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estado de filtro y paginación
  const [selectedCategory, setSelectedCategory] = useState<TechnologyCategory | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado del modal
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<TechnologyFormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<TechnologyFieldErrors>({})
  
  // Estado de errores
  const [error, setError] = useState<string | null>(null)
  
  // Estado del modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [technologyToDelete, setTechnologyToDelete] = useState<{ id: string; name: string } | null>(null)

  // Ref para almacenar el estado anterior (para rollback en caso de error)
  const previousStateRef = useRef<Technology[]>([])

  /**
   * Carga todas las tecnologías
   */
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const technologiesData = await TechnologyService.getAll()
      setTechnologies(technologiesData)
    } catch (err) {
      const message = err instanceof TechnologyServiceError 
        ? err.message 
        : 'Error desconocido al cargar tecnologías'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carga las tecnologías al montar el componente
   */
  useEffect(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

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
  const openEditModal = useCallback((technology: Technology) => {
    setFormData({
      name: technology.name,
      category: technology.category,
      order: technology.order,
      active: technology.active,
    })
    setFieldErrors({})
    setError(null)
    setModalMode('edit')
    setEditingId(technology.id)
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
   * Crea una nueva tecnología con optimistic update
   */
  const createTechnology = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      setFieldErrors({})
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...technologies]

      // Optimistic update
      const optimisticTechnology: Technology = {
        id: 'temp-' + Date.now(),
        name: formData.name,
        category: formData.category,
        order: formData.order,
        active: formData.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTechnologies(prev => [...prev, optimisticTechnology].sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category)
        }
        return a.order - b.order
      }))

      // Llamar a la API
      const created = await TechnologyService.create({
        name: formData.name,
        category: formData.category,
        order: formData.order,
        active: formData.active,
      })

      // Reemplazar el optimistic update con el real
      setTechnologies(prev => 
        prev
          .map(t => t.id === optimisticTechnology.id ? created : t)
          .sort((a, b) => {
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category)
            }
            return a.order - b.order
          })
      )

      // Si el filtro está activo y la nueva tecnología no coincide, ajustar página
      if (selectedCategory !== 'all' && created.category !== selectedCategory) {
        // No hacer nada, la tecnología no aparecerá en el filtro actual
      } else {
        // Ajustar página si es necesario para mostrar la nueva tecnología
        const newFiltered = selectedCategory === 'all' 
          ? [...technologies, created]
          : technologies.filter(t => t.category === selectedCategory).concat(created)
        const newTotalPages = Math.ceil(newFiltered.length / ITEMS_PER_PAGE)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      }

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setTechnologies(previousStateRef.current)

      if (err instanceof TechnologyServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al crear la tecnología')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, technologies, closeModal, selectedCategory, currentPage])

  /**
   * Actualiza una tecnología con optimistic update
   */
  const updateTechnology = useCallback(async (): Promise<boolean> => {
    if (!editingId) return false

    try {
      setError(null)
      setFieldErrors({})
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...technologies]

      // Obtener la tecnología original para comparar
      const originalTechnology = technologies.find(t => t.id === editingId)
      if (!originalTechnology) {
        setError('Tecnología no encontrada')
        return false
      }

      // Optimistic update
      setTechnologies(prev => 
        prev
          .map(t => 
            t.id === editingId 
              ? { ...t, ...formData, updatedAt: new Date().toISOString() }
              : t
          )
          .sort((a, b) => {
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category)
            }
            return a.order - b.order
          })
      )

      // Llamar a la API
      const updated = await TechnologyService.update(editingId, formData)

      // Reemplazar el optimistic update con el real
      setTechnologies(prev => 
        prev
          .map(t => t.id === editingId ? updated : t)
          .sort((a, b) => {
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category)
            }
            return a.order - b.order
          })
      )

      // Si cambió la categoría y el filtro está activo, ajustar página
      if (selectedCategory !== 'all') {
        if (originalTechnology.category === selectedCategory && updated.category !== selectedCategory) {
          // La tecnología se movió fuera del filtro actual
          const newFiltered = technologies.filter(t => 
            t.id !== editingId && t.category === selectedCategory
          )
          const newTotalPages = Math.ceil(newFiltered.length / ITEMS_PER_PAGE)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          } else if (newTotalPages === 0) {
            setCurrentPage(1)
          }
        } else if (originalTechnology.category !== selectedCategory && updated.category === selectedCategory) {
          // La tecnología se movió dentro del filtro actual
          const newFiltered = technologies.filter(t => 
            t.category === selectedCategory || t.id === editingId
          )
          const newTotalPages = Math.ceil(newFiltered.length / ITEMS_PER_PAGE)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
        }
      }

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setTechnologies(previousStateRef.current)

      if (err instanceof TechnologyServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al actualizar la tecnología')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [editingId, formData, technologies, closeModal, selectedCategory, currentPage])

  /**
   * Abre el modal de confirmación de eliminación
   */
  const openDeleteModal = useCallback((technology: Technology) => {
    setTechnologyToDelete({ id: technology.id, name: technology.name })
    setDeleteModalOpen(true)
  }, [])

  /**
   * Cierra el modal de confirmación de eliminación
   */
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setTechnologyToDelete(null)
  }, [])

  /**
   * Elimina una tecnología con optimistic update
   */
  const deleteTechnology = useCallback(async (): Promise<boolean> => {
    if (!technologyToDelete) return false

    try {
      setError(null)
      setDeleting(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...technologies]

      // Optimistic update
      setTechnologies(prev => prev.filter(t => t.id !== technologyToDelete.id))

      // Llamar a la API
      await TechnologyService.remove(technologyToDelete.id)

      // Ajustar página si es necesario después de eliminar
      const newFiltered = selectedCategory === 'all'
        ? technologies.filter(t => t.id !== technologyToDelete.id)
        : technologies.filter(t => t.id !== technologyToDelete.id && t.category === selectedCategory)
      const newTotalPages = Math.ceil(newFiltered.length / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      } else if (newTotalPages === 0) {
        setCurrentPage(1)
      }

      closeDeleteModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setTechnologies(previousStateRef.current)

      const message = err instanceof TechnologyServiceError 
        ? err.message 
        : 'Error desconocido al eliminar la tecnología'
      setError(message)
      closeDeleteModal()
      return false
    } finally {
      setDeleting(false)
    }
  }, [technologyToDelete, technologies, closeDeleteModal, selectedCategory, currentPage])

  /**
   * Tecnologías filtradas por categoría
   * Memoizado para evitar recálculos innecesarios
   */
  const filteredTechnologies = useMemo(() => {
    if (selectedCategory === 'all') {
      return technologies
    }
    return technologies.filter(t => t.category === selectedCategory)
  }, [technologies, selectedCategory])

  /**
   * Ajusta la página actual si es necesario después de cambios en el filtro
   */
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    } else if (newTotalPages === 0) {
      setCurrentPage(1)
    }
  }, [filteredTechnologies.length, currentPage])

  /**
   * Tecnologías paginadas
   */
  const paginatedTechnologies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredTechnologies.slice(startIndex, endIndex)
  }, [filteredTechnologies, currentPage])

  /**
   * Total de páginas
   */
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE)
  }, [filteredTechnologies.length])

  /**
   * Cambiar página
   */
  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  /**
   * Cambiar categoría (resetea a página 1)
   */
  const setCategory = useCallback((category: TechnologyCategory | 'all') => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  /**
   * Tecnologías agrupadas por categoría (solo activas)
   */
  const technologiesByCategory = useMemo<TechnologiesByCategory>(() => {
    const active = technologies.filter(t => t.active)
    return {
      frontend: active.filter(t => t.category === 'frontend').sort((a, b) => a.order - b.order),
      styles: active.filter(t => t.category === 'styles').sort((a, b) => a.order - b.order),
      backend: active.filter(t => t.category === 'backend').sort((a, b) => a.order - b.order),
      devops: active.filter(t => t.category === 'devops').sort((a, b) => a.order - b.order),
    }
  }, [technologies])

  /**
   * Guarda (crea o actualiza) según el modo del modal
   */
  const handleSave = useCallback(async () => {
    if (modalMode === 'create') {
      return await createTechnology()
    } else if (modalMode === 'edit') {
      return await updateTechnology()
    }
    return false
  }, [modalMode, createTechnology, updateTechnology])

  return {
    // Estado
    technologies,
    technologiesByCategory,
    filteredTechnologies,
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
    editingId,
    deleteModalOpen,
    technologyToDelete,
    
    // Estado del formulario
    formData,
    setFormData,
    fieldErrors,
    
    // Acciones
    fetchTechnologies,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    openDeleteModal,
    closeDeleteModal,
    deleteTechnology,
    resetForm,
  }
}

