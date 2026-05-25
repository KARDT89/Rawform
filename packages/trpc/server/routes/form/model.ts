import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().describe("Title of the form"),
  description: z.string().describe("Description of the form"),
  createdBy: z.string().describe("ID of the user who created the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the form generated"),
});