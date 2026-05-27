import { z } from "zod";

const fieldTypeEnum = z.enum([
  "TEXT",
  "EMAIL",
  "NUMBER",
  'YES-NO',
  "PASSWORD"
]);

export const createFormInputModel = z.object({
  title: z.string().describe("Title of the form"),
  description: z.string().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the form generated"),
});

export const listFormsByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().optional().describe("Description of the form"),
    createdAt: z.date().nullable().describe("Timestamp when the form was created"),
    updatedAt: z.date().nullable().describe("Timestamp when the form was last updated"),
  }),
);

export const createFieldInput = z.object({
  formId: z.string().uuid(),
  label: z.string().min(1),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().default(false),
  type: fieldTypeEnum,
});


export const createFieldOutput = z.object({
  id: z.string().uuid().describe("ID of the created field"),
  labelKey: z.string().describe("Slugified key derived from label"),
  index: z.string().describe("Decimal ordering index assigned to the field"),
});


export const getFieldsInput = z.object({
  formId: z.string().uuid().describe("ID of the form whose fields to fetch"),
});


export const getFieldsOutput = z.array(
  z.object({
    id: z.string().uuid(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    index: z.number().describe("Numeric ordering index"),
    type: fieldTypeEnum,
  }),
);


export const updateFieldInput = z.object({
  fieldId: z.string().uuid().describe("ID of the field to update"),
  label: z.string().min(1),
  type: fieldTypeEnum,
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().optional().default(false),
});


export const updateFieldOutput = z.object({
  id: z.string().uuid().describe("ID of the updated field"),
});


export const deleteFieldInput = z.object({
  fieldId: z.string().uuid().describe("ID of the field to delete"),
});


export const deleteFieldOutput = z.object({
  id: z.string().uuid().describe("ID of the deleted field"),
});

