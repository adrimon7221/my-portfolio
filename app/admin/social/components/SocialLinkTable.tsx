/**
 * Componente de tabla para mostrar enlaces sociales
 * 
 * Componente reutilizable que muestra la lista de enlaces en formato tabla
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
import type { SocialLink } from "../types/social-link.types"

interface SocialLinkTableProps {
  socialLinks: SocialLink[]
  onEdit: (link: SocialLink) => void
  onDelete: (link: SocialLink) => void
}

/**
 * Componente de tabla para mostrar enlaces sociales
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const SocialLinkTable = memo(function SocialLinkTable({ 
  socialLinks, 
  onEdit, 
  onDelete 
}: SocialLinkTableProps) {
  const handleEdit = useCallback((link: SocialLink) => {
    onEdit(link)
  }, [onEdit])

  const handleDelete = useCallback((link: SocialLink) => {
    onDelete(link)
  }, [onDelete])
  if (socialLinks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No hay enlaces sociales creados</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-white/80">Orden</TableHead>
          <TableHead className="text-white/80">Label</TableHead>
          <TableHead className="text-white/80">URL</TableHead>
          <TableHead className="text-white/80">Icono</TableHead>
          <TableHead className="text-center text-white/80">Estado</TableHead>
          <TableHead className="text-right text-white/80">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {socialLinks.map((link) => (
          <TableRow key={link.id} className="hover:bg-transparent">
            <TableCell className="text-white font-semibold">{link.order}</TableCell>
            <TableCell className="text-white font-semibold">{link.label}</TableCell>
            <TableCell>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm truncate max-w-xs block cursor-pointer"
              >
                {link.url}
              </a>
            </TableCell>
            <TableCell>
              <code className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                {link.icon}
              </code>
            </TableCell>
            <TableCell className="text-center">
              {link.active ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Inactivo
                </span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(link)}
                  title="Editar"
                  className="cursor-pointer"
                  aria-label={`Editar ${link.label}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(link)}
                  title="Eliminar"
                  className="cursor-pointer"
                  aria-label={`Eliminar ${link.label}`}
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

