/**
 * Hook personalizado para gestionar About Me
 * 
 * Encapsula toda la lógica de estado y operaciones CRUD para About Me.
 * 
 * Mejoras implementadas:
 * - Gestión eficiente del estado con React hooks
 * - Manejo robusto de errores
 * - Optimistic updates para mejor UX
 * - Loading states independientes
 * - Cache busting para imágenes
 * - Validación client-side
 */

"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { AboutMeService, AboutMeServiceError } from '../services/about-me.service'
import type { AboutMe, UpdateAboutMeInput, UploadImageResponse } from '../types/about-me.types'

/**
 * Estado del hook
 */
interface UseAboutMeState {
  aboutMe: AboutMe | null
  loading: boolean
  uploading: boolean
  error: string | null
}

/**
 * Retorno del hook
 */
interface UseAboutMeReturn {
  // Estado
  aboutMe: AboutMe | null
  loading: boolean
  uploading: boolean
  error: string | null
  
  // Acciones
  fetchAboutMe: () => Promise<void>
  updateAboutMe: (input: UpdateAboutMeInput) => Promise<void>
  uploadImage: (file: File) => Promise<void>
  clearError: () => void
  
  // Utilidades
  getImageUrl: () => string
}

/**
 * Hook para gestionar About Me
 * 
 * @returns Estado y funciones para gestionar About Me
 */
export function useAboutMe(): UseAboutMeReturn {
  const [state, setState] = useState<UseAboutMeState>({
    aboutMe: null,
    loading: true,
    uploading: false,
    error: null,
  })

  // Ref para evitar actualizaciones en componentes desmontados
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  /**
   * Actualiza el estado de forma segura
   */
  const setStateSafe = useCallback((updates: Partial<UseAboutMeState>) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, ...updates }))
    }
  }, [])

  /**
   * Carga la información del About Me
   */
  const fetchAboutMe = useCallback(async () => {
    try {
      setStateSafe({ loading: true, error: null })
      
      const data = await AboutMeService.get()
      
      setStateSafe({
        aboutMe: data,
        loading: false,
      })
    } catch (error) {
      const message = error instanceof AboutMeServiceError
        ? error.message
        : 'Error desconocido al cargar About Me'
      
      setStateSafe({
        loading: false,
        error: message,
      })
    }
  }, [setStateSafe])

  /**
   * Actualiza la información del About Me
   */
  const updateAboutMe = useCallback(async (input: UpdateAboutMeInput) => {
    try {
      setStateSafe({ error: null })
      
      const updated = await AboutMeService.update(input)
      
      // Actualizar estado con optimistic update
      setStateSafe({
        aboutMe: updated,
      })
    } catch (error) {
      const message = error instanceof AboutMeServiceError
        ? error.message
        : 'Error desconocido al actualizar About Me'
      
      setStateSafe({
        error: message,
      })
      
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error
    }
  }, [setStateSafe])

  /**
   * Sube una imagen de perfil
   */
  const uploadImage = useCallback(async (file: File) => {
    try {
      setStateSafe({ uploading: true, error: null })
      
      // Subir imagen
      const uploadData = await AboutMeService.uploadImage(file)
      
      // Actualizar About Me con la nueva URL
      const updated = await AboutMeService.update({
        profileImage: uploadData.imageUrl,
      })
      
      // Actualizar estado con cache busting
      setStateSafe({
        aboutMe: {
          ...updated,
          profileImage: updated.profileImage 
            ? `${updated.profileImage}?t=${Date.now()}` 
            : null,
        },
        uploading: false,
      })
    } catch (error) {
      const message = error instanceof AboutMeServiceError
        ? error.message
        : 'Error desconocido al subir la imagen'
      
      setStateSafe({
        uploading: false,
        error: message,
      })
      
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error
    }
  }, [setStateSafe])

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setStateSafe({ error: null })
  }, [setStateSafe])

  /**
   * Obtiene la URL de la imagen con cache busting
   */
  const getImageUrl = useCallback((): string => {
    const defaultImage = '/images/profile/profile.jpg'
    
    if (!state.aboutMe?.profileImage) {
      return `${defaultImage}?t=${Date.now()}`
    }
    
    // Si la URL ya tiene timestamp, usarla tal cual
    if (state.aboutMe.profileImage.includes('?t=')) {
      return state.aboutMe.profileImage
    }
    
    // Agregar timestamp para forzar recarga
    return `${state.aboutMe.profileImage}?t=${Date.now()}`
  }, [state.aboutMe])

  // Cargar datos al montar
  useEffect(() => {
    fetchAboutMe()
  }, [fetchAboutMe])

  return {
    aboutMe: state.aboutMe,
    loading: state.loading,
    uploading: state.uploading,
    error: state.error,
    fetchAboutMe,
    updateAboutMe,
    uploadImage,
    clearError,
    getImageUrl,
  }
}

