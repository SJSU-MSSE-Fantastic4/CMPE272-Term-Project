import express, { Express, Request, Response, NextFunction } from "express";
import { startConnection } from "./rabbitmq";
import connectToMongoDB from "./database/mongoConnection";
import { config } from "./config";
import logger from "./logger";

const app: Express = express();
app.use(express.json());

//Setup Keycloak
import Keycloak from "keycloak-connect";
export const keycloak = new Keycloak({}, config.KEYCLOAK);
app.use(keycloak.middleware());

//Setup Logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url} ${req.path}`);
    next();
});

//Initialize Route handlers
import postsRoutes from "./routes/posts.routes";
import authenticatedRoutes from "./routes/authenticated.routes";
import { HttpException } from "./types";

app.use("/me", keycloak.protect(), authenticatedRoutes);
app.use("/posts", postsRoutes);

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
    });
