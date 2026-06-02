import { CAR_NAMES_FIRST, CAR_NAMES_SECOND } from './constants';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${hex}`;
}

function generateRandomCar(): { name: string; color: string } {
  return {
    name: `${randomItem(CAR_NAMES_FIRST)} ${randomItem(CAR_NAMES_SECOND)}`,
    color: randomHexColor(),
  };
}

export function generateUniqueRandomCars(
  existingNames: Set<string>,
  count: number,
): { name: string; color: string }[] {
  const pool: { name: string; color: string }[] = [];
  for (const first of CAR_NAMES_FIRST) {
    for (const second of CAR_NAMES_SECOND) {
      const name = `${first} ${second}`;
      if (!existingNames.has(name)) {
        pool.push({ name, color: randomHexColor() });
      }
    }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default generateRandomCar;
