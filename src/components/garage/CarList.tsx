import { useAppSelector } from '../../store/hooks';
import CarItem from './CarItem';
import styles from './CarList.module.css';

function CarList() {
  const { cars, loading } = useAppSelector((s) => s.garage);

  if (loading) {
    return <p className={styles.message}>Loading...</p>;
  }

  if (cars.length === 0) {
    return <p className={styles.message}>No cars in the garage yet. Create some!</p>;
  }

  return (
    <div className={styles.list}>
      {cars.map((car) => (
        <CarItem key={car.id} car={car} />
      ))}
    </div>
  );
}

export default CarList;
