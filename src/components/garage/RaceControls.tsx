import PlayIcon from '../common/PlayIcon';
import ResetIcon from '../common/ResetIcon';
import { MAX_CARS } from '../../utils/constants';
import styles from './RaceControls.module.css';

interface Props {
  onRaceStart: () => void;
  onRaceReset: () => void;
  onGenerate: () => void;
  isRacing: boolean;
  loading: boolean;
  totalCount: number;
}

function RaceControls({ onRaceStart, onRaceReset, onGenerate, isRacing, loading, totalCount }: Props) {
  return (
    <div className={styles.controls}>
      <button
        className={`${styles.btn} ${styles.race}`}
        onClick={onRaceStart}
        disabled={isRacing || loading || totalCount === 0}
        type="button"
      >
        RACE <PlayIcon size={15} />
      </button>
      <button
        className={`${styles.btn} ${styles.reset}`}
        onClick={onRaceReset}
        disabled={!isRacing}
        type="button"
      >
        RESET <ResetIcon size={15} />
      </button>
      <button
        className={`${styles.btn} ${styles.generate}`}
        onClick={onGenerate}
        disabled={isRacing || loading || totalCount >= MAX_CARS}
        type="button"
      >
        GENERATE CARS {totalCount >= MAX_CARS ? `(${MAX_CARS} max)` : ''}
      </button>
    </div>
  );
}

export default RaceControls;
