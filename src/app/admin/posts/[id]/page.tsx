'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from '../_components/PostForm';
import { Category } from '@/types/Category';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Post } from '@/types/post';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  // 記事の更新
  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセル
    e.preventDefault();
    try {
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
    } catch (error) {
      alert('記事の更新に失敗しました。もう一度お試しください。');
    }
  };

  //記事の削除
  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return;

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
      });

      alert('記事を削除しました。');
    } catch (error) {
      alert('記事の削除に失敗しました。もう一度お試しください。');
    }

    router.push('/admin/posts');
  };

  //データ取得
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        const {post} : {post:Post} = await res.json();
        if (post) {
          setTitle(post.title || '');
          setContent(post.content || '');
          setThumbnailImageKey(post.thumbnailImageKey);
          setCategories(
            Array.isArray(post.postCategories)
              ? post.postCategories.map(
                  (pc: { category: Category }) => pc.category
                )
              : []
          );
        } else {
          alert('投稿データが見つかりません');
          // エラー状態を設定するか、ユーザーに通知する
        }
      } catch (error) {
        alert('投稿の取得中にエラーが発生しました:');
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
