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
    commentsCount?: number;
    likesCount?: number;
}

const postSchema = new Schema<IPost>(
    {
        //Validate content is 1-280 characters
        content: {
            type: String,
            required: true,
            maxlength: 280,
        },
        // Users auth0 id
        authorId: {
            type: String,
            required: true,
        },
        comments: [
            { type: Schema.Types.ObjectId, ref: "Comment", default: [] },
        ],
        likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
    },
    { timestamps: true }
);

postSchema.post(
    "deleteOne",
    { document: true, query: false },
    async function (doc, next) {
        await CommentModel.deleteMany({ _id: { $in: doc.comments } });
        await LikeModel.deleteMany({ _id: { $in: doc.likes } });
    }
);

export const PostModel = model<IPost>("Post", postSchema);
