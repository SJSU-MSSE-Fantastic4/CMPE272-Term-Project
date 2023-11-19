import express from "express";
import { startConsumer, startConnection } from "./rabbitmq";
import { FeedModel, IFeed, IPost, IComment, ILike } from "./models";
import { config } from "./config";
import connectToMongoDB from "./database/mongoConnection";

const app = express();
app.use(express.json());

// Unsecure route. There are no private accounts on this app, so anyone can access any user's feed
app.get("/feed/:userId", async (req, res) => {
    let feed = await FeedModel.findOne({ userId: req.params.userId });
    res.send(feed);
});

//Connect to MongoDB
connectToMongoDB().then(async () => {
    //Start RabbitMQ Connection
    await startConnection();
    await startConsumer();

    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
    });
});
