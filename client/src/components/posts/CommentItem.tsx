"use client";

import Avatar from "@/components/Avatar";
import { Comment, PopulatedPost, UnpopulatedPost } from "@/types/post";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

interface CommentItemProps {
    comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
    const router = useRouter();
    const commenter = useUser(comment.commenterId);

    return (
        commenter && (
            <div
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
                    <Avatar userId={commenter.userId} />
                    <div>
                        <div className="flex flex-row items-center gap-2">
                            <p
                                onClick={(event) => {
                                    router.push(`/users/${commenter.userId}`);
                                    event.stopPropagation();
                                }}
                                className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            "
                            >
                                {commenter.nickname || commenter.name}
                            </p>
                            <span
                                onClick={(event) => {
                                    router.push(`/users/${commenter.userId}`);
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
                                @{commenter.name}
                            </span>
                            <span className="text-neutral-500 text-sm">
                                {comment.createdAt}
                            </span>
                        </div>
                        <div className="text-white mt-1">{comment.content}</div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CommentItem;
