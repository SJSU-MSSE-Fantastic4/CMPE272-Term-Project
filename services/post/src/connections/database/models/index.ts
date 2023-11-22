export * from "./post";
export * from "./like";
export * from "./comment";

export interface IFeed {
    _id: string;
    userId: string;
    posts: string[];
    createdAt: Date;
    updatedAt: Date;
}
