"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@/types/post";
import Link from "next/link";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/posts");
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 text-white p-2 rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {posts.map((post) => (
          <Link href={`/admin/posts/${post.id}`} key={post.id}>
            <div className="p-4 border rounded hover:bg-gray-100">
              <div className="text-black text-xl font-bold">{post.title}</div>
              <div className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
