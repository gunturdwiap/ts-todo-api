import express from "express";
import { config } from "./config.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { authRouter } from "./modules/auth/auth-route.js";
import { todoRouter } from "./modules/todo/todo-routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	console.log(`Auth : `);
	console.log(req.headers.authorization, token);
	console.log(`Body : `);
	console.log(req.body);
	next();
});

app.use("/todos", todoRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);

app.listen(config.port, () => {
	console.log(`Example app listening on port ${config.port}`);
});
