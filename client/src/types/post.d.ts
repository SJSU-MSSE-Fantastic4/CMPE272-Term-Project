export interface PopulatedPost {
    _id: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    likes: [Like];
    comments: [Comment];
}

export interface Comment {
    _id: string;
    content: string;
    commenterId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Like {
    postId: string;
    likerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface UnpopulatedPost {
    _id: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
    likesCount: number;
}
