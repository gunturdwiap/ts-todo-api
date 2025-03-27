import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prismaClient } from "./database.js";

const prisma = new PrismaClient();

async function main() {
	// const user = await prisma.user.create({
	// 	data: {
	// 		email: "john@gmail.com",
	// 		password: await bcrypt.hash("password", 1),
	// 		name: "john genshin",
	// 	},
	// });

	// console.dir(user, { depth: null });

	for (let i = 0; i < 100; i++) {
		await prismaClient.todo.create({
			data: {
				title: `Title ${i}`,
				description: `Description ${i}`,
				authorId: 1,
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
