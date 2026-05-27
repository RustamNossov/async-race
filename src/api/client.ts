import { Car, EngineResponse, DriveResponse, Winner, PaginatedResult } from './types';
import ApiError from './ApiError';
import { API_BASE } from '../utils/constants';

async function handleErrors(res: Response): Promise<Response> {
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, `${res.statusText}: ${text}`);
  }
  return res;
}

async function parsePaginated<T>(res: Response): Promise<PaginatedResult<T>> {
  const data = (await res.json()) as T[];
  const total = res.headers.get('X-Total-Count');
  return { data, totalCount: total ? Number(total) : undefined };
}

// --- Garage ---

export async function getCars(page = 1, limit = 7): Promise<PaginatedResult<Car>> {
  const res = await fetch(`${API_BASE}/garage?_page=${page}&_limit=${limit}`);
  await handleErrors(res);
  return parsePaginated<Car>(res);
}

export async function getCar(id: number): Promise<Car> {
  const res = await fetch(`${API_BASE}/garage/${id}`);
  await handleErrors(res);
  return res.json() as Promise<Car>;
}

export async function createCar(name: string, color: string): Promise<Car> {
  const res = await fetch(`${API_BASE}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  await handleErrors(res);
  return res.json() as Promise<Car>;
}

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  const res = await fetch(`${API_BASE}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  await handleErrors(res);
  return res.json() as Promise<Car>;
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/garage/${id}`, { method: 'DELETE' });
  await handleErrors(res);
}

// --- Engine ---

export async function startEngine(id: number): Promise<EngineResponse> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=started`, { method: 'PATCH' });
  await handleErrors(res);
  return res.json() as Promise<EngineResponse>;
}

export async function stopEngine(id: number): Promise<EngineResponse> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
  await handleErrors(res);
  return res.json() as Promise<EngineResponse>;
}

export async function drive(id: number): Promise<DriveResponse> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=drive`, { method: 'PATCH' });
  await handleErrors(res);
  return res.json() as Promise<DriveResponse>;
}

// --- Winners ---

export async function getWinners(
  page = 1,
  limit = 10,
  sort?: 'id' | 'wins' | 'time',
  order?: 'ASC' | 'DESC',
): Promise<PaginatedResult<Winner>> {
  const params = new URLSearchParams();
  params.set('_page', String(page));
  params.set('_limit', String(limit));
  if (sort) params.set('_sort', sort);
  if (order) params.set('_order', order);
  const res = await fetch(`${API_BASE}/winners?${params.toString()}`);
  await handleErrors(res);
  return parsePaginated<Winner>(res);
}

export async function getWinner(id: number): Promise<Winner> {
  const res = await fetch(`${API_BASE}/winners/${id}`);
  await handleErrors(res);
  return res.json() as Promise<Winner>;
}

export async function createWinner(id: number, wins: number, time: number): Promise<Winner> {
  const res = await fetch(`${API_BASE}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
  await handleErrors(res);
  return res.json() as Promise<Winner>;
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  const res = await fetch(`${API_BASE}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
  await handleErrors(res);
  return res.json() as Promise<Winner>;
}

export async function deleteWinner(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/winners/${id}`, { method: 'DELETE' });
  await handleErrors(res);
}
