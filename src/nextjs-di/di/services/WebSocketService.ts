import { inject, injectable } from 'tsyringe'
import { EnvToken } from '../createdi/token'
import type { Env, IWebSocketService } from '../interface'

@injectable()
export class WebSocketService implements IWebSocketService {
    constructor(@inject(EnvToken) private env: Env) {}

    connect(url: string): void {
        console.log('WS connect', { env: this.env, url })
    }

    subscribe(topic: string): void {
        console.log('WS subscribe', { env: this.env, topic })
    }

    close(): void {
        console.log('WS close', { env: this.env })
    }
}
