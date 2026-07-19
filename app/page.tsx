"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post, fetchAllPosts, savePost } from "@/lib/api";

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const TABS = [
  { status: "publish", label: "Published" },
  { status: "draft", label: "Drafts" },
  { status: "thrash", label: "Trashed" },
] as const;

export default function AllPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<Post["status"]>("publish");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function trash(post: Post) {
    setError("");
    try {
      await savePost({ ...post, status: "thrash" }, post.id);
      setPosts((ps) =>
        ps.map((p) => (p.id === post.id ? { ...p, status: "thrash" } : p))
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const visible = posts.filter((p) => p.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex gap-2 border-b mb-4">
        {TABS.map((t) => (
          <button
            key={t.status}
            onClick={() => setTab(t.status)}
            className={`px-4 py-2 -mb-px border-b-2 ${
              tab === t.status
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent hover:text-blue-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="text-left border-b bg-gray-100">
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">
                <span className="inline-flex gap-3 items-center text-gray-500">
                  <Link href={`/edit/${p.id}`} title="Edit" aria-label="Edit" className="hover:text-blue-600">
                    <EditIcon />
                  </Link>
                  {p.status !== "thrash" && (
                    <button onClick={() => trash(p)} title="Trash" aria-label="Trash" className="hover:text-red-600">
                      <TrashIcon />
                    </button>
                  )}
                </span>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-gray-500">
                {loading ? "Loading…" : "Tidak ada article"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
