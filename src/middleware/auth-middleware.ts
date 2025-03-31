import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prismaClient } from "../database";
import { ResponseError } from "../error/response-error";

export const authMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			throw new ResponseError(403, "Unauthorized");
		}
		const payload = jwt.verify(token, config.JWT_SECRET_KEY) as { id: number };

		const user = await prismaClient.user.findUnique({
			where: {
				id: payload.id,
			},
		});

		if (!user) {
			throw new ResponseError(403, "Unauthorized");
		}

		req.auth = {
			id: user.id,
			email: user.email,
		};

		next();
	} catch (error) {
		next(error);
	}
};
