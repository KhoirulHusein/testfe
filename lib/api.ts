export type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  status: "publish" | "draft" | "thrash";
};

// Semua error jadi Error dengan pesan yang bisa langsung ditampilkan.
// Error validasi backend (400 {errors: {...}}) dilempar sebagai ValidationError
// supaya form bisa nampilin per field.
export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super(Object.values(fields).join(", "));
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, init);
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Pastikan backend jalan di port 8080.");
  }
  const body = await res.json().catch(() => null);
  if (res.ok) return body as T;
  if (body?.errors) throw new ValidationError(body.errors);
  if (res.status === 404) throw new Error("Article tidak ditemukan.");
  // proxy Next balas 500 plain-text (body bukan JSON) kalau backend-nya mati
  if (!body)
    throw new Error("Tidak bisa terhubung ke server. Pastikan backend jalan di port 8080.");
  throw new Error(body.error ?? `Server error (${res.status}).`);
}

export const fetchAllPosts = () => call<Post[]>("/article/1000/0");

export const fetchPost = (id: string) => call<Post>(`/article/${id}`);

export const savePost = (post: Omit<Post, "id">, id?: number) =>
  call<unknown>(id ? `/article/${id}` : "/article", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
