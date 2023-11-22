import { connect, Connection, Channel, ConsumeMessage } from "amqplib";
import { config } from "../../config";
import logger from "../../logger";

interface PostEvent {
    postId: string;
    authorId: string;
}

let connection: Connection;

export const createChannel = async (): Promise<Channel> => {
    return connection.createChannel();
};

export async function startConnection() {
    try {
        const amqpServer = config.AMQP_URL; // Change to your RabbitMQ server URL
        connection = await connect(amqpServer);
        logger.info(`Established Connection to RabbitMQ at ${amqpServer}`);
    } catch (error) {
        logger.error("Failed to connect to RabbitMQ", error);
        throw error;
    }
}

const publishPostEvent = async (
    channel: Channel,
    event: PostEvent,
    routingKey: string
) => {
    const exchange = "posts_exchange";
    await channel.assertExchange(exchange, "topic", { durable: false });

    const messageBuffer = Buffer.from(JSON.stringify(event));
    channel.publish(exchange, routingKey, messageBuffer);
};

export const postCreated = async (postId: string, authorId: string) => {
    const channel = await createChannel();
    const postEvent: PostEvent = {
        postId: postId,
        authorId: authorId,
    };
    const routingKey = "post.created";

    await publishPostEvent(channel, postEvent, routingKey);
};

export function getConnection() {
    if (!connection) {
        throw new Error("RabbitMQ connection not established");
    }
    return connection;
}
