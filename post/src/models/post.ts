class Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
    lastUpdated: Date;

    constructor(
        id: string,
        title: string,
        content: string,
        authorId: string,
        createdAt: Date,
        lastUpdated: Date
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.lastUpdated = lastUpdated;
    }
}

export default Post;
