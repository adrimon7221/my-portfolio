/**
 * Componente de tabla para mostrar proyectos
 * 
 * Componente reutilizable que muestra la lista de proyectos en formato tabla
 */

"use client"

import { memo, useCallback } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Project } from "../types/project.types"

interface ProjectTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  isDeleting: boolean
}

/**
 * Componente de tabla para mostrar proyectos
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const ProjectTable = memo(function ProjectTable({ 
  projects, 
  onEdit, 
  onDelete,
  isDeleting
}: ProjectTableProps) {
  const handleEdit = useCallback((project: Project) => {
    onEdit(project)
  }, [onEdit])

  const handleDelete = useCallback((project: Project) => {
    onDelete(project)
  }, [onDelete])

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No hay proyectos creados</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-white/80">Orden</TableHead>
          <TableHead className="text-white/80">Título</TableHead>
          <TableHead className="text-white/80">Tags</TableHead>
          <TableHead className="text-center text-white/80">Estado</TableHead>
          <TableHead className="text-right text-white/80">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id} className="hover:bg-transparent">
            <TableCell className="text-white font-semibold">{project.order}</TableCell>
            <TableCell className="text-white font-semibold">{project.title}</TableCell>
            <TableCell className="text-white/80">
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-white/10 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white/10 text-white/80">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {project.active ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Inactivo
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  aria-label={`Editar proyecto ${project.title}`}
                  className="text-white hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project)}
                  aria-label={`Eliminar proyecto ${project.title}`}
                  className="text-red-400 hover:bg-red-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})

