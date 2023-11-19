import express, { Request, Response, NextFunction } from "express";
import { validationResult, checkSchema, Schema } from "express-validator";
import { HttpException } from "../types";
import logger from "../logger";
import { log } from "console";

export const validateSchema = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let validationErrors = validationResult(req);
    logger.debug(validationErrors);
    if (!validationErrors.isEmpty()) {
        next(
            new HttpException(
                400,
                `Bad Request. ${validationErrors.array()[0].msg}`
            )
        );
    } else {
        next();
    }
};
