import { Router } from "express";
import * as postsService from "./posts.service.js";

const postsRouter = Router();

postsRouter.post("/create", postsService.createPost);
postsRouter.delete("/delete/:id", postsService.softDeletePost);
postsRouter.get("/all", postsService.getPostsWithCreatedUser);
postsRouter.get("/all-comments-count", postsService.getPostsWithCommentsCount);

export default postsRouter;
