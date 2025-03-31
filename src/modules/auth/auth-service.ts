import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { prismaClient } from "../../database";
import { ResponseError } from "../../error/response-error";

export class AuthService {
	static async login(
		email: string,
		password: string,
	): Promise<{ token: string; refreshToken: string }> {
		const user = await prismaClient.user.findUnique({ where: { email } });

		if (!user) {
			throw new ResponseError(400, "Invalid username or password");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new ResponseError(400, "Invalid username or password");
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			config.JWT_SECRET_KEY,
			{ expiresIn: "1h" },
		);
		const refreshToken = jwt.sign({ id: user.id }, config.JWT_REFRESH_KEY, {
			expiresIn: "7d",
		});

		// Delete any existing refresh tokens for this user before storing the new one
		await prismaClient.refreshToken.deleteMany({ where: { userId: user.id } });

		await prismaClient.refreshToken.create({
			data: {
				token: await bcrypt.hash(refreshToken, 10), // Store hashed token
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days expiry
				userId: user.id,
			},
		});

		return { token, refreshToken }; // Return raw refreshToken (not hashed)
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
				password: await bcrypt.hash(password, 10),
			},
		});

		// ion think revealing db stuff directly is good
		return user;
	}

	static async refreshToken(
		refreshToken: string,
	): Promise<{ token: string; refreshToken: string }> {
		// Verify the refresh token (catch JWT errors)
		let payload;
		try {
			payload = jwt.verify(refreshToken, config.JWT_REFRESH_KEY) as {
				id: number;
			};
		} catch (error) {
			throw new ResponseError(403, "Invalid refresh token");
		}

		// Find the existing refresh token for this user
		const existingToken = await prismaClient.refreshToken.findFirst({
			where: { userId: payload.id },
			include: { user: true },
		});

		if (!existingToken) {
			throw new ResponseError(401, "Forbidden");
		}

		// Check if token is expired
		if (new Date() > existingToken.expiresAt) {
			await prismaClient.refreshToken.delete({
				where: { id: existingToken.id },
			}); // Cleanup expired token
			throw new ResponseError(401, "Refresh token expired");
		}

		// Compare the stored hashed refresh token with the provided one
		const isTokenValid = await bcrypt.compare(
			refreshToken,
			existingToken.token,
		);
		if (!isTokenValid) {
			throw new ResponseError(401, "Forbidden");
		}

		// Generate new tokens
		const newToken = jwt.sign(
			{ id: existingToken.user.id, email: existingToken.user.email },
			config.JWT_SECRET_KEY,
			{ expiresIn: "1h" },
		);
		const newRefreshToken = jwt.sign(
			{ id: existingToken.user.id },
			config.JWT_REFRESH_KEY,
			{ expiresIn: "7d" },
		);

		// Replace old refresh token with new one
		await prismaClient.refreshToken.update({
			where: { id: existingToken.id },
			data: {
				token: await bcrypt.hash(newRefreshToken, 10),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days expiry
			},
		});

		return { token: newToken, refreshToken: newRefreshToken };
	}
}
