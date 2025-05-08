import express from "express";
import { config } from "./config";
import { errorMiddleware } from "./middleware/error-middleware";
import { authRouter } from "./modules/auth/auth-route";
import { todoRouter } from "./modules/todo/todo-route";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/todos", todoRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);
