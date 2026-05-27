export interface Car {
  id: number;
  name: string;
  color: string; // hex string, e.g. "#ff0000"
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export interface Winner {
  id: number; // car id
  wins: number;
  time: number; // seconds
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount?: number;
}
