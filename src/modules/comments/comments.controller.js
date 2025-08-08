import { Router } from "express";
import * as commentsService from "./comments.service.js";

const commentsRouter = Router();

commentsRouter.post("/create-bulk", commentsService.createBulkOfComments);
commentsRouter.patch("/update/:id", commentsService.updateCommentById);
commentsRouter.get("/search", commentsService.searchForComments);
commentsRouter.get("/newest/:postId", commentsService.getThreeRecentComments);
commentsRouter.get("/details/:id", commentsService.getCommentDetails);

export default commentsRouter;
