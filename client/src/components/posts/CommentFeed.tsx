import CommentItem from "@/components/posts/CommentItem";
import { Comment } from "@/types/post";

interface CommentFeedProps {
    comments?: Comment[];
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
    return (
        <>
            {comments.map((comment: Comment) => (
                <CommentItem key={comment._id} comment={comment} />
            ))}
        </>
    );
};

export default CommentFeed;
