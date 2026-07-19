"use client";

import { useEffect, useState } from "react";
import { Post, fetchAllPosts } from "@/lib/api";

const PER_PAGE = 5;

export default function Preview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts()
      .then((ps) => setPosts(ps.filter((p) => p.status === "publish")))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-6">
        {visible.map((p) => (
          <article key={p.id} className="bg-white border rounded p-5">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-sm text-blue-600 mb-2">{p.category}</p>
            <p className="whitespace-pre-wrap text-gray-700">{p.content}</p>
          </article>
        ))}
        {posts.length === 0 && !error && (
          <p className="text-gray-500">
            {loading ? "Loading…" : "Belum ada article yang dipublish"}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 border rounded ${
                n === page ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
