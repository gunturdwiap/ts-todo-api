import { todo } from "node:test";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware.js";

// TODO: Implement try  cuz async

const prisma = new PrismaClient();

export const todoRouter = Router();

todoRouter.use(authMiddleware);

todoRouter.get("/", async (req, res, next) => {
	const todos = await prisma.todo.findMany();

	res.json({
		data: todos,
	});
});

todoRouter.get("/:id", async (req, res, next): Promise<any> => {
	const todo = await prisma.todo.findFirst({
		where: {
			id: Number.parseInt(req.params.id),
		},
	});

	if (!todo) {
		return res.status(404).json({
			message: "Not Found",
		});
	}

	res.json({
		data: todo,
	});
});

todoRouter.post("/", async (req, res, next): Promise<any> => {
	const { title, description } = req.body;

	if (!title) {
		return res.status(403).json({
			message: "Title is required",
		});
	}

	const todo = await prisma.todo.create({
		data: {
			title: title,
			description: description,
			authorId: 1,
		},
	});

	res.status(201).json({
		data: todo,
	});
});

todoRouter.put("/:id", async (req, res, next): Promise<any> => {
	const todo = await prisma.todo.findFirst({
		where: {
			id: Number.parseInt(req.params.id),
		},
	});

	if (!todo) {
		return res.status(404).json({
			message: "Not Found",
		});
	}

	const { title, description } = req.body;

	const updatedTodo = await prisma.todo.update({
		where: {
			id: todo.id,
		},
		data: {
			title: title,
			description: description,
			authorId: 1,
		},
	});

	res.status(201).json({
		data: updatedTodo,
	});
});

todoRouter.delete("/:id", async (req, res, next): Promise<any> => {
	const todo = await prisma.todo.findFirst({
		where: {
			id: Number.parseInt(req.params.id),
		},
	});

	if (!todo) {
		return res.status(404).json({
			message: "Not Found",
		});
	}

	await prisma.todo.delete({
		where: {
			id: todo.id,
		},
	});

	res.json({
		data: {},
	});
});
