"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { WiStars } from "react-icons/wi";

import Avatar from "./Avatar";
import Button from "./Button";
import { UnpopulatedPost } from "@/types/post";
import PostItem from "./posts/PostItem";
import useCurrentUser from "@/hooks/useCurrentUser";
import CommentItem from "@/components/posts/CommentItem";
import { Comment } from "@/types/post";

interface FormProps {
    placeholder: string;
    isComment?: boolean;
    postId?: string;
}

const Form: React.FC<FormProps> = ({
    placeholder,
    isComment = false,
    postId,
}) => {
    const user = useCurrentUser();
    const [posts, setPosts] = useState<UnpopulatedPost[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            if (isComment && !postId) {
                throw new Error("postId is required when submitting a comment");
            }

            const url = isComment
                ? `/api/posts/${postId}/comments`
                : "/api/posts";
            setIsLoading(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: body,
                }),
            });

            if (response.status === 201) {
                let post = await response.json();
                setBody("");
                if (isComment) {
                    setComments([...comments, post]);
                } else {
                    setPosts([...posts, post]);
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [body, isComment, postId, comments, posts]);

    return (
        user && (
            <div className="border-b-[1px] border-neutral-800 px-5 py-2">
                <div className="flex flex-row gap-4">
                    <Avatar userId={user.userId} picture={user.picture} />

                    <div className="w-full">
                        <textarea
                            onChange={(event) => {
                                setBody(event.target.value);
                            }}
                            value={body}
                            maxLength={280}
                            className="
                disabled:opacity-80
                peer 
                mt-3 
                w-full 
                bg-black 
                ring-0 
                outline-none 
                text-[20px] 
                placeholder-neutral-500 
                text-white
                max-h-max
              "
                            placeholder={placeholder}
                        ></textarea>
                        <hr
                            className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition
                bg-emerald-600"
                        />
                        <div className="mt-4 flex flex-row justify-end">
                            <Button
                                disabled={isLoading || !body}
                                onClick={onSubmit}
                                label={isComment ? "Reply" : "Cast"}
                            />
                        </div>
                    </div>
                </div>
                {posts
                    .slice(0)
                    .reverse()
                    .map((post) => (
                        <PostItem key={post._id} post={post} />
                    ))}
                {comments
                    .slice(0)
                    .reverse()
                    .map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
            </div>
        )
    );
};

export default Form;
