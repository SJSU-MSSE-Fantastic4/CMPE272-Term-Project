import PostItem from "./PostItem";
import { fetchFeed } from "@/lib/feed";

interface PostFeedProps {
    userId: string;
}

const PostFeed = async ({ userId }: PostFeedProps) => {
    let posts = await fetchFeed(userId);

    if (posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-white">Hmm. This feed is empty. </p>
                <p className="text-white">Try following some users</p>
            </div>
        );
    }

    return (
        <>
            {posts
                .slice(0)
                .reverse()
                .map((postWithAuthor) => (
                    <PostItem key={postWithAuthor._id} post={postWithAuthor} />
                ))}
        </>
    );
};

export default PostFeed;
