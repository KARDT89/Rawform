import { db } from "@repo/database";

import {
  createFieldInput,
  CreateFieldInputType,
  updateFieldInput,
  UpdateFieldInputType,
  deleteFieldInput,
  DeleteFieldInputType,
  GetFieldsInputType,
  getFieldsInput,
} from "./model";
import { max } from "@repo/database";
import { formsFieldsTable } from "@repo/database/models/form-field";
import ApiError from "../utils/api-errors";
import { eq, asc } from "@repo/database";

export function toLabelKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

class FormFieldService {
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({
        maxIndex: max(formsFieldsTable.index),
      })
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.formId, formId));

    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;

    return next.toFixed(2);
  }
  public async createField(payload: CreateFieldInputType) {
    const { label, description, placeholder, isRequired, type, formId } =
      await createFieldInput.parseAsync(payload);

    const labelKey = toLabelKey(label);
    const index = await this.getNextIndex(formId);

    const result = await db
      .insert(formsFieldsTable)
      .values({ label, labelKey, description, placeholder, isRequired, index, type, formId })
      .returning({
        id: formsFieldsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new ApiError(500, "Failed to create field");
    }

    return {
      id: result[0].id,
      labelKey,
      index,
    };
  }

  public async getFields(payload: GetFieldsInputType) {
    const { formId } = await getFieldsInput.parseAsync(payload);

    const fields = await db
      .select({
        id: formsFieldsTable.id,
        label: formsFieldsTable.label,
        labelKey: formsFieldsTable.labelKey,
        description: formsFieldsTable.description,
        placeholder: formsFieldsTable.placeholder,
        isRequired: formsFieldsTable.isRequired,
        index: formsFieldsTable.index,
        type: formsFieldsTable.type,
      })
      .from(formsFieldsTable)
      .where(eq(formsFieldsTable.formId, formId))
      .orderBy(asc(formsFieldsTable.index));

    return fields.map((field) => ({
      ...field,
      index: Number(field.index),
    }));
  }
  public async updateField(payload: UpdateFieldInputType) {
    const { fieldId, ...updates } =
      await updateFieldInput.parseAsync(payload);

      const patch: Partial<typeof formsFieldsTable.$inferInsert> = {}
      if(updates.label !== undefined) patch.label = updates.label;
      if(updates.type !== undefined) patch.type = updates.type;
      if('description' in updates) patch.description = updates.description ?? null;
      if('placeholder' in updates) patch.placeholder = updates.placeholder ?? null;
      if(updates.isRequired !== undefined) patch.isRequired = updates.isRequired;

      if(Object.keys(patch).length === 0) {
        throw new ApiError(400, "No valid fields to update");
      }
      
    const result = await db
      .update(formsFieldsTable)
      .set(patch)
      .where(eq(formsFieldsTable.id, fieldId))
      .returning({ id: formsFieldsTable.id });

      if (!result || result.length === 0 || !result[0]?.id) throw new ApiError(404, "Field not found");

    return { id: result[0].id };
    
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { fieldId } = await deleteFieldInput.parseAsync(payload);

    const result = await db
      .delete(formsFieldsTable)
      .where(eq(formsFieldsTable.id, fieldId))
      .returning({ id: formsFieldsTable.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new ApiError(404, "Field not found");
    }

    return { id: result[0].id };
  }
}

export default FormFieldService;
