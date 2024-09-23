'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/types/post';
import { supabase } from '@/utils/supabase';

export default function Page() {
  const [post, setPosts] = useState<Post | null>(null);
  const [error, setError] = useState(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const {post}:{post:Post} = await res.json();
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

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

  if (loading) return <div>読み込み中</div>;
  if (!post) return <div>記事が見つかりません</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div key={post.id} className="pt-[74px]">
      <article className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <time className="font-medium">
              {new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </time>
            <div className="flex space-x-2">
              {Array.isArray(post.postCategories)
                ? post.postCategories.map((post, index) => (
                    <span
                      key={`post.postCategory${index}`}
                      className="inline-block bg-blue-200 rounded-full px-2 py-1 text-xs font-semibold"
                    >
                      {post.category.name}
                    </span>
                  ))
                : null}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-0">
            {post.title}
          </h1>
        </header>
        <div className="mb-8">
          {thumbnailImageUrl && (
            <div className={post.thumbnailImageKey}>
              <img
                src={thumbnailImageUrl}
                alt="thumbnail"
                height={600}
                width={600}
              />
            </div>
          )}
        </div>
        <div
          className="prose prose-lg max-w-none whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </article>
    </div>
  );
}
