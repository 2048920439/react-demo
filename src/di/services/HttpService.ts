import { EnvToken } from '@/di/token'
import type { Env, IHttpService } from '@/di/types'
import { inject, injectable } from 'tsyringe'

@injectable()
export class HttpService implements IHttpService {
  constructor(@inject(EnvToken) private env: Env) {}
  get<T>(url: string) {
    console.log('get request', { env: this.env, url })
    return Promise.resolve('get' as T)
  }
  post<T,R>(url: string, data: T): Promise<R> {
    console.log('post request', { env: this.env, url, data })
    return Promise.resolve('post' as R)
  }

  put<T, R>(url: string, data: T): Promise<R> {
    console.log('put request', { env: this.env, url, data })
    return Promise.resolve('put' as R)
  }
  delete<T>(url: string): Promise<T> {
    console.log('delete request', { env: this.env, url })
    return Promise.resolve('delete' as T)
  }
}