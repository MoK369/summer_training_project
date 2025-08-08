// @ts-check
import { connection, testDBConnection } from "./db/db.connection.js";
import syncModelsToDB from "./db/sync_models/models.sync.js";
import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import errorHandler from "./utils/handler/error_handler.js";
import usersRouter from "./modules/users/users.controller.js";
import postsRouter from "./modules/posts/posts.controller.js";
import commentsRouter from "./modules/comments/comments.controller.js";

async function bootstrap() {
  const connectionResult = await testDBConnection();
  if (connectionResult) {
    const syncModelsResult = await syncModelsToDB();
    if (syncModelsResult) {
      const app = express();
      app.use(express.json());

      // api routes
      app.use("/auth", authRouter);
      app.use("/users", usersRouter);
      app.use("/posts", postsRouter);
      app.use("/comments", commentsRouter);

      // error handling
      app.use(errorHandler);

      // catch all other routes
      app.all("{/*d}", (req, res, next) => {
        res.status(404).json({
          success: false,
          error: `Wrong URL ${req.url} or METHOD ${req.method}`,
        });
      });

      // running server
      const port = 3000;
      app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
      });
    }
  }
}

export default bootstrap;
