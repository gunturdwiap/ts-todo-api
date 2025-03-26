import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { prismaClient } from "../../database.js";
import { ResponseError } from "../../error/response-error.js";
import { AuthValidation } from "./auth-validation.js";

export class AuthService {
	static async login(email: string, password: string): Promise<string> {
		const user = await prismaClient.user.findFirst({
			where: {
				email: email,
			},
		});

		if (!user) {
			throw new ResponseError(400, "Invalid username or password");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new ResponseError(400, "Invalid username or password");
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			config.jwtSecretKey,
			{ expiresIn: "1h" },
		);

		return token;
	}

	static async register(
		username: string,
		email: string,
		password: string,
	): Promise<User> {
		const existingUser = await prismaClient.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new ResponseError(400, "Email already in use");
		}

		const user = await prismaClient.user.create({
			data: {
				name: username,
				email: email,
				password: await bcrypt.hash(password, 1),
			},
		});

		// ion think revealing db stuff directly is good
		return user;
	}
}
