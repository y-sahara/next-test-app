'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from '../_components/PostForm';
import { Category } from '@/types/Category';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセル
    e.preventDefault();

    // 記事を作成します。
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
      body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
    });

    alert('記事を更新しました。');

    router.push('/admin/posts');
  };

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return;

    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
    });

    alert('記事を削除しました。');

    router.push('/admin/posts');
  };

  useEffect(() => {
    const fetcher = async () => {
      try{
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
      });
      const data  = await res.json();
      if (data && data.post) {
        const { post } = data;
        setTitle(post.title || '');
        setContent(post.content || '');
        setThumbnailImageKey(post.thumbnailImageKey);
        setCategories(
          Array.isArray(post.postCategories)
            ? post.postCategories.map((pc:{category:Category}) => pc.category)
            : []
        );
      } else {
        console.error('投稿データが見つかりません');
        // エラー状態を設定するか、ユーザーに通知する
      }
    } catch (error) {
      console.error('投稿の取得中にエラーが発生しました:', error);
      // エラー状態を設定するか、ユーザーに通知する
    }
  };

  if (id && token) {
    fetcher();
  }
}, [id, token]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
