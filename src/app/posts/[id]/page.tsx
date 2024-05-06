"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/interface";

export default function Posts() {
  const [post, setPosts] = useState<Post | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetcher = async () => {
      const res = await fetch(
        `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`
      );
      const { post } = await res.json();
      setPosts(post);
      setIsLoading(false);
    };
    fetcher();
  }, [id]);

  if (isLoading) {
    return (
      <div>読み込み中</div>
    )
  }

  if (!post) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div key={post.id} className="postId">
      <img src={post.thumbnailUrl} alt="Post thumbnail" />

      <div className="postHead">
        <div className="postCreatedAt">
          {new Date(post.createdAt).toLocaleDateString("ja-JP")}
        </div>
        <div className="postCategories">
          {post.categories.map((category, index) => (
            <div key={index} className="postCategory">
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="postTitle">{post.title}</div>
      <div className="post">{post.content}</div>
    </div>
  );
};