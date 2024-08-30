export interface PathData {
  color: string;
  points: PointData[];
}

export interface PointData {
  x: number;
  y: number;
}

export interface ContextOption {
  lineWidth: number;
  strokeStyle: string;
}
