"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Category } from "@/types/Category";
import { Post } from "@/types/post";
import Image from "next/image";

export default function Posts() {
  const [post, setPosts] = useState<Post | null>(null);
  const [error, setError] = useState(null)
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/posts/${id}')
        if (!res.ok) {
          throw new Error('Failed to fetch posts')
        }
        const { posts } = await res.json()
        setPosts(posts)
        // setPosts(posts.find((p: Post) => p.id.toString() === id) || null);
      } catch (error: any) {
        setError(error.massage)
      } finally {
        setLoading(false)
      }
    }
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
      <Image
        height={190}
        width={1200}
        src={post.thumbnailUrl}
        alt=""
        className=""
      />

      <div className="postHead">
        <div className="postCreatedAt">
          {new Date(post.createdAt).toLocaleDateString("ja-JP")}
        </div>
        <div className="postCategories">
          {Array.isArray(post.postCategories)
            ? post.postCategories.map((category, index) => (
              <div key={'${category.category.id} ||index}'} className="postCategory">
                {category.category.name}
              </div>
            ))
            : null}
        </div>
      </div>
      <div className="postTitle">{post.title}</div>
      <div className="post" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div >
  );
}