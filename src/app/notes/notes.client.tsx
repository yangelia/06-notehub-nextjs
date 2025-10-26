"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import css from "./page.module.css";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import type { Note } from "@/types/note";
import type { AxiosError } from "axios";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";

const NotesClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleClearSearch = () => {
    setSearch("");
    updateURL(1, "");
  };

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    updateURL(1, value);
  }, 300);

  const updateURL = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (newSearch) params.set("search", newSearch);

    const queryString = params.toString();
    router.push(queryString ? `/notes?${queryString}` : "/notes", {
      scroll: false,
    });
  };

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search, 12),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation<
    Note,
    AxiosError,
    { title: string; content: string; tag: string }
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error("Error creating note:", err.message);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      alert(err.response?.data?.message ?? err.message);
    },
  });

  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    tag: string;
  }) => {
    createNoteMutation.mutate(noteData);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(newPage, search);
  };

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={debouncedSearchChange}
          onClear={handleClearSearch}
        />
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          + Create Note
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && (
        <ErrorMessage message={error?.message || "Something went wrong"} />
      )}

      {isSuccess && data && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
