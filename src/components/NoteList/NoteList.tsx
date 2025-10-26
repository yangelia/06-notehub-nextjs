"use client";

import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.viewLink}>
                View details
              </Link>
              <button className={css.button} onClick={() => onDelete(note.id)}>
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
