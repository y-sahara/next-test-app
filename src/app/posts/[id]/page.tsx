"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MicroCmsPost, Post } from "@/app/_types/interface";

export default function Posts() {
  const [post, setPosts] = useState<MicroCmsPost | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetcher = async () => {
      const res = await fetch(
        `https://f11kzf9pqd.microcms.io/api/v1/posts/${id}`,// microCMSのエンドポイント
        {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, // APIキーをセット
          },
        },
      )
      const data = await res.json();
      setPosts(data);
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
      <img src={post.thumbnail.url} alt="Post thumbnail" />

      <div className="postHead">
        <div className="postCreatedAt">
          {new Date(post.createdAt).toLocaleDateString("ja-JP")}
        </div>
        <div className="postCategories">
          {post.categories.map((category, index) => (
            <div key={index} className="postCategory">
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <div className="postTitle">{post.title}</div>
      <div className="post" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div >
  );
};