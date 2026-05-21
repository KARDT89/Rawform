import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.email().describe("Email address of the user"),
  password: z.string().describe("Password of the user"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("id of the user created"),
});

export const loginUserWithEmailAndPasswordInputModel = z.object({
  email: z.email().describe("Email address of the user"),
  password: z.string().describe("Password of the user"),
});

export const loginUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("id of the user logged in"),
});

export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutputModel = z.object({
  id: z.string().describe("id of the user logged in"),
  email: z.email().describe("Email address of the user"),
  fullName: z.string().describe("Full name of the user"),
  profileImageUrl: z.string().describe("URL of the user's profile image").optional(),
});
