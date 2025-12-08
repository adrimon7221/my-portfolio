/**
 * Hook personalizado para gestionar Work Experience
 * 
 * Encapsula toda la lógica de negocio relacionada con experiencias laborales:
 * - Estado de las experiencias laborales
 * - Operaciones CRUD con optimistic updates
 * - Manejo robusto de errores
 * - Estado del formulario
 * - Paginación
 * 
 * Mejoras implementadas:
 * - Optimistic updates para mejor UX
 * - Rollback automático en caso de error
 * - Gestión inteligente de paginación al crear/editar/eliminar
 * - Memoización de cálculos costosos
 * - Estados de carga independientes
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { WorkExperienceService, WorkExperienceServiceError } from '../services/work-experience.service'
import { ITEMS_PER_PAGE } from '../constants/work-experience.constants'
import type { 
  WorkExperience, 
  WorkExperienceFormData, 
  WorkExperienceFieldErrors,
  ModalMode
} from '../types/work-experience.types'

/**
 * Estado inicial del formulario
 */
const INITIAL_FORM_DATA: WorkExperienceFormData = {
  period: '',
  duration: '',
  company: '',
  position: '',
  order: 0,
  active: true,
}

/**
 * Hook para gestionar experiencias laborales
 */
export function useWorkExperiences() {
  // Estado de las experiencias laborales
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado del modal
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<WorkExperienceFormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<WorkExperienceFieldErrors>({})
  
  // Estado de errores
  const [error, setError] = useState<string | null>(null)
  
  // Estado del modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [workExperienceToDelete, setWorkExperienceToDelete] = useState<{ id: string; company: string } | null>(null)

  // Ref para almacenar el estado anterior (para rollback en caso de error)
  const previousStateRef = useRef<WorkExperience[]>([])

  /**
   * Carga todas las experiencias laborales
   */
  const fetchWorkExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const workExperiencesData = await WorkExperienceService.getAll()
      setWorkExperiences(workExperiencesData)
    } catch (err) {
      const message = err instanceof WorkExperienceServiceError 
        ? err.message 
        : 'Error desconocido al cargar experiencias laborales'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carga las experiencias laborales al montar el componente
   */
  useEffect(() => {
    fetchWorkExperiences()
  }, [fetchWorkExperiences])

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
  const openEditModal = useCallback((workExperience: WorkExperience) => {
    setFormData({
      period: workExperience.period,
      duration: workExperience.duration,
      company: workExperience.company,
      position: workExperience.position,
      order: workExperience.order,
      active: workExperience.active,
    })
    setFieldErrors({})
    setError(null)
    setModalMode('edit')
    setEditingId(workExperience.id)
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
   * Crea una nueva experiencia laboral con optimistic update
   * 
   * Optimizado para evitar llamadas redundantes a fetchWorkExperiences
   */
  const createWorkExperience = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      setFieldErrors({})
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...workExperiences]

      // Optimistic update
      const optimisticWorkExperience: WorkExperience = {
        id: 'temp-' + Date.now(),
        period: formData.period,
        duration: formData.duration,
        company: formData.company,
        position: formData.position,
        order: formData.order,
        active: formData.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setWorkExperiences(prev => [...prev, optimisticWorkExperience].sort((a, b) => a.order - b.order))

      // Llamar a la API
      const created = await WorkExperienceService.create({
        period: formData.period,
        duration: formData.duration,
        company: formData.company,
        position: formData.position,
        order: formData.order,
        active: formData.active,
      })

      // Reemplazar el optimistic update con el real y mantener orden
      setWorkExperiences(prev => 
        prev
          .map(we => we.id === optimisticWorkExperience.id ? created : we)
          .sort((a, b) => a.order - b.order)
      )

      // Ajustar página si es necesario
      const newTotalPages = Math.ceil((workExperiences.length + 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setWorkExperiences(previousStateRef.current)

      if (err instanceof WorkExperienceServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al crear la experiencia laboral')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, workExperiences, closeModal, currentPage])

  /**
   * Actualiza una experiencia laboral con optimistic update
   * 
   * Optimizado para evitar llamadas redundantes a fetchWorkExperiences
   */
  const updateWorkExperience = useCallback(async (): Promise<boolean> => {
    if (!editingId) return false

    try {
      setError(null)
      setFieldErrors({})
      
      // Encontrar la experiencia laboral existente
      const existingWorkExperience = workExperiences.find(we => we.id === editingId)
      if (!existingWorkExperience) {
        setError('Experiencia laboral no encontrada')
        return false
      }
      
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...workExperiences]

      // Optimistic update
      setWorkExperiences(prev => 
        prev
          .map(we => 
            we.id === editingId 
              ? { ...we, ...formData, updatedAt: new Date().toISOString() }
              : we
          )
          .sort((a, b) => a.order - b.order)
      )

      // Llamar a la API
      const updated = await WorkExperienceService.update(editingId, formData)

      // Reemplazar el optimistic update con el real y mantener orden
      setWorkExperiences(prev => 
        prev
          .map(we => we.id === editingId ? updated : we)
          .sort((a, b) => a.order - b.order)
      )

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setWorkExperiences(previousStateRef.current)

      if (err instanceof WorkExperienceServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al actualizar la experiencia laboral')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [editingId, formData, workExperiences, closeModal])

  /**
   * Abre el modal de confirmación de eliminación
   */
  const openDeleteModal = useCallback((workExperience: WorkExperience) => {
    setWorkExperienceToDelete({ id: workExperience.id, company: workExperience.company })
    setDeleteModalOpen(true)
  }, [])

  /**
   * Cierra el modal de confirmación de eliminación
   */
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setWorkExperienceToDelete(null)
  }, [])

  /**
   * Elimina una experiencia laboral con optimistic update
   */
  const deleteWorkExperience = useCallback(async (): Promise<boolean> => {
    if (!workExperienceToDelete) return false

    try {
      setError(null)
      setDeleting(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...workExperiences]

      // Optimistic update
      setWorkExperiences(prev => prev.filter(we => we.id !== workExperienceToDelete.id))

      // Llamar a la API
      await WorkExperienceService.remove(workExperienceToDelete.id)

      // Ajustar página si es necesario después de eliminar
      const newTotalPages = Math.ceil((workExperiences.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      } else if (newTotalPages === 0) {
        setCurrentPage(1)
      }

      closeDeleteModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setWorkExperiences(previousStateRef.current)

      const message = err instanceof WorkExperienceServiceError 
        ? err.message 
        : 'Error desconocido al eliminar la experiencia laboral'
      setError(message)
      closeDeleteModal()
      return false
    } finally {
      setDeleting(false)
    }
  }, [workExperienceToDelete, workExperiences, closeDeleteModal, currentPage])

  /**
   * Experiencias laborales paginadas
   */
  const paginatedWorkExperiences = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return workExperiences.slice(startIndex, endIndex)
  }, [workExperiences, currentPage])

  /**
   * Total de páginas
   */
  const totalPages = useMemo(() => {
    return Math.ceil(workExperiences.length / ITEMS_PER_PAGE)
  }, [workExperiences.length])

  /**
   * Cambiar página
   */
  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  /**
   * Ajusta la página actual si es necesario después de cambios
   */
  useEffect(() => {
    const newTotalPages = Math.ceil(workExperiences.length / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    } else if (newTotalPages === 0) {
      setCurrentPage(1)
    }
  }, [workExperiences.length, currentPage])

  /**
   * Valida el formulario antes de guardar
   * Extrae errores de campo de Zod si la validación falla
   */
  const validateForm = useCallback((): boolean => {
    // Validación básica de campos requeridos
    const errors: WorkExperienceFieldErrors = {}
    
    if (!formData.period?.trim()) {
      errors.period = 'El período es requerido'
    }
    
    if (!formData.duration?.trim()) {
      errors.duration = 'La duración es requerida'
    }
    
    if (!formData.company?.trim()) {
      errors.company = 'La empresa es requerida'
    }
    
    if (!formData.position?.trim()) {
      errors.position = 'La posición es requerida'
    }
    
    if (formData.order < 0) {
      errors.order = 'El orden no puede ser negativo'
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError('Por favor, corrige los errores en el formulario.')
      return false
    }
    
    setFieldErrors({})
    return true
  }, [formData])

  /**
   * Guarda (crea o actualiza) según el modo del modal
   * Incluye validación del formulario antes de proceder
   */
  const handleSave = useCallback(async () => {
    // Validar formulario antes de guardar
    if (!validateForm()) {
      return false
    }
    
    if (modalMode === 'create') {
      return await createWorkExperience()
    } else if (modalMode === 'edit') {
      return await updateWorkExperience()
    }
    return false
  }, [modalMode, createWorkExperience, updateWorkExperience, validateForm])

  return {
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
    editingId,
    deleteModalOpen,
    workExperienceToDelete,
    
    // Estado del formulario
    formData,
    setFormData,
    fieldErrors,
    
    // Acciones
    fetchWorkExperiences,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    openDeleteModal,
    closeDeleteModal,
    deleteWorkExperience,
    resetForm,
  }
}

