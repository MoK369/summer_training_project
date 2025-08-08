// @ts-check
import { Router } from "express";
import * as authService from "./auth.service.js";

const authRouter = Router();

authRouter.post("/signup", authService.signUp);
authRouter.post("/signin", authService.signIn);

export default authRouter;