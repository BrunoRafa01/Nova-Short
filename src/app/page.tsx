import { HomeClient } from "@/components/HomeClient";

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const initialTab = params?.tab === "downloader" ? "downloader" : "shortener";

  return <HomeClient initialTab={initialTab} />;
}
