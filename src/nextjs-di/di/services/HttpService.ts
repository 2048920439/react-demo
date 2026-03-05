import { inject, injectable } from 'tsyringe'
import { EnvToken } from '../createdi/token'
import type { Env, IHttpService } from '../interface'

@injectable()
export class HttpService implements IHttpService {
    constructor(@inject(EnvToken) private env: Env) {}

    get<T>(url: string): Promise<T> {
        console.log('GET', { env: this.env, url })
        return fetch(url).then((r) => r.json())
    }

    post<T, R>(url: string, data: T): Promise<R> {
        console.log('POST', { env: this.env, url, data })
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then((r) => r.json())
    }

    put<T, R>(url: string, data: T): Promise<R> {
        console.log('PUT', { env: this.env, url, data })
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then((r) => r.json())
    }

    delete<T>(url: string): Promise<T> {
        console.log('DELETE', { env: this.env, url })
        return fetch(url, { method: 'DELETE' }).then((r) => r.json())
    }
}
