import express, { Express, Request, Response, NextFunction } from "express";
import {
    follow,
    unfollow,
    getFollowers,
    getFollowing,
    addMeToDB,
    searchUsers,
} from "./connections/neo4j/calls";
import logger from "./logger";
import { HttpException } from "./types";
import { json } from "stream/consumers";

const getUser = (req: Request): Express.User => {
    let user;
    if (req.user) {
        user = req.user;
    } else {
        /* 
            500 Internal Server Error. This should never happen without programmer error. 
            Controllers calling this method should be protected auth middleware,
            Therefore the user should always be present in the request.
            as an error would have been thrown by the auth middleware if it
            didnt exist
        */
        throw new HttpException(500, "Internal Server Error");
    }
    return user;
};

const getUserId = (req: Request): string => {
    return getUser(req).sub;
};

export const addMeToDBController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let me = getUser(req);
        let result = await addMeToDB(me);

        if (!result) {
            throw new HttpException(500, "Internal Server Error");
        }

        logger.info(`User ${me.sub} added to database`);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

export const searchController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let searchTerm = req.params.searchTerm;
        let result = await searchUsers(searchTerm);
        logger.info(`Searching for ${searchTerm}`);
        res.status(200).send({
            users: result,
        });
    } catch (err) {
        next(err);
    }
};

export const followController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let currentUserId = getUserId(req);
        await follow(currentUserId, req.params.followeeId);
        logger.info(`User ${currentUserId} followed ${req.params.followeeId}`);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const unfollowController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let currentUserId = getUserId(req);
        await unfollow(currentUserId, req.params.followeeId);
        logger.info(
            `User ${currentUserId} unfollowed ${req.params.followeeId}`
        );
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};

export const getCurrentUserFollowersController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let currentUserId = getUserId(req);
        logger.info(`Getting followers of ${currentUserId}`);
        let result = await getFollowers(currentUserId);
        res.status(200).send({
            followers: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getCurrentUserFollowingController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let currentUserId = getUserId(req);
        logger.info(`Getting following for ${currentUserId}`);
        let result = await getFollowing(currentUserId);
        res.status(200).send({
            following: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getFollowersController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        //Passing in "name" parameter in body of POST request
        let result = await getFollowers(req.params.userId);
        logger.info(`Getting following for ${req.params.userId}`);
        res.status(200).send({
            followers: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getFollowingController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        //Passing in "name" parameter in body of POST request
        let result = await getFollowing(req.params.userId);
        logger.info(`Getting followers for ${req.params.userId}`);
        res.status(200).send({
            following: result,
        });
    } catch (err) {
        next(err);
    }
};
