/**
 * Componente de tabla para mostrar tecnologías
 * 
 * Componente reutilizable que muestra la lista de tecnologías en formato tabla
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
import { CATEGORY_LABELS } from "../constants/technologies.constants"
import type { Technology } from "../types/technology.types"

interface TechnologyTableProps {
  technologies: Technology[]
  onEdit: (technology: Technology) => void
  onDelete: (technology: Technology) => void
  isDeleting: boolean
}

/**
 * Componente de tabla para mostrar tecnologías
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const TechnologyTable = memo(function TechnologyTable({ 
  technologies, 
  onEdit, 
  onDelete,
  isDeleting
}: TechnologyTableProps) {
  const handleEdit = useCallback((technology: Technology) => {
    onEdit(technology)
  }, [onEdit])

  const handleDelete = useCallback((technology: Technology) => {
    onDelete(technology)
  }, [onDelete])

  if (technologies.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No hay tecnologías creadas</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-white/80">Orden</TableHead>
          <TableHead className="text-white/80">Nombre</TableHead>
          <TableHead className="text-white/80">Categoría</TableHead>
          <TableHead className="text-center text-white/80">Estado</TableHead>
          <TableHead className="text-right text-white/80">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technologies.map((technology) => (
          <TableRow key={technology.id} className="hover:bg-transparent">
            <TableCell className="text-white font-semibold">{technology.order}</TableCell>
            <TableCell className="text-white font-semibold">{technology.name}</TableCell>
            <TableCell className="text-white/80">
              {CATEGORY_LABELS[technology.category] || technology.category}
            </TableCell>
            <TableCell className="text-center">
              {technology.active ? (
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
                  onClick={() => handleEdit(technology)}
                  className="text-white hover:bg-white/10 cursor-pointer"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(technology)}
                  className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})

