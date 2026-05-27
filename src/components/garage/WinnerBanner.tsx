import { useAppSelector } from '../../store/hooks';
import styles from './WinnerBanner.module.css';

function WinnerBanner() {
  const winner = useAppSelector((s) => s.race.winner);
  const isRacing = useAppSelector((s) => s.race.isRacing);

  if (!winner || !isRacing) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <p className={styles.label}>WINNER:</p>
        <p className={styles.name}>{winner.name}</p>
        <p className={styles.time}>TIME: {winner.time} S</p>
      </div>
    </div>
  );
}

export default WinnerBanner;
