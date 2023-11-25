import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface User {
  userId: string;
  email: string;
  name: string;
  picture: string;
  nickname: string;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin';
}

const FOLLOW_SERVICE_URL =
  process.env.FOLLOW_SERVICE_URL || 'http://localhost:3000';
const FOLLOW_SERVICE_BASE_PATH =
  process.env.FOLLOW_SERVICE_BASE_PATH || '/users/';

@Injectable()
export class FollowService {
  async getFollowers(userId: string) {
    try {
      const response = await axios.get<[User]>(
        FOLLOW_SERVICE_URL + FOLLOW_SERVICE_BASE_PATH + `${userId}/followers`,
      );
      let followers = response.data;
      return followers.map((follower) => follower.userId);
    } catch (error) {
      throw error;
    }
  }
}
