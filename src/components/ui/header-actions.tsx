import Link from "next/link";

export function HeaderActions() {
  return (
    <div className="flex items-center justify-self-end gap-3">
      <Link
        href="/dashboard"
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-black/4"
      >
        Dashboard
      </Link>
      <Link href="/" className="text-sm font-medium text-muted transition hover:text-foreground">
        Sign in
      </Link>
    </div>
  );
}
