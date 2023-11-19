import express, { Express, Request, Response, NextFunction } from "express";
import { follow, unfollow, getFollowers, getFollowing } from "./neo4j/calls";

export const followController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    let result = await follow(req.body.follower, req.body.followee);
    console.log("RESULT IS", result);
    res.status(200).send({ result }); //Can't send just a Number; encapsulate with {} or convert to String.
};

export const unfollowController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    //Passing in "name" parameter in body of POST request
    let result = await unfollow(req.body.follower, req.body.followee);
    res.status(200).send({ result }); //Can't send just a Number; encapsulate with {} or convert to String.
};

export const getFollowersController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    //Passing in "name" parameter in body of POST request
    let result = await getFollowers(req.body.userId);

    res.status(200).send({ result }); //Can't send just a Number; encapsulate with {} or convert to String.
};

export const getFollowingController = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    //Passing in "name" parameter in body of POST request
    let result = await getFollowing(req.body.userId);

    res.status(200).send({ result }); //Can't send just a Number; encapsulate with {} or convert to String.
};
