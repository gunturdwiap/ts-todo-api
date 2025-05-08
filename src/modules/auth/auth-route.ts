import { Router } from "express";
import {
	loginHandler,
	refreshTokenHandler,
	registerHandler,
} from "./auth-handler";

export const authRouter = Router();

authRouter.post("/login", loginHandler);

authRouter.post("/register", registerHandler);

authRouter.post("/refresh", refreshTokenHandler);
