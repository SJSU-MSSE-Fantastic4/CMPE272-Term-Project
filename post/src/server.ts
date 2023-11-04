import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();
app.use(express.json());

//Setup Logging
var winston = require("winston"),
    expressWinston = require("express-winston");

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.prettyPrint()
        ),
    })
);

// Connect to MongoDB
import mongoose from "mongoose";
export const dbConnection = mongoose
    .connect("mongodb://root:root@localhost:27017", {
        dbName: "postDB",
        user: "root",
        pass: "root",
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

// Initialize Authentication Middleware
import keycloak from "./middlewares/auth.middleware";
app.use(keycloak.middleware());

//Initialize Route handlers
import postsRoutes from "./routes/posts.routes";
import userRoutes from "./routes/users.routes";
import errorMiddleware from "./middlewares/error.middleware";

app.use("/me", keycloak.protect(), userRoutes);
app.use("/posts", postsRoutes);

// Error Logging
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.prettyPrint()
        ),
    })
);

//Initialize Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
export const server = app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

export default app;
