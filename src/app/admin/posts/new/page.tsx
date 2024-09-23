'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '../_components/PostForm';
import { Category } from '@/types/Category';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { token } = useSupabaseSession();

  // 記事の作成
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
      });
      alert('記事を作成しました。');
      // 記事一覧ページへの遷移
      router.push(`/admin/posts/`);

    } catch (error) {
      alert('記事の作成に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
