import { Category } from '@/types/Category';
import React from 'react';
import { CategoriesSelect } from './CategoriesSelect';
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, useState, useEffect } from 'react';

interface Props {
  mode: 'new' | 'edit';
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    //ファイルが選択されていない場合は終了
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }
    const file = event.target.files[0];
    //filepathを指定
    const filepath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    //エラーがある場合はアラートを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    //サムネイルURLを更新
    if (data && data.path) {
      setThumbnailImageKey(data.path);
    } else {
      alert('サムネイル画像のアップロードに失敗しました');
    }
  };

  useEffect(() => {
    if (!thumbnailImageKey) {
      return;
    }

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          サムネイルURL
        </label>
        <div className="relative">
          <input
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="thumbnailImageKey"
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block transition duration-300"
          >
            ファイルを選択
          </label>
          <span className="ml-3 text-sm text-gray-600">
            {/* 選択されたファイル名を表示 */}
            {thumbnailImageUrl
              ? '画像が選択されました'
              : 'ファイルが選択されていません'}
          </span>
        </div>
        {thumbnailImageUrl && (
          <img
            src={thumbnailImageUrl}
            alt="thumbnail"
            width={400}
            height={400}
            className="mt-4 rounded-lg shadow-md"
          />
        )}
      </div>
      <div className="mt-100">
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <button
        type="submit"
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
          削除
        </button>
      )}
    </form>
  );
};
