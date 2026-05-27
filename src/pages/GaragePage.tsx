import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCars, addCar, setCurrentPage } from '../store/garageSlice';
import { resetRace, startRace, saveWinner, RaceWinner } from '../store/raceSlice';
import generateRandomCar from '../utils/randomCar';
import { CARS_PER_PAGE, RANDOM_CARS_COUNT } from '../utils/constants';
import CarForm from '../components/garage/CarForm';
import RaceControls from '../components/garage/RaceControls';
import CarList from '../components/garage/CarList';
import WinnerBanner from '../components/garage/WinnerBanner';
import Pagination from '../components/common/Pagination';
import styles from './GaragePage.module.css';

function GaragePage() {
  const dispatch = useAppDispatch();
  const { currentPage, totalCount, loading } = useAppSelector((s) => s.garage);
  const isRacing = useAppSelector((s) => s.race.isRacing);
  const winner = useAppSelector((s) => s.race.winner);

  useEffect(() => {
    dispatch(fetchCars(currentPage));
  }, [dispatch, currentPage]);

  // Save the race winner to the winners API exactly once per race
  const prevWinnerRef = useRef<RaceWinner | null>(null);
  useEffect(() => {
    if (winner !== null && prevWinnerRef.current === null && isRacing) {
      dispatch(saveWinner({ id: winner.id, time: winner.time }));
    }
    prevWinnerRef.current = winner;
  }, [winner, isRacing, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleGenerate = async () => {
    const cars = Array.from({ length: RANDOM_CARS_COUNT }, generateRandomCar);
    await Promise.all(cars.map(({ name, color }) => dispatch(addCar({ name, color }))));
    dispatch(fetchCars(currentPage));
  };

  const handleRaceStart = () => {
    dispatch(startRace());
  };

  const handleRaceReset = () => {
    dispatch(resetRace());
    dispatch(fetchCars(currentPage));
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <RaceControls
          onRaceStart={handleRaceStart}
          onRaceReset={handleRaceReset}
          onGenerate={handleGenerate}
          isRacing={isRacing}
          loading={loading}
        />
        <CarForm />
      </div>

      <h2 className={styles.title}>GARAGE ({totalCount})</h2>

      <CarList />

      <div className={styles.footer}>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={CARS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <WinnerBanner />
    </div>
  );
}

export default GaragePage;
