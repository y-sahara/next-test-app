"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouteGuard } from "../_hooks/useRouteGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard()
  
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
<div className="flex min-h-screen pt-[76px]">
      <aside className="fixed bg-gray-100 w-[280px] left-0 top-0 bottom-0 pt-[76px] overflow-y-auto">
       
        <Link
          href="/admin/posts"
          className={`p-4 block hover:bg-blue-100 ${isSelected("/admin/posts") }
        }`}
        >
          記事一覧
        </Link>

        <Link
          href="/admin/categories"
          className={`p-4 block hover:bg-blue-100 ${isSelected("/admin/posts") }
        }`}
        >
          カテゴリ一覧
        </Link>
      </aside>

      <div className="flex-grow ml-[280px] p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
