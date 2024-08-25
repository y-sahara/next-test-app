"use client";

import { supabase } from "@/utils/supabase";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      setEmail("");
      setPassword("");
      alert("確認メールを送信しました");
    }
  };
  return (
    <div className="flex justify-center items-center pt-[180px]">
        <div className="w-full max-w-[400px] px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
            placeholder="name@compnay.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 pt-5"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            登録
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
