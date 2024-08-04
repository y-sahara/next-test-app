"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/types/post";
import { Category } from "@/types/Category";

export default function Page() {
  const [post, setPosts] = useState<Post | null>(null);
  const [error, setError] = useState(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const { post } = await res.json();
        setPosts(post);
        console.log(post);
        // setPosts(posts.find((p: Post) => p.id.toString() === id) || null);
      } catch (error: any) {
        setError(error.massage);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id]);

  if (loading) return <div>読み込み中</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <div key={post.id} className="postId">


<article className="max-w-2xl mx-auto px-4 py-8">
  <header className="mb-8">
    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
      <time className="font-medium">
        {new Date(post.createdAt).toLocaleDateString("ja-JP")}
      </time>
      <div className="flex space-x-2">
        {Array.isArray(post.postCategories)
          ? post.postCategories.map((post, index) => (
              <span
                key={`post.postCategory${index}`}
                className="px-2 py-1 bg-gray-200 rounded-full text-xs font-semibold"
              >
                {post.category.name}
              </span>
            ))
          : null}
      </div>
    </div>
    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
      {post.title}
    </h1>
  </header>
  <div
    className="prose prose-lg max-w-none whitespace-pre-wrap"
    dangerouslySetInnerHTML={{ __html: post.content }}
  ></div>
</article>
    </div>
  );
}
