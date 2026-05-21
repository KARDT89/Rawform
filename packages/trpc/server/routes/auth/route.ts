import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  loginUserWithEmailAndPasswordInputModel,
  loginUserWithEmailAndPasswordOutputModel
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });

      setAuthenticationCookie(ctx, token)

      return { id };
    }),
    loginWithEmailAndPassword: publicProcedure.meta({
      openapi: {
        method: "POST",
        path: getPath("/loginWithEmailAndPassword"),
        tags: TAGS,
      },
    }).input(loginUserWithEmailAndPasswordInputModel).output(loginUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } = await userService.loginWithEmailAndPassword({
        email,
        password,
      });

      setAuthenticationCookie(ctx, token)

      return { id };
    }),
});
