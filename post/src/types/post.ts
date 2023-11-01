interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    comments: Comment[];
    likes: Like[];
}

interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Like {
    id: string;
    author: string;
    createdAt: Date;
}
