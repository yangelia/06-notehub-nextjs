"use client";

import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && onPageChange(currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <ul className={css.pagination}>
      <li
        className={currentPage === 1 ? css.disabled : ""}
        onClick={handlePrev}
      >
        <a>‹</a>
      </li>

      {getPageNumbers().map((page) => (
        <li
          key={page}
          className={page === currentPage ? css.active : ""}
          onClick={() => onPageChange(page)}
        >
          <a>{page}</a>
        </li>
      ))}

      <li
        className={currentPage === totalPages ? css.disabled : ""}
        onClick={handleNext}
      >
        <a>›</a>
      </li>
    </ul>
  );
};

export default Pagination;
