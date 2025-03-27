import { z } from "zod";

export class TodoValidation {
	static readonly store = z.object({
		title: z.string().max(255),
		description: z.string().max(255).nullable(),
	});

	static readonly update = z.object({
		title: z.string().max(255),
		description: z.string().max(255).nullable(),
	});
}
