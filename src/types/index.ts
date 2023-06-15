export interface PipelineResponse<T> {
  result?: T;
  error?: string;
}

export interface CommonResponse<T> {
  success: boolean;
  message: string;
  result: T;
  status: number;
}
export interface CommonListResult<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}
