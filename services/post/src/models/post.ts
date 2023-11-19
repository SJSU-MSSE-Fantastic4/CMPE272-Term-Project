import { Schema, model } from "mongoose";
import { CommentModel, IComment } from "./comment";
import { LikeModel, ILike } from "./like";

const UUID_REGEXP =
    /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[1-5][0-9a-fA-F]{3}\-[89abAB][0-9a-fA-F]{3}\-[0-9a-fA-F]{12}$/;

export interface IPost {
    _id: string;
    content: string;
    authorId: string; // Should be a UUID
    comments: IComment[];
    likes: ILike[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        content: { type: String, required: true },
        authorId: {
            type: String,
            required: true,
            validate: {
                validator: function (v: string) {
                    return UUID_REGEXP.test(v);
                },
                message: (props: any) => `${props.value} is not a valid UUID!`,
            },
        }, // Should be a UUID
        comments: [
            { type: Schema.Types.ObjectId, ref: "Comment", default: [] },
        ],
        likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
    },
    { timestamps: true }
);

export const PostModel = model<IPost>("Post", postSchema);
