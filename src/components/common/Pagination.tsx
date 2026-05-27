import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalCount, perPage, onPageChange }: Props) {
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        {'<'}
      </button>
      <span className={styles.label}>PAGE #{currentPage}</span>
      <button
        className={styles.btn}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        {'>'}
      </button>
    </div>
  );
}

export default Pagination;
