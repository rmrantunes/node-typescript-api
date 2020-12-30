import config from "config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LeanDocument } from "mongoose";
import { User, UserModel } from "@src/models/user";

export interface DecodedUser extends Omit<User, "_id"> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(
    payload: LeanDocument<UserModel> | Record<string, unknown>,
  ): string {
    return jwt.sign(payload, config.get("App.auth.key"), {
      expiresIn: config.get("App.auth.tokenExpiresIn"),
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get("App.auth.key")) as DecodedUser;
  }
}
