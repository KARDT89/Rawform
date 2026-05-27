import { router, authenticatedProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService, formFieldService } from "../../services";
import { createFormInputModel, createFormOutputModel, listFormsByUserIdOutputModel, createFieldInput,
  createFieldOutput,
  getFieldsInput,
  getFieldsOutput,
  updateFieldInput,
  updateFieldOutput,
  deleteFieldInput,
  deleteFieldOutput, } from "./model";
import { z } from "zod";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;
      const { id } = await formService.createForm({
        title: title,
        description: description,
        createdBy: ctx.user.id,
      });

      return { id };
    }),
  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(listFormsByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });
      return forms;
    }),
    createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFieldInput)
    .output(createFieldOutput)
    .mutation(async ({ input }) => {
      return await formFieldService.createField(input);
    }),

  getFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFields"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFieldsInput)
    .output(getFieldsOutput)
    .query(async ({ input }) => {
      return await formFieldService.getFields({formId: input.formId });
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFieldInput)
    .output(updateFieldOutput)
    .mutation(async ({ input }) => {
      return await formFieldService.updateField(input);
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFieldInput)
    .output(deleteFieldOutput)
    .mutation(async ({ input }) => {
      return await formFieldService.deleteField(input);
    }),
});
