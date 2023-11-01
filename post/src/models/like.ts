class Like {
    likeId: string;
    postId: string;
    likerId: string; // This refers to the user who liked the post
    createdAt: Date;

    constructor(
        likeId: string,
        postId: string,
        likerId: string,
        createdAt: Date
    ) {
        this.likeId = likeId;
        this.postId = postId;
        this.likerId = likerId;
        this.createdAt = createdAt;
    }
}

export default Like;
