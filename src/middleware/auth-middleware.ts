import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config.js";

type UserRequest = Request & { user?: JwtPayload | string };

export const authMiddleware = (
	req: UserRequest,
	res: Response,
	next: NextFunction,
): void => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(403).json({ message: "Unauthorized" });
		return; // Explicitly return to stop execution
	}

	try {
		const payload = jwt.verify(token, config.jwtSecretKey);
		req.user = payload;
		console.log("payload : ");
		console.log(payload);
		next(); // Do NOT return next();
	} catch (error) {
		res.status(403).json({ error: "Invalid token" });
		return; // Explicitly return
	}
};
