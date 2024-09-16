'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CategoryForm } from '../_components/CategoryForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorizaion: token!,
      },
      body: JSON.stringify({ name }),
    });
    alert('カテゴリーを更新しました。');
  };

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorizaion: token!,
      },
    });
    alert('カテゴリーを削除しました。');
    router.push('/admin/categories');
  };

  useEffect(() => {
    const fetcher = async () => {
      // setIsLoading(true);
      // try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorizaion: token!,
        },
      });
      const { category } = await res.json();
      setName(category?.name);
    };

    fetcher();
  }, [id]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリ編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
