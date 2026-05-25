"use client"

import { CreateFormModal } from "~/components/create-form-modal"
import Link from "next/link"
import { useListForms } from "~/hooks/api/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Pencil } from "lucide-react"

export default function FormsPage() {
  const { forms, isLoading } = useListForms()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Forms</h1>
        <CreateFormModal />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : !forms?.length ? (
        <p className="text-sm text-muted-foreground">No forms yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {form.description ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {form.createdAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                      }).format(new Date(form.createdAt))
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/form/${form.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}