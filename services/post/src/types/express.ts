import { Channel } from "amqplib";
import { Interface } from "readline";

declare global {
    namespace Express {
        interface Request {
            channel?: Channel;
            user: any;
        }

        interface User {
            sub: string;
            email: string;
            email_verified: boolean;
            name: string;
            picture: string;
            nickname: string;
            created_at: string;
            updated_at: string;
        }
    }
}
