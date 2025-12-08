/**
 * Componente de tabla para mostrar experiencias laborales
 * 
 * Componente reutilizable que muestra la lista de experiencias laborales en formato tabla
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
import type { WorkExperience } from "../types/work-experience.types"

interface WorkExperienceTableProps {
  workExperiences: WorkExperience[]
  onEdit: (workExperience: WorkExperience) => void
  onDelete: (workExperience: WorkExperience) => void
  isDeleting: boolean
}

/**
 * Componente de tabla para mostrar experiencias laborales
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const WorkExperienceTable = memo(function WorkExperienceTable({ 
  workExperiences, 
  onEdit, 
  onDelete,
  isDeleting
}: WorkExperienceTableProps) {
  const handleEdit = useCallback((workExperience: WorkExperience) => {
    onEdit(workExperience)
  }, [onEdit])

  const handleDelete = useCallback((workExperience: WorkExperience) => {
    onDelete(workExperience)
  }, [onDelete])

  if (workExperiences.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No hay experiencias laborales creadas</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-white/80">Orden</TableHead>
          <TableHead className="text-white/80">Período</TableHead>
          <TableHead className="text-white/80">Duración</TableHead>
          <TableHead className="text-white/80">Empresa</TableHead>
          <TableHead className="text-white/80">Posición</TableHead>
          <TableHead className="text-center text-white/80">Estado</TableHead>
          <TableHead className="text-right text-white/80">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workExperiences.map((workExperience) => (
          <TableRow key={workExperience.id} className="hover:bg-transparent">
            <TableCell className="text-white font-semibold">{workExperience.order}</TableCell>
            <TableCell className="text-white/80">{workExperience.period}</TableCell>
            <TableCell className="text-white/80">{workExperience.duration}</TableCell>
            <TableCell className="text-white font-semibold">{workExperience.company}</TableCell>
            <TableCell className="text-white/80 max-w-xs truncate">{workExperience.position}</TableCell>
            <TableCell className="text-center">
              {workExperience.active ? (
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
                  onClick={() => handleEdit(workExperience)}
                  className="text-white hover:bg-white/10 cursor-pointer"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(workExperience)}
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

