import styles from './RaceControls.module.css';

interface Props {
  onRaceStart: () => void;
  onRaceReset: () => void;
  onGenerate: () => void;
  isRacing: boolean;
  loading: boolean;
}

function RaceControls({ onRaceStart, onRaceReset, onGenerate, isRacing, loading }: Props) {
  return (
    <div className={styles.controls}>
      <button
        className={`${styles.btn} ${styles.race}`}
        onClick={onRaceStart}
        disabled={isRacing || loading}
        type="button"
      >
        RACE
      </button>
      <button
        className={`${styles.btn} ${styles.reset}`}
        onClick={onRaceReset}
        disabled={!isRacing}
        type="button"
      >
        RESET
      </button>
      <button
        className={`${styles.btn} ${styles.generate}`}
        onClick={onGenerate}
        disabled={isRacing || loading}
        type="button"
      >
        GENERATE CARS
      </button>
    </div>
  );
}

export default RaceControls;
