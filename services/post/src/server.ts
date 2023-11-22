import express, { Express, Request, Response, NextFunction } from "express";
import { startConnection } from "./connections/rabbitmq/rabbitmq";
import connectToMongoDB from "./connections/database/mongoConnection";
import { config } from "./config";
import logger from "./logger";
import { authMiddleware } from "./connections/auth/oidc-client";

const app: Express = express();
app.use(express.json());

//Setup Logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url} ${req.path}`);
    next();
});

//Initialize Route handlers
import interactionRoutes from "./routes/interactions.routes";
import usersPostsRoutes from "./routes/usersPosts.routes";
import { unprotectedController } from "./controllers";

app.get("/", (req: Request, res: Response) => {
    res.send("Post Service is up and running");
});

app.use("/me", authMiddleware, usersPostsRoutes);
app.use("/post", authMiddleware, interactionRoutes);
app.get("/posts", unprotectedController.getSeveralPosts);
app.get("/post/:postId", unprotectedController.getPostById);

import { errorHandler } from "./middleware/errorHandling.middleware";
app.use(errorHandler);

//Connect to MongoDB
connectToMongoDB()
    .then(async () => {
        await startConnection();

        app.listen(config.PORT, () => {
            logger.info("Post Service Server Running on port " + config.PORT);
        });
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
