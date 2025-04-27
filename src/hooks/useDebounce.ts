import { useLatest, useUnmount } from 'ahooks'
import { debounce, DebouncedFunc, DebounceSettings, throttle, ThrottleSettings } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'

interface ExtendedDebounceSettings extends DebounceSettings {
    disableAutoCancelOnUnmount?: boolean
}

export function useDebounce<T extends (...args: any) => any>(func: T, wait = 0, options?: ExtendedDebounceSettings) {
    const fnRef = useLatest(func)

    const debounced = useMemo<DebouncedFunc<T>>(
        () =>
            debounce(
                (...args: Parameters<T>): ReturnType<T> => {
                    return fnRef.current(...args)
                },
                wait,
                options
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useUnmount(() => {
        if (options?.disableAutoCancelOnUnmount) {
            return
        }

        debounced.cancel()
    })

    return {
        run: debounced,
        cancel: debounced.cancel,
        flush: debounced.flush,
    } as const
}

export function useThrottle<T extends (...args: any) => any>(func: T, wait = 0, options?: ThrottleSettings) {
    const fnRef = useLatest(func)

    const throttled = useMemo<DebouncedFunc<T>>(
        () =>
            throttle(
                (...args: Parameters<T>): ReturnType<T> => {
                    return fnRef.current(...args)
                },
                wait,
                options
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useUnmount(() => {
        throttled.cancel()
    })

    return {
        run: throttled,
        cancel: throttled.cancel,
        flush: throttled.flush,
    }
}

export function useDebounceValue<T>(value: T, wait = 100, options?: DebounceSettings): T {
    const [debounced, setDebounced] = useState(value)

    const { run } = useDebounce(() => setDebounced(value), wait, options)

    useEffect(() => {
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return debounced
}

export function useThrottleValue<T>(value: T, wait = 100, options?: DebounceSettings) {
    const [throttled, setThrottled] = useState(value)

    const { run } = useThrottle(() => setThrottled(value), wait, options)

    useEffect(() => {
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return throttled
}
