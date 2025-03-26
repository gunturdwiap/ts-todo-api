import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			email: "john@gmail.com",
			password: await bcrypt.hash("password", 1),
			name: "john genshin",
		},
	});

	console.dir(user, { depth: null });
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
