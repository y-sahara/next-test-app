'use client'

import React from "react";
import Link from "next/link"

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="siteName">
        <Link href={`/`} style={{ textDecoration: "none", color: "inherit" }}>
          Blog
        </Link>
      </div>
      <div className="toSupportPage">
        <Link
          href={`/contact`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          お問い合わせ
        </Link>
      </div>
    </header>
  );
};