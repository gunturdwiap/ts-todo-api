import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../database.js";
import { ResponseError } from "../../error/response-error.js";
import { TodoValidation } from "./todo-validation.js";
import { TodoService } from "./todo-service.js";
import { z } from "zod";

export const listTodoHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { page, limit } = z
			.object({
				page: z.coerce.number().int().min(1).default(1),
				limit: z.coerce.number().int().min(1).max(100).default(10),
			})
			.parse(req.query);

		const { todos, total } = await TodoService.all(
			req.auth?.id as number,
			page,
			limit,
		);

		res.json({
			data: todos,
			page: page,
			limit: limit,
			total: total,
		});
	} catch (error) {
		next(error);
	}
};

export const showTodoHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const todo = await TodoService.get(Number(req.params.id));

		if (!todo) {
			throw new ResponseError(404, "Not Found");
		}

		res.json({
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

export const storeTodoHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { title, description } = TodoValidation.store.parse(req.body);

		const todo = await TodoService.store(
			title,
			description,
			req.auth?.id as number,
		);

		res.status(201).json({
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

export const updateTodoHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const todo = await TodoService.get(Number(req.params.id));

		if (!todo) {
			throw new ResponseError(404, "Not Found");
		}

		const { title, description } = TodoValidation.update.parse(req.body);

		const updatedTodo = await TodoService.update(todo.id, title, description);

		res.status(201).json({
			data: updatedTodo,
		});
	} catch (error) {
		next(error);
	}
};

export const destroyTodoHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const todo = await TodoService.get(Number(req.params.id));

		if (!todo) {
			throw new ResponseError(404, "Not Found");
		}

		const deletedTodo = await TodoService.delete(todo.id);

		res.json({
			data: {},
		});
	} catch (error) {
		next(error);
	}
};
