import express, { Express, Request, Response } from "express";
import { config } from "./config";
import logger from "./logger";
const app: Express = express();

import cors from "cors";
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Setup Keycloak
import Keycloak from "keycloak-connect";
export const keycloak = new Keycloak({}, config.KEYCLOAK);

//Setup Neo4j
import neo4j from "neo4j-driver";
export const neo4jDriver = neo4j.driver(
    config.NEO4J.URL,
    neo4j.auth.basic(config.NEO4J.USERNAME, config.NEO4J.PASSWORD)
);

import routes from "./routes";
app.use("/", routes);

export const server = app.listen(config.PORT, () => {
    logger.info("Follow Service Server Running on port " + config.PORT);
});

export default app;
