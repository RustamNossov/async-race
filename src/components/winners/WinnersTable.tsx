import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSort, SortField } from '../../store/winnersSlice';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import CarIcon from '../garage/CarIcon';
import styles from './WinnersTable.module.css';

function sortIcon(active: boolean, order: 'ASC' | 'DESC') {
  if (!active) return ' ↕';
  return order === 'ASC' ? ' ↑' : ' ↓';
}

function WinnersTable() {
  const dispatch = useAppDispatch();
  const { winners, loading, sortBy, sortOrder, currentPage } = useAppSelector((s) => s.winners);

  const handleSort = (field: SortField) => dispatch(setSort(field));

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (winners.length === 0) return <p className={styles.message}>No winners yet. Start a race!</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>№</th>
          <th className={styles.th}>CAR</th>
          <th className={styles.th}>NAME</th>
          <th
            className={`${styles.th} ${styles.sortable} ${sortBy === 'wins' ? styles.active : ''}`}
            onClick={() => handleSort('wins')}
          >
            WINS{sortIcon(sortBy === 'wins', sortOrder)}
          </th>
          <th
            className={`${styles.th} ${styles.sortable} ${sortBy === 'time' ? styles.active : ''}`}
            onClick={() => handleSort('time')}
          >
            BEST TIME (S){sortIcon(sortBy === 'time', sortOrder)}
          </th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner, index) => (
          <tr key={winner.id} className={styles.row}>
            <td className={styles.td}>{(currentPage - 1) * WINNERS_PER_PAGE + index + 1}</td>
            <td className={styles.td}>
              <CarIcon color={winner.color} />
            </td>
            <td className={styles.td}>{winner.name}</td>
            <td className={styles.td}>{winner.wins}</td>
            <td className={styles.td}>{winner.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WinnersTable;
