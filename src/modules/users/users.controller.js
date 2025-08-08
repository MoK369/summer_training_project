// @ts-check
import { Router } from "express";
import * as usersService from './users.service.js';

const usersRouter = Router();

usersRouter.get('/get/:id',usersService.getUserById)
usersRouter.patch('/update/:id',usersService.updateUserInfo)

export default usersRouter;
