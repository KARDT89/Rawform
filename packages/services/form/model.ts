import {z} from 'zod';

export const createFormInput = z.object({
    title: z.string().describe("Title of the form"),
    description: z.string().describe("Description of the form").optional(),
    createdBy: z.string().describe("UUID of the user creating the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;