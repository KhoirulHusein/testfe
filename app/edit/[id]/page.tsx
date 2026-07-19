"use client";

import { use, useEffect, useState } from "react";
import { Post, fetchPost } from "@/lib/api";
import PostForm from "@/components/post-form";

export default function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost(id).then(setPost).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p className="text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <PostForm initial={post} id={post.id} />
    </div>
  );
}
