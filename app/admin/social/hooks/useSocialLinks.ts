/**
 * Hook personalizado para gestionar Social Links
 * 
 * Encapsula toda la lógica de negocio relacionada con enlaces sociales:
 * - Estado de los enlaces
 * - Operaciones CRUD
 * - Manejo de errores
 * - Estado del formulario
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { SocialLinkService, SocialLinkServiceError } from '../services/social-link.service'
import { validateCreateSocialLink, validateUpdateSocialLink } from '@/lib/validations'
import type { 
  SocialLink, 
  SocialLinkFormData, 
  SocialLinkFieldErrors,
  ModalMode 
} from '../types/social-link.types'

/**
 * Estado inicial del formulario
 */
const INITIAL_FORM_DATA: SocialLinkFormData = {
  label: '',
  url: '',
  icon: '',
  order: 0,
  active: true,
}

/**
 * Hook para gestionar enlaces sociales
 */
export function useSocialLinks() {
  // Estado de los enlaces
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estado del modal
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<SocialLinkFormData>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<SocialLinkFieldErrors>({} as SocialLinkFieldErrors)
  
  // Estado de errores
  const [error, setError] = useState<string | null>(null)
  
  // Estado del modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<{ id: string; label: string } | null>(null)

  // Ref para almacenar el estado anterior (para rollback en caso de error)
  const previousStateRef = useRef<SocialLink[]>([])

  /**
   * Carga todos los enlaces sociales
   */
  const fetchSocialLinks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const links = await SocialLinkService.getAll()
      setSocialLinks(links)
    } catch (err) {
      const message = err instanceof SocialLinkServiceError 
        ? err.message 
        : 'Error desconocido al cargar enlaces'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carga los enlaces al montar el componente
   */
  useEffect(() => {
    fetchSocialLinks()
  }, [fetchSocialLinks])

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    setFieldErrors({} as SocialLinkFieldErrors)
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
  const openEditModal = useCallback((link: SocialLink) => {
    setFormData({
      label: link.label,
      url: link.url,
      icon: link.icon,
      order: link.order,
      active: link.active,
    })
    setFieldErrors({} as SocialLinkFieldErrors)
    setError(null)
    setModalMode('edit')
    setEditingId(link.id)
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
   * Crea un nuevo enlace social con optimistic update
   */
  const createLink = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      setFieldErrors({} as SocialLinkFieldErrors)
      setSaving(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...socialLinks]
      
      // Optimistic update: agregar temporalmente el nuevo enlace
      const optimisticLink: SocialLink = {
        id: `temp-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSocialLinks((prev) => [...prev, optimisticLink])
      
      // Realizar la petición real
      const newLink = await SocialLinkService.create(formData)
      
      // Reemplazar el enlace temporal con el real
      setSocialLinks((prev) => 
        prev.map((link) => link.id === optimisticLink.id ? newLink : link)
      )
      
      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setSocialLinks(previousStateRef.current)
      
      if (err instanceof SocialLinkServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors as SocialLinkFieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al crear enlace')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, socialLinks, closeModal])

  /**
   * Actualiza un enlace social existente con optimistic update
   */
  const updateLink = useCallback(async (): Promise<boolean> => {
    if (!editingId) return false

    try {
      setError(null)
      setFieldErrors({} as SocialLinkFieldErrors)
      setSaving(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...socialLinks]
      
      // Optimistic update: actualizar localmente
      setSocialLinks((prev) =>
        prev.map((link) =>
          link.id === editingId
            ? { ...link, ...formData, updatedAt: new Date().toISOString() }
            : link
        )
      )
      
      // Realizar la petición real
      const updatedLink = await SocialLinkService.update(editingId, formData)
      
      // Actualizar con la respuesta del servidor
      setSocialLinks((prev) =>
        prev.map((link) => (link.id === editingId ? updatedLink : link))
      )
      
      closeModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setSocialLinks(previousStateRef.current)
      
      if (err instanceof SocialLinkServiceError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors as SocialLinkFieldErrors)
          setError('Por favor, corrige los errores en el formulario.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error desconocido al actualizar enlace')
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [editingId, formData, socialLinks, closeModal])

  /**
   * Abre el modal de confirmación de eliminación
   */
  const openDeleteModal = useCallback((link: SocialLink) => {
    setLinkToDelete({ id: link.id, label: link.label })
    setDeleteModalOpen(true)
  }, [])

  /**
   * Cierra el modal de confirmación de eliminación
   */
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setLinkToDelete(null)
  }, [])

  /**
   * Elimina un enlace social con optimistic update
   */
  const deleteLink = useCallback(async (): Promise<boolean> => {
    if (!linkToDelete) return false

    try {
      setError(null)
      setDeleting(true)
      
      // Guardar estado anterior para rollback
      previousStateRef.current = [...socialLinks]
      
      // Optimistic update: eliminar localmente
      setSocialLinks((prev) => prev.filter((link) => link.id !== linkToDelete.id))
      
      // Realizar la petición real
      await SocialLinkService.delete(linkToDelete.id)
      
      closeDeleteModal()
      return true
    } catch (err) {
      // Rollback en caso de error
      setSocialLinks(previousStateRef.current)
      
      const message = err instanceof SocialLinkServiceError 
        ? err.message 
        : 'Error al eliminar enlace'
      setError(message)
      closeDeleteModal()
      return false
    } finally {
      setDeleting(false)
    }
  }, [linkToDelete, socialLinks, closeDeleteModal])

  /**
   * Valida el formulario antes de guardar
   * Extrae errores de campo de Zod si la validación falla
   */
  const validateForm = useCallback((): boolean => {
    try {
      if (modalMode === 'create') {
        validateCreateSocialLink(formData)
      } else if (modalMode === 'edit') {
        validateUpdateSocialLink(formData)
      }
      setFieldErrors({} as SocialLinkFieldErrors)
      return true
    } catch (error) {
      // Extraer errores de campo de Zod
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> }
        const errors: Partial<SocialLinkFieldErrors> = {}
        
        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SocialLinkFormData
          if (field) {
            errors[field] = issue.message
          }
        })
        
        setFieldErrors(errors as SocialLinkFieldErrors)
        setError('Por favor, corrige los errores en el formulario.')
      }
      return false
    }
  }, [formData, modalMode])

  /**
   * Guarda el enlace (crea o actualiza según el modo)
   * Incluye validación en el cliente antes de enviar
   */
  const saveLink = useCallback(async (): Promise<boolean> => {
    // Validación en el cliente antes de enviar
    if (!validateForm()) {
      setError('Por favor, completa todos los campos requeridos.')
      return false
    }

    if (modalMode === 'create') {
      return createLink()
    } else if (modalMode === 'edit') {
      return updateLink()
    }
    return false
  }, [modalMode, createLink, updateLink, validateForm])

  /**
   * Verifica si el formulario es válido (para deshabilitar botón)
   */
  const isFormValid = useMemo(() => {
    return formData.label.trim() !== '' && 
           formData.url.trim() !== '' && 
           formData.icon.trim() !== ''
  }, [formData])

  return {
    // Estado
    socialLinks,
    loading,
    saving,
    deleting,
    error,
    fieldErrors,
    
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
    linkToDelete,
    
    // Acciones
    openCreateModal,
    openEditModal,
    closeModal,
    saveLink,
    openDeleteModal,
    closeDeleteModal,
    deleteLink,
    refetch: fetchSocialLinks,
  }
}

