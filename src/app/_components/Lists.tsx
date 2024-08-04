"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types/post";
import { Category } from "@/types/Category";

export const Lists = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const { posts } = await res.json();

        setPosts(posts);

      } catch (error: any) {
        setError(error.massage);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) return <div>読み込み中</div>;
  if (error) return <div>Error: {error}</div>;
  if (!posts) return <div>記事が見つかりません</div>;

  return (
    <div className="posts">
      {posts ? (
        posts.map((post) => (
          <div key={post.id} className="postIds p-4 border rounded hover:bg-blue-100">
            <Link
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="postHead">
                <div className="postCreatedAt">
                  {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                </div>
                <div className="postCategories">
                  {Array.isArray(post.postCategories)&&post.postCategories &&
                    post.postCategories.map((post, index) => (
                      <div key={index} className="postCategory">
                        {post.category.name}
                      </div>
                    ))}
                </div>
              </div>
              <div className="postTitle">{post.title}</div>
              <div
                className="postContent"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </Link>
          </div>
        ))
      ) : (
        <div>投稿が見つかりません</div>
      )}
    </div>
  );
};
