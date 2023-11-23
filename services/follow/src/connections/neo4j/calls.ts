import { Integer, Node, Record, Relationship } from "neo4j-driver";
import { neo4jDriver } from "../../server";
import logger from "../../logger";

interface UserProperties {
    userId: string;
    email: string;
    name: string;
    picture: string;
    nickname: string;
    created_at: string;
    updated_at: string;
}

export type User = Node<Integer, UserProperties>;
type Follows = Relationship<Integer>;
interface UserFollowsUser {
    follower: User;
    follows: Follows;
    followee: User;
}

export const addMeToDB = async function (me: Express.User) {
    let session = neo4jDriver.session();
    logger.info("Opening session");

    try {
        let result = await session.executeRead((tx) =>
            tx.run<User>(
                `
                MERGE (user:User {userId: $userId})
                ON CREATE SET user = $userData
                ON MATCH SET user = $userData
                RETURN user
                `,
                {
                    userId: me.sub,
                    userData: {
                        userId: me.sub,
                        email: me.email,
                        name: me.name,
                        picture: me.picture,
                        nickname: me.nickname,
                        created_at: me.created_at,
                        updated_at: me.updated_at,
                    },
                }
            )
        );

        if (result.records.length > 0) {
            const record: Record = result.records[0];
            const userNode = record.get("user");
            if (userNode && userNode.properties) {
                return userNode.properties as User;
            }
        } else {
            return null; // No user found or created
        }
    } catch (err) {
        throw err;
    } finally {
        logger.info("Closing session");
        await session.close();
    }
};

export const searchUsers = async function (searchTerm: string) {
    let session = neo4jDriver.session();
    logger.info("Opening session");

    try {
        let result = await session.executeWrite((tx) =>
            tx.run<User>(
                `
                MATCH (user:User)
                WHERE user.nickname CONTAINS $searchTerm OR user.email CONTAINS $searchTerm
                RETURN user
                LIMIT 10
                `,
                {
                    searchTerm: searchTerm,
                }
            )
        );

        if (result.records.length > 0) {
            return result.records.map((record: Record) => record.get("user"));
        } else {
            return null; // No user found or created
        }
    } catch (err) {
        throw err;
    } finally {
        logger.info("Closing session");
        await session.close();
    }
};

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

export const getFollowing = async function (userId: string) {
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
            (record) => record.get("followee").properties
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
            (record) => record.get("follower").properties
        );
    } catch (err) {
        throw err;
    } finally {
        await session.close();
    }
};
