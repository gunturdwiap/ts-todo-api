import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth-service.js";
import { AuthValidation } from "./auth-validation.js";

export const loginHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = AuthValidation.login.parse(req.body);

		const token = await AuthService.login(email, password);

		res.json({
			data: {
				token: token,
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
