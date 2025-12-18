import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    if (pageNum !== currentPage) {
      onPageChange(pageNum);
    }
  };

  return (
    <div className='flex items-center justify-between bg-white rounded shadow-sm p-4'>
      <div className='text-sm text-gray-600'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className='btn-outline px-4 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <ChevronLeft className='w-4 h-4' />
          Previous
        </button>

        {/* Page Numbers */}
        <div className='flex gap-1'>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            // Show first, last, current, and adjacent pages
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(pageNum - currentPage) <= 1
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {pageNum}
                </button>
              );
            } else if (
              pageNum === currentPage - 2 ||
              pageNum === currentPage + 2
            ) {
              return (
                <span key={pageNum} className='px-2 text-gray-400'>
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className='btn-outline px-4 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
