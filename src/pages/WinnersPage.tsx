import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWinners, setCurrentPage } from '../store/winnersSlice';
import { WINNERS_PER_PAGE } from '../utils/constants';
import WinnersTable from '../components/winners/WinnersTable';
import Pagination from '../components/common/Pagination';
import styles from './WinnersPage.module.css';

function WinnersPage() {
  const dispatch = useAppDispatch();
  const { currentPage, totalCount, sortBy, sortOrder } = useAppSelector((s) => s.winners);

  useEffect(() => {
    dispatch(fetchWinners({ page: currentPage, sortBy, sortOrder }));
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>WINNERS ({totalCount})</h2>
      <WinnersTable />
      <div className={styles.footer}>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={WINNERS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default WinnersPage;
