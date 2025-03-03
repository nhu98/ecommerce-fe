import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [displayedPages, setDisplayedPages] = useState(
    calculateDisplayedPages(currentPage, totalPages),
  );

  const handlePageClick = (page: number) => {
    onPageChange(page);
    setDisplayedPages(calculateDisplayedPages(page, totalPages));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
            className={
              currentPage !== 1
                ? 'cursor-pointer px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled'
                : 'cursor-not-allowed'
            }
            isActive={currentPage !== 1}
          />
        </PaginationItem>

        {displayedPages.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={() => handlePageClick(page as number)}
                className={`cursor-pointer px-3 py-2 rounded-md ${currentPage === page ? 'bg-gray-200 hover:bg-gray-300' : ' hover:bg-gray-300'}`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              handlePageClick(Math.min(totalPages, currentPage + 1))
            }
            className={
              currentPage !== totalPages
                ? 'cursor-pointer px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled'
                : 'cursor-not-allowed'
            }
            isActive={currentPage !== totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// Hàm tính toán các trang được hiển thị
function calculateDisplayedPages(currentPage: number, totalPages: number) {
  const maxPageNumbersToShow = 5;
  const pages = [];

  if (totalPages <= maxPageNumbersToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2),
    );
    let endPage = Math.min(
      totalPages,
      currentPage + Math.floor(maxPageNumbersToShow / 2),
    );

    if (startPage <= 3) {
      endPage = Math.min(totalPages, maxPageNumbersToShow);
      startPage = 1;
    }

    if (endPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
      endPage = totalPages;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  return pages;
}

export default PaginationComponent;
