import { Integer, Node, Record, Relationship } from "neo4j-driver";
import { neo4jDriver } from "../server";

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

    let result;
    try {
        result = await session.executeWrite((tx) =>
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
    } catch (err) {
        console.error(err);
        return result;
    }
    return result;
};

export const unfollow = async function (
    followerId: string,
    followeeId: string
) {
    let session = neo4jDriver.session();
    let result;
    try {
        result = await session.executeWrite((tx) =>
            tx.run<UserFollowsUser>(
                `
                MATCH (follower:User {userId: $followerId})-[follows:FOLLOWS]->(followee:User {userId: $followeeId})
                DELETE follows
                `,
                {
                    follower: followerId,
                    followee: followeeId,
                }
            )
        );
    } catch (err) {
        console.error(err);
        return result;
    }
    return result.summary.counters.updates().relationshipsDeleted > 0
        ? "Relationship removed"
        : "No relationship was removed";
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
    } catch (err) {
        console.error(err);
        return [];
    }
    return result.records.map(
        (record) => record.get("followee").properties.userId
    );
};

export const getFollowers = async function (
    userId: string
): Promise<Array<string>> {
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
    } catch (err) {
        console.error(err);
        return [];
    }
    return result.records.map(
        (record) => record.get("follower").properties.userId
    );
};
