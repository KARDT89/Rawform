"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { useGetFields, useListForms } from "~/hooks/api/form"
import { AddFieldModal } from "~/components/add-field-modal"
import { FieldRow } from "~/components/field-row"

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const { fields, isLoading: fieldsLoading } = useGetFields(id)
  const { forms, isLoading: formsLoading } = useListForms()

  const form = forms?.find((f) => f.id === id)
  const sortedFields = [...(fields ?? [])].sort((a, b) => a.index - b.index)

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
          <Link href="/dashboard/forms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1 min-w-0">
          {formsLoading ? (
            <>
              <Skeleton className="h-7 w-52 mb-2" />
              <Skeleton className="h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold leading-tight truncate">
                {form?.title ?? "Form Builder"}
              </h1>
              {form?.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {form.description}
                </p>
              )}
            </>
          )}
        </div>

        <AddFieldModal formId={id} />
      </div>

      {/* Field list */}
      {fieldsLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-17 w-full rounded-lg" />
          ))}
        </div>
      ) : sortedFields.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-20 text-center">
          <div>
            <p className="font-medium text-sm">No fields yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first field to start building your form.
            </p>
          </div>
          <AddFieldModal formId={id} variant="empty" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs text-muted-foreground">
            {sortedFields.length} field{sortedFields.length !== 1 ? "s" : ""}
          </p>
          {sortedFields.map((field) => (
            <FieldRow key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}
