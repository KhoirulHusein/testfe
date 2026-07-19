"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post, ValidationError, savePost } from "@/lib/api";

export default function PostForm({ initial, id }: { initial?: Post; id?: number }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function submit(status: "publish" | "draft") {
    setSaving(true);
    setErrors({});
    try {
      await savePost({ title, content, category, status }, id);
      router.push("/");
    } catch (e) {
      setErrors(
        e instanceof ValidationError ? e.fields : { _: (e as Error).message }
      );
    } finally {
      setSaving(false);
    }
  }

  const err = (k: string) =>
    errors[k] && <p className="text-red-600 text-sm mt-1">{errors[k]}</p>;

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {err("_")}
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 bg-white"
        />
        {err("title")}
      </div>
      <div>
        <label className="block font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border rounded p-2 bg-white"
        />
        {err("content")}
      </div>
      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2 bg-white"
        />
        {err("category")}
      </div>
      <div className="flex gap-3">
        <button
          disabled={saving}
          onClick={() => submit("publish")}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Publish
        </button>
        <button
          disabled={saving}
          onClick={() => submit("draft")}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Draft
        </button>
      </div>
    </form>
  );
}
