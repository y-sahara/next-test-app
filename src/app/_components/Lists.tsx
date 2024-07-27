'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MicroCmsPost, Post } from "../../types/post";

export const Lists = () => {
  const [posts, setPosts] = useState<MicroCmsPost[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    setIsLoading(true);
    const fetcher = async () => {
      const res = await fetch('api/posts', {// 管理画面で取得したエンドポイントを入力してください。
        headers: {// fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキーを入力してください。
        },
      })
      const { contents } = await res.json();
      setPosts(contents);
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
            href={`/posts/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
            <div className="postContent" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
          </Link>
        </div>
      )) : <div>投稿が見つかりません</div>}
    </div>
  );
};