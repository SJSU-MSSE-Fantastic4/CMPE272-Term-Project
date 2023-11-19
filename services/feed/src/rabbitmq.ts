import { connect, Connection, Channel, ConsumeMessage } from "amqplib";
import { FeedModel, IFeed, IPost, IComment, ILike } from "./models";
import { config } from "./config";

interface PostEvent {
    postId: string;
    authorId: string;
}

let connection: Connection;

const consumePostEvent = async (
    channel: Channel,
    routingKey: string,
    onMessage: (msg: PostEvent) => void
) => {
    const exchange = "posts_exchange";
    const queue = `posts_queue_${routingKey}`;

    await channel.assertExchange(exchange, "topic", { durable: false });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, (msg) => {
        if (msg) {
            const message: PostEvent = JSON.parse(msg.content.toString());
            onMessage(message);
            channel.ack(msg);
        }
    });
};

export const createChannel = async (): Promise<Channel> => {
    return connection.createChannel();
};

export const startConsumer = async () => {
    try {
        const channel = await createChannel();

        const routingKey = "post.created";

        consumePostEvent(channel, routingKey, async (message: PostEvent) => {
            console.log("Received Post Event:", message);
            const feed = await addToUserFeed(message.authorId, message.postId);
            console.log(feed);
        });
    } catch (error) {
        console.error("Error in startConsumer:", error);
    }
};

const addToUserFeed = async (userId: string, postId: string) => {
    const feed = await FeedModel.findOneAndUpdate(
        { userId: userId },
        { $push: { posts: postId } },
        { upsert: true, new: true }
    );

    return feed;
};

export async function startConnection() {
    try {
        const amqpServer = config.AMQP_URL; // Change to your RabbitMQ server URL
        connection = await connect(amqpServer);
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        throw error;
    }
}
