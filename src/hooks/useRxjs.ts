import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T>, callback?: (value: T) => void) {
  useEffect(() => {
    const subscription = observable.subscribe(callback)
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useObservableState<T, R>(observable: Observable<T>, callback: (value: T) => R) {
  const [state, setState] = useState<R>()
  useEffect(() => {
    const subscription = observable.subscribe((ev) => setState(callback(ev)))
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return state
}
