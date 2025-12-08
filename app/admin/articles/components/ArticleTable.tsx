/**
 * Componente de tabla para mostrar artículos
 * 
 * Componente reutilizable que muestra la lista de artículos en formato tabla
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
import type { Article } from "../types/article.types"

interface ArticleTableProps {
  articles: Article[]
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  isDeleting: boolean
}

/**
 * Componente de tabla para mostrar artículos
 * 
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const ArticleTable = memo(function ArticleTable({ 
  articles, 
  onEdit, 
  onDelete,
  isDeleting
}: ArticleTableProps) {
  const handleEdit = useCallback((article: Article) => {
    onEdit(article)
  }, [onEdit])

  const handleDelete = useCallback((article: Article) => {
    onDelete(article)
  }, [onDelete])

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/60">No hay artículos creados</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-white/80">Orden</TableHead>
          <TableHead className="text-white/80">Título</TableHead>
          <TableHead className="text-white/80">URL</TableHead>
          <TableHead className="text-center text-white/80">Estado</TableHead>
          <TableHead className="text-center text-white/80">Destacado</TableHead>
          <TableHead className="text-right text-white/80">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id} className="hover:bg-transparent">
            <TableCell className="text-white font-semibold">{article.order}</TableCell>
            <TableCell className="text-white font-semibold max-w-xs truncate">{article.title}</TableCell>
            <TableCell>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm truncate max-w-xs block cursor-pointer"
              >
                {article.url}
              </a>
            </TableCell>
            <TableCell className="text-center">
              {article.active ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Inactivo
                </span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {article.featured ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Sí
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                  No
                </span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(article)}
                  title="Editar"
                  className="cursor-pointer"
                  disabled={isDeleting}
                  aria-label={`Editar ${article.title}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(article)}
                  title="Eliminar"
                  className="cursor-pointer"
                  disabled={isDeleting}
                  aria-label={`Eliminar ${article.title}`}
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

