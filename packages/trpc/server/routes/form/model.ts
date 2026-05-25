import { z } from "zod";

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
