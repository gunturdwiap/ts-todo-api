import { z } from "zod";

export class AuthValidation {
	static readonly login = z.object({
		email: z.string().email().max(255),
		password: z.string().max(255),
	});

	static readonly register = z.object({
		username: z.string().max(255).min(2),
		email: z.string().email().max(255),
		password: z.string().max(255).min(3),
	});
}
