'use client'

import { useEffect, useRef, useState } from 'react'
import type { Observable } from 'rxjs'

// ─── useObservable ────────────────────────────────────────────
// 订阅 Observable，触发副作用（不产生 React 状态，不触发重渲染）
// 适用场景：监听事件流，如 error$、submit$ 等一次性事件
//
// 用 callbackRef 稳定 callback 引用，避免因 callback 闭包变化导致重新订阅
export function useObservable<T>(observable: Observable<T>, callback: (value: T) => void): void {
    const callbackRef = useRef(callback)
    // 每次渲染同步更新 ref，确保 callback 内部的闭包始终是最新的
    callbackRef.current = callback

    useEffect(() => {
        const sub = observable.subscribe((value) => {
            callbackRef.current(value)
        })
        return () => sub.unsubscribe()
    }, [observable]) // observable 来自 Service 实例，引用稳定
}

// ─── useObservableState ───────────────────────────────────────
// 订阅 Observable，将值映射为 React 状态（触发重渲染）
// 适用场景：将 BehaviorSubject 的值同步到组件 UI
//
// initialValue 必须传入，避免首帧 undefined 导致 UI 闪烁
// 对 BehaviorSubject 使用 subject.getValue() 作为初始值
export function useObservableState<T, R = T>(
    observable: Observable<T>,
    transform: (value: T) => R,
    initialValue: R
): R {
    const [state, setState] = useState<R>(initialValue)

    const transformRef = useRef(transform)
    transformRef.current = transform

    useEffect(() => {
        const sub = observable.subscribe((value) => {
            setState(transformRef.current(value))
        })
        return () => sub.unsubscribe()
    }, [observable])

    return state
}

// ─── useObservableValue ───────────────────────────────────────
// useObservableState 的简化版（不做类型转换，T === R）
// 适用场景：直接订阅 BehaviorSubject 的值
export function useObservableValue<T>(observable: Observable<T>, initialValue: T): T {
    return useObservableState(observable, (v) => v, initialValue)
}
