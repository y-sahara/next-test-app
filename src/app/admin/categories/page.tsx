"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { Category } from "@/types/Category";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
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
