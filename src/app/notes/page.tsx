import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const queryClient = getQueryClient();

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search, 12),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
