export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

export const withTimeout = <T>(target: Promise<T>, ms: number = 1000): Promise<T> => {
  return Promise.race([
    target,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new TimeoutError('Timeout')), ms)
    })
  ])
}

export const isTimeoutError = (err: any) => err instanceof TimeoutError