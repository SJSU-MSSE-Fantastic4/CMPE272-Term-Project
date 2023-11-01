import express, { Express, Request, Response, NextFunction } from "express";

import postsRoutes from "./routes/posts";
import commentsRoutes from "./routes/comments";
import likesRoutes from "./routes/likes";
import authMiddleware from "./middlewares/auth";

const app: Express = express();

app.use(express.json());

// Middleware for authentication
app.use(authMiddleware);

app.use("/posts", postsRoutes);
app.use("/posts/:postId/comments", commentsRoutes);
app.use("/posts/:postId/likes", likesRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;
