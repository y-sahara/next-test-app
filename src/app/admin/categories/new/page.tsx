'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '../_components/CategoryForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { token } = useSupabaseSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //デフォルト動作をキャンセル。

    //
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
      body: JSON.stringify({ name }),
    });

    const { id } = await res.json();

    // 作成したカテゴリーの詳細ページに遷移します。
    router.push(`/admin/categories/${id}`);

    alert('カテゴリーを作成しました。');
    router.push('/admin/categories');
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
