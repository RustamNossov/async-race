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


export default generateRandomCar;
