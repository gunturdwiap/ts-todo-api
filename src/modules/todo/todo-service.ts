import { Todo } from "@prisma/client";
import { prismaClient } from "../../database";

export class TodoService {
	static async all(
		userId: number,
		page: number = 1,
		limit: number = 10,
	): Promise<{ todos: Todo[]; total: number }> {
		const todos = await prismaClient.todo.findMany({
			skip: (page-1) * limit,
			take: limit,
			where: {
				authorId: userId,
			},
		});

		const total = await prismaClient.todo.count({
			where: {
				authorId: userId,
			},
		});

		return { todos, total };
	}

	static async get(id: number): Promise<Todo | null> {
		const todo = await prismaClient.todo.findUnique({
			where: {
				id: id,
			},
		});

		return todo;
	}

	static async store(
		title: string,
		description: string | null,
		userId: number,
	): Promise<Todo> {
		const todo = await prismaClient.todo.create({
			data: {
				title: title,
				description: description,
				authorId: userId,
			},
		});

		return todo;
	}

	static async update(
		id: number,
		title: string,
		description: string | null,
	): Promise<Todo> {
		const todo = await prismaClient.todo.update({
			where: {
				id: id,
			},
			data: {
				title: title,
				description: description,
			},
		});

		return todo;
	}

	static async delete(id: number): Promise<Todo> {
		const todo = await prismaClient.todo.delete({
			where: {
				id: id,
			},
		});

		return todo;
	}
}
