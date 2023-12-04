import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService, UserFollowsUser } from '../neo4j/neo4j.service';
import { User } from './entities/user.entity';
import neo4j, { Record } from 'neo4j-driver';

@Injectable()
export class UsersService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findManyByIds(ids: string[]) {
    let session = this.neo4jService.driver.session();

    try {
      let result = await session.executeWrite((tx) =>
        tx.run<User>(
          `
                MATCH (user:User)
                WHERE user.userId IN $userIds
                RETURN user
                `,
          {
            userIds: ids,
          },
        ),
      );

      if (result.records.length > 0) {
        return result.records.map(
          (record: Record) => record.get('user').properties,
        );
      } else {
        return null; // No user found or created
      }
    } catch (err) {
      throw err;
    } finally {
      await session.close();
    }
  }

  async findOneById(id: string) {
    let session = this.neo4jService.driver.session();

    try {
      let result = await session.executeWrite((tx) =>
        tx.run<User>(
          `
                MATCH (user:User {userId: $userId})
                RETURN user
                `,
          {
            userId: id,
          },
        ),
      );

      if (result.records.length > 0) {
        const record: Record = result.records[0];
        const userNode = record.get('user');
        if (userNode && userNode.properties) {
          return userNode.properties as User;
        }
      } else {
        return null; // No user found or created
      }
    } catch (err) {
      throw err;
    } finally {
      await session.close();
    }
  }

  async find(query: string) {
    let session = this.neo4jService.driver.session();

    try {
      let result = await session.executeWrite((tx) =>
        tx.run<User>(
          `
                MATCH (user:User)
                WHERE user.nickname CONTAINS $searchTerm OR user.email CONTAINS $searchTerm OR user.name CONTAINS $searchTerm
                RETURN user
                LIMIT 10
                `,
          {
            searchTerm: query,
          },
        ),
      );

      if (result.records.length > 0) {
        return result.records.map(
          (record: Record) => record.get('user').properties,
        );
      } else {
        return null; // No user found or created
      }
    } catch (err) {
      throw err;
    } finally {
      await session.close();
    }
  }

  async addUser(user: User) {
    let session = this.neo4jService.driver.session();
    try {
      let result = await session.executeWrite((tx) =>
        tx.run<User>(
          `
                MERGE (user:User {userId: $userId})
                ON CREATE SET user = $userData
                ON MATCH SET user = $userData
                RETURN user
                `,
          {
            userId: user.userId,
            userData: user,
          },
        ),
      );

      if (result.records.length > 0) {
        const record: Record = result.records[0];
        return record.get('user').properties;
      }
    } catch (err) {
      throw err;
    } finally {
      await session.close();
    }
  }

  async follow(followerId: string, followeeId: string) {
    const session = this.neo4jService.getDriver().session();
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
          },
        ),
      );
      return result;
    } finally {
      await session.close();
    }
  }

  async unfollow(followerId: string, followeeId: string) {
    const session = this.neo4jService.getDriver().session();
    try {
      let result = await session.executeWrite((tx) =>
        tx.run<UserFollowsUser>(
          `
            MATCH (follower:User {userId: $followerId})-[follows:FOLLOWS]->(followee:User {userId: $followeeId})
            DELETE follows
            `,
          {
            followerId: followerId,
            followeeId: followeeId,
          },
        ),
      );
      return result;
    } finally {
      await session.close();
    }
  }

  async getFollowers(userId: string) {
    const session = this.neo4jService.getDriver().session();
    try {
      let result = await session.executeRead((tx) =>
        tx.run<UserFollowsUser>(
          `
          MATCH (follower:User)-[follows:FOLLOWS]->(followee:User {userId: $userId})
          RETURN follower, follows, followee
          `,
          {
            userId: userId,
          },
        ),
      );
      return result.records.map((record) => record.get('follower').properties);
    } finally {
      await session.close();
    }
  }

  async getFollowing(userId: string) {
    const session = this.neo4jService.getDriver().session();
    try {
      let result = await session.executeRead((tx) =>
        tx.run<UserFollowsUser>(
          `
          MATCH (follower:User {userId: $userId})-[follows:FOLLOWS]->(followee:User)
          RETURN follower, follows, followee
          `,
          {
            userId: userId,
          },
        ),
      );

      return result.records.map((record) => record.get('followee').properties);
    } finally {
      await session.close();
    }
  }
}
