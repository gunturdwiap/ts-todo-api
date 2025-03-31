import { describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../app";
import { prismaClient } from "../../database";

describe("GET /todos", () => {
	it("should list todo", async () => {
		const response = await supertest(app).get("/todos");

		// const users = await prismaClient.user.findMany();

		expect(response.status).toBe(403);
		console.log(process.env.DATABASE_URL);
	});
});
