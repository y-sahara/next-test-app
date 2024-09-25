'use client';

import React from 'react';
import Link from 'next/link';
import { useSupabaseSession } from '../_hooks/useSupabaseSession';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };
  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-6 font-bold flex justify-between items-center z-50">
      <Link href="/" className="header-link text-xl">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
