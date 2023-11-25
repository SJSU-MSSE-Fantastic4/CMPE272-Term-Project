// src/neo4j/neo4j.service.ts
import { Injectable } from '@nestjs/common';
import neo4j, {
  Driver,
  Integer,
  Node,
  Record,
  Relationship,
} from 'neo4j-driver';
import { User } from '../users/entities/user.entity';

const NEO4J_URL =
  process.env.NEO4J_URL || 'neo4j+s://f6b09929.databases.neo4j.io';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD =
  process.env.NEO4J_PASSWORD || 'ytqJ0tx2OZxsllLlMFDkGMA4_Kib0tp906BXyebCPYc';

export type UserNode = Node<Integer, User>;
export type FollowRelationship = Relationship<Integer>;

export interface UserFollowsUser {
  follower: UserNode;
  follows: FollowRelationship;
  followee: UserNode;
}

@Injectable()
export class Neo4jService {
  public driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      NEO4J_URL,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
    );
  }

  getDriver(): Driver {
    return this.driver;
  }
}
