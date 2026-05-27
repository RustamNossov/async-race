import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setEditCar, removeCar, fetchCars } from '../../store/garageSlice';
import useCarAnimation from '../../hooks/useCarAnimation';
import { Car } from '../../api/types';
import { CARS_PER_PAGE } from '../../utils/constants';
import CarIcon from './CarIcon';
import styles from './CarItem.module.css';

interface Props {
  car: Car;
}

function CarItem({ car }: Props) {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((s) => s.garage.currentPage);
  const totalCount = useAppSelector((s) => s.garage.totalCount);
  const { trackRef, carRef, status, isRacing, handleStart, handleStop } = useCarAnimation(
    car.id,
    car.name,
  );

  const isDriving = status === 'driving' || status === 'started';
  const isIdle = status === 'idle';

  const handleSelect = () => {
    dispatch(setEditCar({ id: car.id, name: car.name, color: car.color }));
  };

  const handleDelete = async () => {
    await dispatch(removeCar(car.id));
    const lastPage = Math.max(1, Math.ceil((totalCount - 1) / CARS_PER_PAGE));
    const nextPage = Math.min(currentPage, lastPage);
    dispatch(fetchCars(nextPage));
  };

  return (
    <div className={styles.row}>
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.start}`}
          onClick={handleStart}
          disabled={!isIdle || isRacing}
          type="button"
          title="Start"
        >
          A
        </button>
        <button
          className={`${styles.btn} ${styles.stop}`}
          onClick={handleStop}
          disabled={isIdle || isRacing}
          type="button"
          title="Stop"
        >
          B
        </button>
        <button
          className={`${styles.btn} ${styles.select}`}
          onClick={handleSelect}
          disabled={isDriving}
          type="button"
          title="Select"
        >
          S
        </button>
        <button
          className={`${styles.btn} ${styles.delete}`}
          onClick={handleDelete}
          disabled={isDriving}
          type="button"
          title="Delete"
        >
          D
        </button>
      </div>

      <div className={styles.track} ref={trackRef}>
        <div className={`${styles.car} ${status === 'broken' ? styles.broken : ''}`} ref={carRef}>
          <CarIcon color={car.color} />
        </div>
        <span className={styles.name}>{car.name}</span>
        <span className={styles.finish}>FINISH</span>
      </div>
    </div>
  );
}

export default CarItem;
