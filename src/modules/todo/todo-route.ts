import { NextFunction, Response, Request, Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware";
import {
	destroyTodoHandler,
	listTodoHandler,
	showTodoHandler,
	storeTodoHandler,
	updateTodoHandler,
} from "./todo-handler";
import { prismaClient } from "../../database";
import { ResponseError } from "../../error/response-error";

export const todoRouter = Router();

todoRouter.use(authMiddleware);

export const authorizeTodoOwner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const todoId = Number(req.params.id);
		const userId = req.auth?.id;

		if (!userId) {
			throw new ResponseError(403, "Forbidden");
		}

		const todo = await prismaClient.todo.findUnique({ where: { id: todoId } });

		if (!todo) {
			throw new ResponseError(404, "Not Found");
		}

		if (todo.authorId !== userId) {
			throw new ResponseError(403, "Forbidden");
		}

		next();
	} catch (error) {
		next(error);
	}
};

todoRouter.get("/", listTodoHandler);

todoRouter.get("/:id", authorizeTodoOwner, showTodoHandler);

todoRouter.post("/", storeTodoHandler);

todoRouter.put("/:id", authorizeTodoOwner, updateTodoHandler);

todoRouter.delete("/:id", authorizeTodoOwner, destroyTodoHandler);
