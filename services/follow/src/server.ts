import express, { Express, Request, Response } from "express";
import { config } from "./config";
import logger from "./logger";

const app: Express = express();
app.use(express.json());

//Setup Neo4j
import neo4j from "neo4j-driver";
export const neo4jDriver = neo4j.driver(
    config.NEO4J.URL,
    neo4j.auth.basic(config.NEO4J.USERNAME, config.NEO4J.PASSWORD)
);

import routes from "./routes";
app.get("/", (req: Request, res: Response) => {
    res.send("Follow Service is up and running");
});

app.use("/", routes);

neo4jDriver
    .getServerInfo()
    .then((info) => {
        logger.info(`Connected to Neo4j Server version: ${info.agent}`);

        const server = app.listen(config.PORT, () => {
            logger.info("Follow Service Server Running on port " + config.PORT);
        });
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
