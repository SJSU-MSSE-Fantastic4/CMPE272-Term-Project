"use client";

import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "@/components/Avatar";
import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import useLikes from "@/hooks/useLikes";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { isPopulatedPost } from "@/lib/post";
import Button from "@/components/Button";
import { useState } from "react";
import { set } from "date-fns";

interface PostItemProps {
    post: PopulatedPost | UnpopulatedPost;
    postedByCurrenyUser?: boolean;
}

const PostItem = ({ post, postedByCurrenyUser = false }: PostItemProps) => {
    const [showTranslation, setShowTranslation] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(undefined);

    const router = useRouter();
    const author = useUser(post.authorId);

    let commentCount;
    if (isPopulatedPost(post)) {
        commentCount = post.comments.length;
    } else {
        commentCount = post.commentsCount;
    }

    const { likes, likePost, unlikePost } = useLikes(post);

    const LikeIcon = likes.likedByUser ? AiFillHeart : AiOutlineHeart;

    const handleTranslateClick = async (e: any) => {
        e.stopPropagation();

        // If we are showing the translation, hide it
        if (showTranslation) {
            setShowTranslation(false);
            return;
        }

        // If we have already translated the post, show it
        if (translatedContent) {
            setShowTranslation(true);
            return;
        }

        // Otherwise, translate the post
        try {
            // Call your translation API here
            const translationRes = await fetch("/api/gpt/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: post.content,
                }),
            });

            let body = await translationRes.json();

            setTranslatedContent(body.message.content);
            setShowTranslation(true);
        } catch (error) {
            console.error("Error fetching translation:", error);
            // Handle translation error
        }
    };

    return (
        author && (
            <div
                onClick={() => {
                    router.push(`/posts/${post._id}`);
                }}
                className="
            border-b-[1px] 
            border-neutral-800 
            p-5 
            cursor-pointer 
            hover:bg-neutral-900 
            transition
          "
            >
                <div className="flex flex-row items-start gap-3">
                    <Avatar userId={author.userId} />
                    <div>
                        <div className="flex flex-row items-center gap-2">
                            <p
                                onClick={(event) => {
                                    router.push(`/users/${author.userId}`);
                                    event.stopPropagation();
                                }}
                                className="
                    text-white 
                    font-semibold 
                    cursor-pointer 
                    hover:underline
                "
                            >
                                {author.nickname || author.name}
                            </p>
                            <span
                                onClick={(event) => {
                                    router.push(`/users/${author.userId}`);
                                    event.stopPropagation();
                                }}
                                className="
                    text-neutral-500
                    cursor-pointer
                    hover:underline
                    hidden
                    md:block
                "
                            >
                                @{author.name}
                            </span>
                            <span className="text-neutral-500 text-sm">
                                {post.createdAt}
                            </span>
                        </div>
                        <div className="text-white mt-1 break-all">
                            {showTranslation ? translatedContent : post.content}
                        </div>
                        <div>
                            <div className="flex flex-row items-center mt-3 gap-10">
                                <div
                                    className="
                    flex 
                    flex-row 
                    items-center 
                    text-neutral-500 
                    gap-2 
                    cursor-pointer 
                    transition 
                    hover:text-sky-500
                "
                                >
                                    <AiOutlineMessage size={20} />
                                    <p>{commentCount}</p>
                                </div>
                                <div
                                    onClick={(event) => {
                                        likes.likedByUser
                                            ? unlikePost()
                                            : likePost();
                                        event.stopPropagation();
                                    }}
                                    className="
                    flex 
                    flex-row 
                    items-center 
                    text-neutral-500 
                    gap-2 
                    cursor-pointer 
                    transition 
                    hover:text-red-500
                "
                                >
                                    <LikeIcon
                                        color={likes.likedByUser ? "red" : ""}
                                        size={20}
                                    />
                                    <p>{likes.count}</p>
                                </div>
                                <div
                                    className="
              flex 
              flex-row 
              items-center 
              hover : undeline
              text-sm
              text-gray-300
              hover:underline
              gap-1"
                                >
                                    <p onClick={(e) => handleTranslateClick(e)}>
                                        {showTranslation
                                            ? "See Original"
                                            : "See Translation"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {postedByCurrenyUser ? (
                            <Button
                                onClick={async () => {
                                    let response = await fetch(
                                        `/api/posts/${post._id}`,
                                        {
                                            method: "DELETE",
                                        }
                                    );
                                    if (response.ok) {
                                        router.push("/");
                                    }
                                }}
                                label="Delete"
                            ></Button>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    );
};

export default PostItem;
