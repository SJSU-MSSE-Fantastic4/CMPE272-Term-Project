import pino from "pino";

const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:mm-dd-yyyy hh:mm:ss TT",
            colorize: true,
            ignore: "pid,hostname",
        },
    },
});

export default logger;
