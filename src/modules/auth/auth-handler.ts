import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth-service";
import { AuthValidation } from "./auth-validation";
import z from "zod";

export const loginHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = AuthValidation.login.parse(req.body);

		const { token, refreshToken } = await AuthService.login(email, password);

		res.json({
			data: {
				token: token,
				refreshToken: refreshToken,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const registerHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password, username } = AuthValidation.register.parse(
			req.body,
		);

		const user = await AuthService.register(username, email, password);

		res.status(201).json({
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

export const refreshTokenHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { refreshToken } = z
			.object({ refreshToken: z.string() })
			.parse(req.body);

		const token = await AuthService.refreshToken(refreshToken);

		res.json({
			token: token,
		});
	} catch (error) {
		next(error);
	}
};
