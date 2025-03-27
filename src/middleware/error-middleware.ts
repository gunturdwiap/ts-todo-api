import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error.js";

export const errorMiddleware = (
	err: ErrorRequestHandler,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ZodError) {
		res.status(400).json({
			errors: err.flatten(),
		});
	} else if (err instanceof ResponseError) {
		res.status(err.status).json({
			message: err.message,
		});
	} else {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
