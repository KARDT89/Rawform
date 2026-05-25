import { router, authenticatedProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import { createFormInputModel, createFormOutputModel, listFormsByUserIdOutputModel } from "./model";
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
});
