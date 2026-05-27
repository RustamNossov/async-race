import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCarStatus, setWinner, CarStatus, RaceWinner } from '../store/raceSlice';
import { startEngine, stopEngine, drive } from '../api/client';
import ApiError from '../api/ApiError';

function buildAnimation(
  trackEl: HTMLDivElement,
  carEl: HTMLDivElement,
  duration: number,
): Animation {
  const targetX = trackEl.clientWidth - carEl.clientWidth;
  return carEl.animate(
    [{ transform: 'translateX(0px)' }, { transform: `translateX(${targetX}px)` }],
    { duration, fill: 'forwards', easing: 'linear' },
  );
}

function commitAndCancel(anim: Animation): void {
  try {
    anim.commitStyles();
  } catch {
    /* commitStyles not available when animation is not in effect phase */
  }
  anim.cancel();
}

export default function useCarAnimation(carId: number, carName: string) {
  const dispatch = useAppDispatch();
  const carData = useAppSelector((s) => s.race.cars[carId]);
  const status: CarStatus = carData?.status ?? 'idle';
  const isRacing = useAppSelector((s) => s.race.isRacing);
  const startSignal = useAppSelector((s) => s.race.startSignal);

  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const stoppedRef = useRef(false);

  // Mutable ref so handlers always read the latest status without being recreated
  const statusRef = useRef<CarStatus>(status);
  statusRef.current = status;

  const resetPosition = useCallback(() => {
    if (carRef.current) carRef.current.style.transform = 'translateX(0)';
  }, []);

  const handleStart = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    stoppedRef.current = false;
    dispatch(setCarStatus({ id: carId, status: 'started' }));

    let velocity: number;
    let distance: number;
    try {
      ({ velocity, distance } = await startEngine(carId));
    } catch {
      dispatch(setCarStatus({ id: carId, status: 'idle' }));
      return;
    }

    if (stoppedRef.current) return;
    const duration = Math.round((distance / velocity) * 1000);
    dispatch(setCarStatus({ id: carId, status: 'driving', duration }));

    if (trackRef.current && carRef.current) {
      animRef.current = buildAnimation(trackRef.current, carRef.current, duration);
    }

    try {
      await drive(carId);
      if (stoppedRef.current) return;
      dispatch(setCarStatus({ id: carId, status: 'finished' }));
      const time = Math.round(duration / 10) / 100;
      const winner: RaceWinner = { id: carId, name: carName, time };
      dispatch(setWinner(winner));
    } catch (err) {
      if (stoppedRef.current) return;
      if (err instanceof ApiError && err.status === 500) {
        if (animRef.current) {
          commitAndCancel(animRef.current);
          animRef.current = null;
        }
        dispatch(setCarStatus({ id: carId, status: 'broken' }));
      }
    }
  }, [carId, carName, dispatch]);

  const handleStop = useCallback(async () => {
    if (statusRef.current === 'idle') return;
    stoppedRef.current = true;
    if (animRef.current) {
      animRef.current.cancel();
      animRef.current = null;
    }
    resetPosition();
    await stopEngine(carId);
    dispatch(setCarStatus({ id: carId, status: 'idle' }));
  }, [carId, dispatch, resetPosition]);

  // Auto-start this car when RACE button fires a new startSignal
  const processedSignalRef = useRef(0);
  useEffect(() => {
    if (startSignal > processedSignalRef.current) {
      processedSignalRef.current = startSignal;
      void handleStart();
    }
  }, [startSignal, handleStart]);

  // Cancel animation and reset position when Redux state is externally reset to idle
  const prevStatusRef = useRef<CarStatus>('idle');
  useEffect(() => {
    if (status === 'idle' && prevStatusRef.current !== 'idle') {
      stoppedRef.current = true;
      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }
      resetPosition();
    }
    prevStatusRef.current = status;
  }, [status, resetPosition]);

  return { trackRef, carRef, status, isRacing, handleStart, handleStop };
}
