import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { formsTable } from "../schema";

export interface FormSubmissionValue {
  formId: string;
  value: string;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export const formSubmissionTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").references(() => formsTable.id),

  values: text("values").$type<FormSubmissionValueRow>(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
