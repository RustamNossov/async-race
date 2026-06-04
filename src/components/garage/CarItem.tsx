import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setEditCar, clearEdit, removeCar, fetchCars, setCurrentPage } from '../../store/garageSlice';
import useCarAnimation from '../../hooks/useCarAnimation';
import { Car } from '../../api/types';
import { CARS_PER_PAGE } from '../../utils/constants';
import CarIcon from './CarIcon';
import PlayIcon from '../common/PlayIcon';
import ResetIcon from '../common/ResetIcon';
import styles from './CarItem.module.css';

interface Props {
  car: Car;
}

function CarItem({ car }: Props) {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((s) => s.garage.currentPage);
  const totalCount = useAppSelector((s) => s.garage.totalCount);
  const editId = useAppSelector((s) => s.garage.editId);
  const isSelected = editId === car.id;
  const winner = useAppSelector((s) => s.race.winner);
  const isWinner = useAppSelector((s) => s.race.isRacing) && winner?.id === car.id;
  const { trackRef, carRef, status, isRacing, handleStart, handleStop } = useCarAnimation(
    car.id,
    car.name,
  );

  const isDriving = status === 'driving' || status === 'started';
  const isIdle = status === 'idle';

  const handleSelect = () => {
    if (isSelected) {
      dispatch(clearEdit());
    } else {
      dispatch(setEditCar({ id: car.id, name: car.name, color: car.color }));
    }
  };

  const handleDelete = async () => {
    dispatch(clearEdit());
    await dispatch(removeCar(car.id));
    const lastPage = Math.max(1, Math.ceil((totalCount - 1) / CARS_PER_PAGE));
    const nextPage = Math.min(currentPage, lastPage);
    if (nextPage !== currentPage) {
      dispatch(setCurrentPage(nextPage));
    } else {
      dispatch(fetchCars(currentPage));
    }
  };

  return (
    <div className={`${styles.row} ${isSelected ? styles.rowSelected : ''} ${isWinner ? styles.rowWinner : ''}`}>
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.start}`}
          onClick={() => { dispatch(clearEdit()); handleStart(); }}
          disabled={!isIdle || isRacing}
          type="button"
          title="Race the car"
        >
          <PlayIcon size={15} />
        </button>
        <button
          className={`${styles.btn} ${styles.select} ${isSelected ? styles.selectActive : ''}`}
          onClick={handleSelect}
          disabled={isDriving}
          type="button"
          title="Select"
        >
          Select
        </button>
        <button
          className={`${styles.btn} ${styles.stop}`}
          onClick={() => { dispatch(clearEdit()); handleStop(); }}
          disabled={isIdle || isRacing}
          type="button"
          title="Reset"
        >
          <ResetIcon size={15} />
        </button>
        <button
          className={`${styles.btn} ${styles.delete}`}
          onClick={handleDelete}
          disabled={isDriving}
          type="button"
          title="Delete"
        >
          Remove
        </button>
      </div>

      <div className={styles.track} ref={trackRef}>
        <div className={`${styles.car} ${status === 'broken' ? styles.broken : ''}`} ref={carRef}>
          <CarIcon color={car.color} />
        </div>
        <span className={`${styles.name} ${isDriving ? styles.nameHidden : ''}`}>{car.name}</span>
        <div className={styles.finishZone}>
          <span className={styles.finishLabel}>FINISH</span>
        </div>
      </div>
    </div>
  );
}

export default CarItem;
