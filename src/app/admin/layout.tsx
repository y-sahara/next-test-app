"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <>
      <aside className="fixed bg-gray-100 w-[280px] left-0 bottom-0 top-[100px]">
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
          カテゴリー一覧
        </Link>
      </aside>

      <div className="ml-[280px] p-4">{children}</div>
    </>
  );
}
