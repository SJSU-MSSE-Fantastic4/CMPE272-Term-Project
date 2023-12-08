import Header from "@/components/Header";
import { ClipLoader } from "react-spinners";
import { getSession } from "@auth0/nextjs-auth0";
import PostItem from "@/components/posts/PostItem";
import { PopulatedPost } from "@/types/post";
import Form from "@/components/Form";
import CommentFeed from "@/components/posts/CommentFeed";

const PostView = async ({ params }: { params: { postId: string } }) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    const { postId } = params;
    const fetchPost = async () => {
        try {
            const response = await fetch(
                api_url + `/post-service/post/${postId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };

    const post = await fetchPost();

    if (!post) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader color="lightblue" size={80} />
            </div>
        );
    }

    return (
        <>
            <Header showBackArrow label="Post" />
            <PostItem post={post} />
            <Form
                placeholder="Post your Reply"
                isComment={true}
                postId={postId}
            />
            <CommentFeed comments={post.comments} />
        </>
    );
};

export default PostView;
