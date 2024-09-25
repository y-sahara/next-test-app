"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types/post";

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

  
  if (!posts) return <div>記事が見つかりません</div>;
  if (loading) return <div>読み込み中</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-[74px]">
      { !posts && <div>投稿が見つかりません</div> }
        {posts.map((post) => (
          <div key={post.id} className="mx-60 my-12 border-4 p-4 rounded-3xl hover:bg-blue-100">
            <Link
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="flex justify-between  mb-2">
                <div className="postCreatedAt">
                  {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                </div>
                <div className="postCategories">
                  {Array.isArray(post.postCategories)&&post.postCategories &&
                    post.postCategories.map((post, index) => (
                      <div key={index} className="inline-block bg-blue-200 rounded-full px-2 py-1 text-xs font-semibold">
                        {post.category.name}
                      </div>
                    ))}
                </div>
              </div>
              <div className="text-2xl font-bold mb-4">{post.title}</div>
              <div
                className="mt-6 mb-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </Link>
          </div>
        ))
      }
    </div>
  );
};
