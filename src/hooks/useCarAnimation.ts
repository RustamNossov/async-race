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
  const targetX = trackEl.clientWidth - carEl.clientWidth - 10 - carEl.offsetLeft;
  return carEl.animate(
    [
      { transform: 'translateX(0px)' },
      { transform: `translateX(${targetX}px)` },
    ],
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
  const duration = carData?.duration ?? 0;
  const isRacing = useAppSelector((s) => s.race.isRacing);
  const resetSignal = useAppSelector((s) => s.race.resetSignal);

  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const stoppedRef = useRef(false);
  const wasAnimatedRef = useRef(false); // true if animation ran in this component instance

  const statusRef = useRef<CarStatus>(status);
  statusRef.current = status;

  const resetPosition = useCallback(() => {
    if (carRef.current) carRef.current.style.transform = '';
  }, []);

  // Start animation when car transitions to 'driving'
  useEffect(() => {
    if (status !== 'driving' || !duration || !trackRef.current || !carRef.current) return;
    if (animRef.current) animRef.current.cancel();
    wasAnimatedRef.current = true;
    animRef.current = buildAnimation(trackRef.current, carRef.current, duration);
  }, [status, duration]);

  // Freeze car position when engine breaks (for cars that were animated)
  useEffect(() => {
    if (status !== 'broken') return;
    if (animRef.current) {
      commitAndCancel(animRef.current);
      animRef.current = null;
    }
  }, [status]);

  // Position car when mounting after race (was not animated — was on a different page)
  const progress = carData?.progress ?? 0;
  useEffect(() => {
    if (status !== 'finished' && status !== 'broken') return;
    if (wasAnimatedRef.current) return;
    if (!trackRef.current || !carRef.current) return;
    const targetX = trackRef.current.clientWidth - carRef.current.clientWidth - 10 - carRef.current.offsetLeft;
    carRef.current.style.transform = `translateX(${Math.round(progress * targetX)}px)`;
  }, [status, progress]);

  // Individual car start (A button)
  const handleStart = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    stoppedRef.current = false;
    dispatch(setCarStatus({ id: carId, status: 'started' }));

    let velocity: number;
    let carDistance: number;
    try {
      ({ velocity, distance: carDistance } = await startEngine(carId));
    } catch {
      dispatch(setCarStatus({ id: carId, status: 'idle' }));
      return;
    }

    if (stoppedRef.current) return;
    const carDuration = Math.round(carDistance / velocity);
    dispatch(setCarStatus({ id: carId, status: 'driving', duration: carDuration }));

    try {
      await drive(carId);
      if (stoppedRef.current) return;
      dispatch(setCarStatus({ id: carId, status: 'finished' }));
      const time = Math.round(carDuration / 10) / 100;
      const winner: RaceWinner = { id: carId, name: carName, time };
      dispatch(setWinner(winner));
    } catch (err) {
      if (stoppedRef.current) return;
      if (err instanceof ApiError && err.status === 500) {
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
    await stopEngine(carId);
    resetPosition();
    dispatch(setCarStatus({ id: carId, status: 'idle' }));
  }, [carId, dispatch, resetPosition]);

  // Cancel animation and reset position when race is reset
  const processedResetRef = useRef(0);
  useEffect(() => {
    if (resetSignal > processedResetRef.current) {
      processedResetRef.current = resetSignal;
      stoppedRef.current = true;
      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }
      resetPosition();
    }
  }, [resetSignal, resetPosition]);

  return { trackRef, carRef, status, isRacing, handleStart, handleStop };
}
