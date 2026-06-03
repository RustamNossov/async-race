import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSort, SortField } from '../../store/winnersSlice';

import CarIcon from '../garage/CarIcon';
import styles from './WinnersTable.module.css';

function sortIcon(active: boolean, order: 'ASC' | 'DESC') {
  if (!active) return ' ↕';
  return order === 'ASC' ? ' ↑' : ' ↓';
}

function WinnersTable() {
  const dispatch = useAppDispatch();
  const { winners, loading, sortBy, sortOrder } = useAppSelector((s) => s.winners);

  const handleSort = (field: SortField) => dispatch(setSort(field));

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (winners.length === 0) return <p className={styles.message}>No winners yet. Start a race!</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th
            className={`${styles.th} ${styles.sortable} ${sortBy === 'id' ? styles.active : ''}`}
            onClick={() => handleSort('id')}
          >
            CAR NUMBER{sortIcon(sortBy === 'id', sortOrder)}
          </th>
          <th className={styles.th}>CAR ICON</th>
          <th
            className={`${styles.th} ${styles.sortable} ${sortBy === 'name' ? styles.active : ''}`}
            onClick={() => handleSort('name')}
          >
            NAME{sortIcon(sortBy === 'name', sortOrder)}
          </th>
          <th
            className={`${styles.th} ${styles.sortable} ${sortBy === 'wins' ? styles.active : ''}`}
            onClick={() => handleSort('wins')}
          >
            NUMBER OF WINS{sortIcon(sortBy === 'wins', sortOrder)}
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
        {winners.map((winner) => (
          <tr key={winner.id} className={styles.row}>
            <td className={styles.td}>{winner.id}</td>
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
