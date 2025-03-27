import { Todo, User } from "@prisma/client";

export {};

declare global {
	namespace Express {
		export interface Request {
			auth?: Pick<User, "id" | "email">;
			todo?: Todo;
		}
	}
}
