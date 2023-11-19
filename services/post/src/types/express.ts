import { Channel } from "amqplib";
import { Grant } from "./keycloak-connect";

declare global {
    namespace Express {
        interface Request {
            channel?: Channel;
            kauth?: { grant: Grant };
        }
    }
}
