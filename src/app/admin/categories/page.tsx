'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { Category } from '@/types/Category';
import { headers } from 'next/headers';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSupabaseSession();

  //データの取得
  useEffect(() => {
    const fetcher = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/admin/categories', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        
        if (!res.ok) {
          throw new Error('カテゴリの取得に失敗しました。時間をおいて再度お試しください。');
        }
        const { categories } = await res.json();
        setCategories(categories);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">カテゴリ一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {categories.map((category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl ">{category.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
