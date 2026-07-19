"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "All Posts" },
  { href: "/add", label: "Add New" },
  { href: "/preview", label: "Preview" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-6 flex gap-6 font-medium justify-end">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`py-3 border-b-2 -mb-px ${
              pathname === l.href
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-blue-600"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
