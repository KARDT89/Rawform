'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateField } from "~/hooks/api/form"
import { Button } from "~/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const FIELD_TYPES = ["TEXT", "EMAIL", "NUMBER", "YES-NO", "PASSWORD"] as const

export type FieldType = typeof FIELD_TYPES[number]

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text",
  EMAIL: "Email",
  NUMBER: "Number",
  "YES-NO": "Yes / No",
  PASSWORD: "Password",
}

export interface FieldData {
  id: string
  label: string
  labelKey: string
  type: FieldType
  description?: string | null
  placeholder?: string | null
  isRequired: boolean
  index: number
}

const editFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(["TEXT", "EMAIL", "NUMBER", "YES-NO", "PASSWORD"]),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().default(false),
})

type EditFieldValues = z.infer<typeof editFieldSchema>

interface EditFieldSheetProps {
  field: FieldData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFieldSheet({ field, open, onOpenChange }: EditFieldSheetProps) {
  const { updateFieldAsync, status } = useUpdateField()

  const form = useForm<EditFieldValues>({
    resolver: zodResolver(editFieldSchema),
    defaultValues: {
      label: "",
      type: "TEXT",
      description: "",
      placeholder: "",
      isRequired: false,
    },
  })

  const isPending = status === "pending"

  useEffect(() => {
    if (field && open) {
      form.reset({
        label: field.label,
        type: field.type,
        description: field.description ?? "",
        placeholder: field.placeholder ?? "",
        isRequired: field.isRequired,
      })
    }
  }, [field, open, form])

  async function onSubmit(values: EditFieldValues) {
    if (!field) return
    await updateFieldAsync({
      fieldId: field.id,
      label: values.label,
      type: values.type,
      description: values.description || undefined,
      placeholder: values.placeholder || undefined,
      isRequired: values.isRequired,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Field</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-4 px-1"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Full Name"
                      disabled={isPending}
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={f.onChange}
                    value={f.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {FIELD_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>
                    Placeholder{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Enter your full name"
                      disabled={isPending}
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Help text shown below the field"
                      rows={2}
                      disabled={isPending}
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field: f }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Make this field mandatory
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={f.value}
                      onCheckedChange={f.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
