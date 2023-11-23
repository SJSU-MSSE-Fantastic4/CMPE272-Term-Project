import { Integer, Node, Record, Relationship } from "neo4j-driver";
import { neo4jDriver } from "../../server";
import logger from "../../logger";

interface UserProperties {
    userId: string;
}

type User = Node<Integer, UserProperties>;
type Follows = Relationship<Integer>;
interface UserFollowsUser {
    follower: User;
    follows: Follows;
    followee: User;
}

export const follow = async function (followerId: string, followeeId: string) {
    let session = neo4jDriver.session();
    logger.info("Opening session");

    try {
        let result = await session.executeWrite((tx) =>
            tx.run<UserFollowsUser>(
                `
                MERGE (follower:User {userId: $follower})
                MERGE (followee:User {userId: $followee})
                MERGE (follower)-[follows:FOLLOWS]->(followee)
                RETURN follower, follows, followee
                `,
                {
                    follower: followerId,
                    followee: followeeId,
                }
            )
        );
        return result;
    } catch (err) {
        throw err;
    } finally {
        logger.info("Closing session");
        await session.close();
    }
};

export const unfollow = async function (
    followerId: string,
    followeeId: string
) {
    let session = neo4jDriver.session();
    let result;
    try {
        logger.debug(`Unfollowing ${followerId} from ${followeeId}`);
        result = await session.executeWrite((tx) =>
            tx.run<UserFollowsUser>(
                `
                MATCH (follower:User {userId: $followerId})-[follows:FOLLOWS]->(followee:User {userId: $followeeId})
                DELETE follows
                `,
                {
                    followerId: followerId,
                    followeeId: followeeId,
                }
            )
        );

        return result.summary.counters.updates().relationshipsDeleted > 0
            ? "Relationship removed"
            : "No relationship was removed";
    } catch (err) {
        throw err;
    } finally {
        await session.close();
    }
};

export const getFollowing = async function (
    userId: string
): Promise<Array<string>> {
    let session = neo4jDriver.session();
    let result;
    try {
        result = await session.executeRead((tx) =>
            tx.run<UserFollowsUser>(
                `
                MATCH (follower:User {userId: $userId})-[follows:FOLLOWS]->(followee:User)
                RETURN follower, follows, followee
                `,
                {
                    userId: userId,
                }
            )
        );
        return result.records.map(
            (record) => record.get("followee").properties.userId
        );
    } catch (err) {
        throw err;
    } finally {
        await session.close();
    }
};

export const getFollowers = async function (userId: string) {
    let session = neo4jDriver.session();
    let result;
    try {
        result = await session.executeRead((tx) =>
            tx.run<UserFollowsUser>(
                `
                MATCH (follower:User)-[follows:FOLLOWS]->(followee:User {userId: $userId})
                RETURN follower, follows, followee
                `,
                {
                    userId: userId,
                }
            )
        );
        return result.records.map(
            (record) => record.get("follower").properties.userId
        );
    } catch (err) {
        throw err;
    } finally {
        await session.close();
    }
};
