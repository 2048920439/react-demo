export type Env = 'daily' | 'pre' | 'prod'

export interface IHttpService {
  get<T>(url: string): Promise<T>;
  post<T, R>(url: string, data: T): Promise<R>;
  delete<T>(url: string): Promise<T>;
  put<T, R>(url: string, data: T): Promise<R>;
}

export interface IWebSocketService {
  connect(url: string): void;
  subscribe(topic: string): void;
  close(): void;
}