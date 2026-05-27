'use client'

import { useState } from "react"
import {
  AlignLeft,
  Mail,
  Hash,
  ToggleLeft,
  KeyRound,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { EditFieldSheet, type FieldData, type FieldType } from "~/components/edit-field-sheet"
import { useDeleteField } from "~/hooks/api/form"

const FIELD_TYPE_ICONS: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  TEXT: AlignLeft,
  EMAIL: Mail,
  NUMBER: Hash,
  "YES-NO": ToggleLeft,
  PASSWORD: KeyRound,
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text",
  EMAIL: "Email",
  NUMBER: "Number",
  "YES-NO": "Yes / No",
  PASSWORD: "Password",
}

interface FieldRowProps {
  field: FieldData
}

export function FieldRow({ field }: FieldRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const { deleteFieldAsync, status } = useDeleteField()

  const isDeleting = status === "pending"
  const Icon = FIELD_TYPE_ICONS[field.type] ?? AlignLeft

  async function handleDelete() {
    await deleteFieldAsync({ fieldId: field.id })
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow">
        {/* Type icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>

        {/* Field info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{field.label}</span>
            <Badge variant="outline" className="text-xs font-normal">
              {FIELD_TYPE_LABELS[field.type] ?? field.type}
            </Badge>
            {field.isRequired && (
              <Badge variant="secondary" className="text-xs font-normal">
                Required
              </Badge>
            )}
          </div>
          {field.placeholder && (
            <p className="text-xs text-muted-foreground/70 mt-0.5 truncate italic">
              {field.placeholder}
            </p>
          )}
          {field.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {field.description}
            </p>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete field?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete{" "}
                  <strong className="text-foreground">{field.label}</strong>. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditFieldSheet
        field={field}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
