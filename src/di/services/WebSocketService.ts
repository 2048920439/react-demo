import { EnvToken, HttpToken } from '@/di/token'
import  type { Env, IHttpService, IWebSocketService } from '@/di/types'
import { inject, injectable } from 'tsyringe'

@injectable()
export class WebSocketService implements IWebSocketService {
  constructor(
    @inject(EnvToken) private env: Env,
    @inject(HttpToken) private http: IHttpService
  ) {}

  connect(url: string) {
    console.log('connect', { url, env: this.env, http: this.http })
  }

  subscribe(topic: string) {
    console.log('subscribe', { topic, env: this.env, http: this.http })
  }

  close() {
    console.log('close', { env: this.env, http: this.http })
  }

}