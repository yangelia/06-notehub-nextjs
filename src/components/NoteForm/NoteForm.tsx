"use client";

import { useState } from "react";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (note: { title: string; content: string; tag: string }) => void;
  onClose: () => void;
}

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteForm = ({ onSubmit, onClose }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, content, tag });

    setTitle("");
    setContent("");
    setTag("Todo");
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2>Create new note</h2>

      <div className={css.formGroup}>
        <label>Title</label>
        <input
          className={css.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Save
        </button>
        <button type="button" onClick={onClose} className={css.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
