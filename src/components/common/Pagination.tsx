import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function Pagination({ currentPage, totalCount, perPage, onPageChange, disabled = false }: Props) {
  const totalPages = Math.ceil(totalCount / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        {'<'}
      </button>
      <span className={styles.label}>PAGE {currentPage} of {totalPages}</span>
      <button
        className={styles.btn}
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        {'>'}
      </button>
    </div>
  );
}

export default Pagination;
