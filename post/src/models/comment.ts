class Comment {
    commentId: string;
    postId: string;
    likerId: string; // Note: This refers to the user who made the comment
    content: string;
    createdAt: Date;

    constructor(
        commentId: string,
        postId: string,
        likerId: string,
        content: string,
        createdAt: Date
    ) {
        this.commentId = commentId;
        this.postId = postId;
        this.likerId = likerId;
        this.content = content;
        this.createdAt = createdAt;
    }
}

export default Comment;
