import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();
app.use(express.json());

// Connect to MongoDB
import mongoose from "mongoose";
mongoose
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

//Initialize Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;
