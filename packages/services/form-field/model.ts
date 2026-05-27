import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "EMAIL", "NUMBER", "YES-NO", "PASSWORD"]);

export const createFieldInput = z.object({
  label: z.string().max(100).describe("Label of the form field"),
  type: fieldTypeEnum.describe("Type of the form field"),
  formId: z.string().uuid().describe("ID of the form this field belongs to"),

  description: z.string().optional().describe("Description of the form field"),

  placeholder: z.string().optional().describe("Placeholder text for the form field"),

  isRequired: z.boolean().optional().default(false).describe("Whether the form field is required"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
  fieldId: z.string().uuid().describe("ID of the form field to update"),
  label: z.string().max(100).describe("Label of the form field"),
  type: fieldTypeEnum.describe("Type of the form field"),

  description: z.string().optional().describe("Description of the form field"),

  placeholder: z.string().optional().describe("Placeholder text for the form field"),

  isRequired: z.boolean().optional().default(false).describe("Whether the form field is required"),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
  fieldId: z.string().uuid(),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldsInput = z.object({
  formId: z.string().uuid(),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInput>;
