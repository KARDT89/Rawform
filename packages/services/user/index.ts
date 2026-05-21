import db, { eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
} from "./model";
import ApiError from "../utils/api-errors";
import { hashPassword } from "../utils/password-hashing";
import * as JWT from "jsonwebtoken";
import {env} from '../env'

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({id}, env.JWT_SECRET)
    return {token}
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) ApiError.conflict(`User with Email:${email} already exists`);

    const hashedPassword = await hashPassword(password);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ email, fullName, password: hashedPassword })
      .returning({ id: usersTable.id });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      ApiError.badRequest("Something went wrong while creating a user");

    const userId = userInsertResult[0]!.id;

    const {token} = await this.generateUserToken({ id: userId });

    return { id: userId, token };
  }
}


export default UserService;
