import { NextFunction, Request, Response } from "express";
import { HttpException } from "../types";
import { Error as MongooseError } from "mongoose";
import logger from "../logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err);
    if (err instanceof HttpException) {
        res.status(err.status).send(err.message);
        return;
    }
    if (err instanceof MongooseError.CastError) {
        let errorMessage = `Invalid ${err.kind}: ${err.value} for path ${err.path}`;
        res.status(400).send(errorMessage);
        return;
    }
    if (err instanceof MongooseError.ValidationError) {
        res.status(400).send("Document failed validation.");
        return;
    }
    if (err instanceof MongooseError.DocumentNotFoundError) {
        res.status(404).send("Document not found.");
        return;
    }
    if (err instanceof MongooseError.ParallelSaveError) {
        res.status(409).send("Parallel save operation attempted.");
        return;
    }
    if (err instanceof MongooseError.DivergentArrayError) {
        res.status(409).send("Concurrent update error. Please try again.");
        return;
    }

    res.status(500).send("Internal Server Error");
};
