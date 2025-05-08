import { describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../app";
import { prismaClient } from "../../database";

describe("GET /todos", () => {
	it("user must log in to access todos", async () => {
		const response = await supertest(app).get("/todos");

		expect(response.status).toBe(403);
	});
});
