'use client'
import react, { useState } from "react";
import { formData } from '@/types/post';
import { ErrorMessages } from "@/types/post";

export default function Contact() {
  const [formData, setFormData] = useState<formData | null>({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<ErrorMessages | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // バリデーションルール
  const validate = () => {
    let tempErrors: ErrorMessages = {};

    if (!formData?.name) {
      tempErrors.name = "お名前は必須です。";
    } else {
      tempErrors.name = "";
    }

    if (!formData?.email) {
      tempErrors.email = "メールアドレスは必須です。";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "有効なメールアドレスを入力してください";
    } else {
      tempErrors.email = "";
    }

    if (!formData?.message) {
      tempErrors.message = "本文は必須です。";
    } else if (formData.message.length > 500) {
      tempErrors.message = "本文は500文字以内で入力してください。";
    } else {
      tempErrors.message = "";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("送信しました");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        // サーバーからのエラーレスポンスを処理
        alert("送信に失敗しました");
      }
    } catch (error) {
      console.error("送信エラー", error);
      alert("送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="max-w-[800px] mx-auto py-10" >
      <h2 className="text-xl font-bold mb-10">問い合わせフォーム</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label htmlFor="name">お名前</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="error-container">
            {errors?.name && <div className="error-message">{errors.name}</div>}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="error-container">
            {errors?.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label htmlFor="message">本文</label>
            <textarea
              id="message"
              name="message"
              value={formData?.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={6}
            />
          </div>
          <div className="error-container">
            {errors?.message && (
              <div className="error-message">{errors.message}</div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt">
          <button type="submit" className="submit" disabled={isSubmitting}>
            送信
          </button>
          <div style={{ width: "30px" }} />
          <button
            type="button"
            className="clear"
            onClick={handleClear}
            disabled={isSubmitting}
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
}