'use client';

import React, { useEffect, useState } from 'react';
import { Post } from '@/types/post';
import Link from 'next/link';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    //データ取得
    const fetcher = async () => {
      try {
        const res = await fetch('/api/admin/posts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, //認証にトークンを使用。
          },
        });

        if (!res.ok) {
          if (res.status === 400) {
            throw new Error('Unauthorized');
          }
          throw new Error('Failed to fetch posts');
        }

        const { posts }: { posts: Post[] } = await res.json();
        setPosts([...posts]);
      } catch (error) {
        alert('データの取得に失敗しました。時間を空けて再度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [token]);

  if (!posts) return <div>記事が見つかりません</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 text-white p-2 rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {posts.map((post) => (
          <Link href={`/admin/posts/${post.id}`} key={post.id}>
            <div className="p-4 border rounded hover:bg-blue-100">
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
