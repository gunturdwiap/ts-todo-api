import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prismaClient } from "./database";

const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			email: "john@gmail.com",
			password: await bcrypt.hash("password", 1),
			name: "john genshin",
		},
	});

	for (let i = 0; i < 100; i++) {
		await prismaClient.todo.create({
			data: {
				title: `Title ${i}`,
				description: `Description ${i}`,
				authorId: user.id,
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
