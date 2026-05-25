import db, { eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  LoginUserWithEmailAndPasswordInputType,
  LoginUserWithEmailAndPasswordInput,
} from "./model";
import ApiError from "../utils/api-errors";
import { comparePassword, hashPassword } from "../utils/password-hashing";
import * as JWT from "jsonwebtoken";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationResult;
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired token");
    }
  }

  public async getUserInfoById(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user || user.length === 0) throw ApiError.notFound(`User with ID:${id} does not exist`);
    return user[0]!;
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token };
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

    const { token } = await this.generateUserToken({ id: userId });

    return { id: userId, token };
  }

  public async loginWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputType) {
    const { email, password } = await LoginUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (!existingUserWithEmail)
      throw ApiError.unauthorized(`User with email: ${email} does not exist`);

    if (!existingUserWithEmail.password) throw ApiError.unauthorized("Invalid email or password");

    const isPasswordValid = await comparePassword(password, existingUserWithEmail.password);
    if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

    const { token } = await this.generateUserToken({ id: existingUserWithEmail.id });

    return { id: existingUserWithEmail.id, token };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return { id };
  }
}

export default UserService;
