'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "../interface";

export const Lists = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetcher = async () => {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
      );
      const data = await res.json();
      setPosts(data.posts);
      setIsLoading(false)
    };
    fetcher();
  }, []);

  if (isLoading) {
    return (
      <div>読み込み中</div>
    )
  }


  return (
    <div className="posts">
      {posts ? posts.map((post) => (
        <div key={post.id} className="postIds">
          <Link
            href={`/article/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
            <div className="postContent">{post.content}</div>
          </Link>
        </div>
      )) : <div>投稿が見つかりません</div>}
    </div>
  );
};