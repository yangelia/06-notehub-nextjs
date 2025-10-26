"use client";

import css from "./error.module.css";

type ErrorMessageProps = {
  error: Error;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className={css.text}>
      Could not fetch the list of notes. {error.message}
    </p>
  );
}
