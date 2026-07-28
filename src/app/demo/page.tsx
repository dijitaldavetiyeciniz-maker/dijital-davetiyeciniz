import { redirect } from 'next/navigation';

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams(sp).toString();
  redirect(`/demo/elif-kerem${q ? `?${q}` : ''}`);
}
