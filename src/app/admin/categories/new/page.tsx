'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '../_components/CategoryForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Post } from '@/types/post';

export default function Page() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { token } = useSupabaseSession();

  //新規カテゴリ作成
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //デフォルト動作をキャンセル。
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ name }),
      });

      alert('カテゴリーを作成しました。');
      router.push('/admin/categories');
    } catch (error) {
      alert('カテゴリーの作成に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
