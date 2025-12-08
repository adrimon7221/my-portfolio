/**
 * Hook personalizado para gestionar Projects
 * 
 * Encapsula toda la lógica de negocio relacionada con proyectos:
 * - Estado de los proyectos
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
import { ProjectService, ProjectServiceError } from '../services/project.service'
import { ITEMS_PER_PAGE, MAX_ACTIVE_PROJECTS, getProjectImagesLimitByCollageType } from '../constants/projects.constants'
import type { 
  Project, 
  ProjectFormData, 
  ProjectFieldErrors,
  ModalMode
} from '../types/project.types'

/**
 * Estado inicial del formulario
 */
const INITIAL_FORM_DATA: ProjectFormData = {
  title: '',
  description: '',
  image: '',
  images: [],
  tags: [],
  demoUrl: '',
  githubUrl: '',
  order: 0,
  collageType: 'first',
  active: true,
}

/**
 * Hook para gestionar proyectos
 */
export function useProjects() {
  // Estado de los proyectos
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado del modal
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<ProjectFieldErrors>({})
  
  // Estado de errores
  const [error, setError] = useState<string | null>(null)
  
  // Estado del modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null)

  // Ref para almacenar el estado anterior (para rollback en caso de error)
  const previousStateRef = useRef<Project[]>([])

  /**
   * Carga todos los proyectos
   */
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const projectsData = await ProjectService.getAll()
      setProjects(projectsData)
    } catch (err) {
      const message = err instanceof ProjectServiceError 
        ? err.message 
        : 'Error desconocido al cargar proyectos'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carga los proyectos al montar el componente
   */
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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
  const openEditModal = useCallback((project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      images: project.images || [],
      tags: project.tags,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      order: project.order,
      collageType: project.collageType,
      active: project.active,
    })
    setFieldErrors({})
    setError(null)
    setModalMode('edit')
    setEditingId(project.id)
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
   * Crea un nuevo proyecto con optimistic update
   * 
   * Optimizado para evitar llamadas redundantes a fetchProjects
   */
  const createProject = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      setFieldErrors({})
      
      // Validar límite de proyectos activos
      if (formData.active === true) {
        const activeCount = projects.filter(p => p.active).length
        if (activeCount >= MAX_ACTIVE_PROJECTS) {
          setError(`No se pueden tener más de ${MAX_ACTIVE_PROJECTS} proyectos activos. Desactiva otro proyecto primero.`)
          return false
        }
      }
      
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...projects]

      // Optimistic update
      const optimisticProject: Project = {
        id: 'temp-' + Date.now(),
        title: formData.title,
        description: formData.description,
        image: formData.image || '',
        images: formData.images.length > 0 ? formData.images : null,
        tags: formData.tags,
        demoUrl: formData.demoUrl || null,
        githubUrl: formData.githubUrl || null,
        order: formData.order,
        collageType: formData.collageType,
        active: formData.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setProjects(prev => [...prev, optimisticProject].sort((a, b) => a.order - b.order))

      // Llamar a la API
      const created = await ProjectService.create({
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        tags: formData.tags,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        order: formData.order,
        collageType: formData.collageType,
        active: formData.active,
      })

      // Reemplazar el optimistic update con el real y mantener orden
      setProjects(prev => 
        prev
          .map(p => p.id === optimisticProject.id ? created : p)
          .sort((a, b) => a.order - b.order)
      )

      // Ajustar página si es necesario
      const newTotalPages = Math.ceil((projects.length + 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setProjects(previousStateRef.current)

      if (err instanceof ProjectServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al crear el proyecto')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, projects, closeModal, currentPage])

  /**
   * Actualiza un proyecto con optimistic update
   * 
   * Optimizado para evitar llamadas redundantes a fetchProjects
   */
  const updateProject = useCallback(async (): Promise<boolean> => {
    if (!editingId) return false

    try {
      setError(null)
      setFieldErrors({})
      
      // Encontrar el proyecto existente
      const existingProject = projects.find(p => p.id === editingId)
      if (!existingProject) {
        setError('Proyecto no encontrado')
        return false
      }
      
      // Validar límite de proyectos activos (solo si se está intentando activar)
      if (formData.active === true && existingProject.active === false) {
        const activeCount = projects.filter(p => p.active).length
        if (activeCount >= MAX_ACTIVE_PROJECTS) {
          setError(`No se pueden tener más de ${MAX_ACTIVE_PROJECTS} proyectos activos. Desactiva otro proyecto primero.`)
          return false
        }
      }
      
      setSaving(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...projects]

      // Optimistic update
      setProjects(prev => 
        prev
          .map(p => 
            p.id === editingId 
              ? { 
                  ...p, 
                  ...formData,
                  images: formData.images.length > 0 ? formData.images : null,
                  demoUrl: formData.demoUrl || null,
                  githubUrl: formData.githubUrl || null,
                  collageType: formData.collageType,
                  updatedAt: new Date().toISOString() 
                }
              : p
          )
          .sort((a, b) => a.order - b.order)
      )

      // Llamar a la API (no incluir order, ya que no se puede cambiar)
      const updated = await ProjectService.update(editingId, {
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        tags: formData.tags,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        // order no se incluye porque no se puede cambiar después de crear
        collageType: formData.collageType,
        active: formData.active,
      })

      // Reemplazar el optimistic update con el real y mantener orden
      setProjects(prev => 
        prev
          .map(p => p.id === editingId ? updated : p)
          .sort((a, b) => a.order - b.order)
      )

      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setProjects(previousStateRef.current)

      if (err instanceof ProjectServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al actualizar el proyecto')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [editingId, formData, projects, closeModal])

  /**
   * Abre el modal de confirmación de eliminación
   */
  const openDeleteModal = useCallback((project: Project) => {
    setProjectToDelete({ id: project.id, title: project.title })
    setDeleteModalOpen(true)
  }, [])

  /**
   * Cierra el modal de confirmación de eliminación
   */
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setProjectToDelete(null)
  }, [])

  /**
   * Elimina un proyecto con optimistic update
   */
  const deleteProject = useCallback(async (): Promise<boolean> => {
    if (!projectToDelete) return false

    try {
      setError(null)
      setDeleting(true)

      // Guardar estado anterior para rollback
      previousStateRef.current = [...projects]

      // Optimistic update
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))

      // Llamar a la API
      await ProjectService.remove(projectToDelete.id)

      // Ajustar página si es necesario después de eliminar
      const newTotalPages = Math.ceil((projects.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      } else if (newTotalPages === 0) {
        setCurrentPage(1)
      }

      closeDeleteModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setProjects(previousStateRef.current)

      const message = err instanceof ProjectServiceError 
        ? err.message 
        : 'Error desconocido al eliminar el proyecto'
      setError(message)
      closeDeleteModal()
      return false
    } finally {
      setDeleting(false)
    }
  }, [projectToDelete, projects, closeDeleteModal, currentPage])

  /**
   * Proyectos paginados
   */
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return projects.slice(startIndex, endIndex)
  }, [projects, currentPage])

  /**
   * Total de páginas
   */
  const totalPages = useMemo(() => {
    return Math.ceil(projects.length / ITEMS_PER_PAGE)
  }, [projects.length])

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
    const newTotalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    } else if (newTotalPages === 0) {
      setCurrentPage(1)
    }
  }, [projects.length, currentPage])

  /**
   * Valida el formulario antes de guardar
   * Validación exhaustiva de todos los campos
   */
  const validateForm = useCallback((): boolean => {
    const errors: ProjectFieldErrors = {}
    
    // Validar título
    if (!formData.title?.trim()) {
      errors.title = 'El título es requerido'
    } else if (formData.title.trim().length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres'
    } else if (formData.title.trim().length > 100) {
      errors.title = 'El título no puede tener más de 100 caracteres'
    }
    
    // Validar descripción
    if (!formData.description?.trim()) {
      errors.description = 'La descripción es requerida'
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres'
    }
    
    // Validar tags
    if (formData.tags.length === 0) {
      errors.tags = 'Debe tener al menos un tag'
    } else if (formData.tags.length > 20) {
      errors.tags = 'No puede tener más de 20 tags'
    } else {
      // Validar que cada tag no esté vacío
      const emptyTags = formData.tags.some(tag => !tag.trim())
      if (emptyTags) {
        errors.tags = 'Los tags no pueden estar vacíos'
      }
    }
    
    // Validar orden
    if (formData.order < 0 || formData.order > 2) {
      errors.order = 'El orden debe ser 0, 1 o 2'
    }
    
    // Validar collageType
    if (!['first', 'second', 'third'].includes(formData.collageType)) {
      errors.collageType = 'Tipo de collage inválido'
    }
    
    // Validar número de imágenes según el tipo de collage
    const imagesLimit = getProjectImagesLimitByCollageType(formData.collageType)
    if (formData.images.length !== imagesLimit) {
      errors.images = `Este proyecto con collage tipo "${formData.collageType}" debe tener exactamente ${imagesLimit} imágenes adicionales (actualmente tiene ${formData.images.length})`
    }
    
    // Validar URLs si están presentes
    if (formData.demoUrl && formData.demoUrl.trim()) {
      try {
        new URL(formData.demoUrl)
      } catch {
        errors.demoUrl = 'La URL del demo no es válida'
      }
    }
    
    if (formData.githubUrl && formData.githubUrl.trim()) {
      try {
        new URL(formData.githubUrl)
      } catch {
        errors.githubUrl = 'La URL de GitHub no es válida'
      }
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
      return await createProject()
    } else if (modalMode === 'edit') {
      return await updateProject()
    }
    return false
  }, [modalMode, createProject, updateProject, validateForm])

  return {
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
    fetchProjects,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    openDeleteModal,
    closeDeleteModal,
    deleteProject,
    resetForm,
  }
}

