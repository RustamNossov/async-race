import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCars, addCar, setCurrentPage, clearEdit, deleteAllCars } from '../store/garageSlice';
import { resetRace, raceAllCars, saveWinner, stopAllEngines, RaceWinner } from '../store/raceSlice';
import generateRandomCar from '../utils/randomCar';
import { CARS_PER_PAGE, RANDOM_CARS_COUNT } from '../utils/constants';
import CarForm from '../components/garage/CarForm';
import RaceControls from '../components/garage/RaceControls';
import CarList from '../components/garage/CarList';
import WinnerBanner from '../components/garage/WinnerBanner';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import styles from './GaragePage.module.css';

function GaragePage() {
  const dispatch = useAppDispatch();
  const { currentPage, loadedPage, totalCount, loading } = useAppSelector((s) => s.garage);
  const isRacing = useAppSelector((s) => s.race.isRacing);
  const allCarsSettled = useAppSelector((s) => s.race.allCarsSettled);
  const runningCarIds = useAppSelector((s) =>
    Object.keys(s.race.cars).map(Number).filter((id) => s.race.cars[id].status !== 'idle'),
  );
  const winner = useAppSelector((s) => s.race.winner);

  useEffect(() => {
    if (loadedPage !== currentPage) {
      dispatch(fetchCars(currentPage));
    }
  }, [dispatch, currentPage, loadedPage]);

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
    dispatch(clearEdit());
    dispatch(raceAllCars());
  };

  const handleRaceReset = () => {
    dispatch(clearEdit());
    dispatch(stopAllEngines(runningCarIds));
    dispatch(resetRace());
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAll = async () => {
    setShowDeleteModal(false);
    dispatch(clearEdit());
    dispatch(resetRace());
    await dispatch(deleteAllCars());
    dispatch(setCurrentPage(1));
    dispatch(fetchCars(1));
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
          totalCount={totalCount}
        />
        <CarForm />
      </div>

      <h2 className={styles.title}>GARAGE ({totalCount})</h2>

      <CarList />

      <div className={styles.footer}>
        <button
          className={styles.deleteAll}
          onClick={() => setShowDeleteModal(true)}
          disabled={totalCount === 0 || isRacing}
          type="button"
        >
          DELETE ALL CARS
        </button>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={CARS_PER_PAGE}
          onPageChange={handlePageChange}
          disabled={isRacing && !allCarsSettled}
        />
      </div>

      {showDeleteModal && (
        <ConfirmModal
          message="Delete all cars? This cannot be undone."
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <WinnerBanner />
    </div>
  );
}

export default GaragePage;
