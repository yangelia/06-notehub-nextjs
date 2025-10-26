import axios from "axios";
import type { Note, CreateNoteRequest } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(
    `${BASE_URL}/notes?search=${search}&page=${page}&perPage=${perPage}`,
    { headers }
  );
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, note, {
    headers,
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};
