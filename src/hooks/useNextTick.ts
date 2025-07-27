import { withResolvers } from '@/utils/promise';
import { useLatest, useMemoizedFn, useUnmount, useUpdate, useUpdateEffect } from 'ahooks';
import { useEffect, useRef } from 'react';

interface NextTickTask<T> {
    cb?: (latestValue: T) => void;
    resolve: (latestValue: T) => void;
    reject: (err: any) => void;
}

interface ObserverConfig {
    once: boolean;
}

interface StateObserverTask<T = unknown> {
    cb: (state: T) => void;
    config: ObserverConfig;
}

const createObserverConfig = (config: Partial<ObserverConfig>): ObserverConfig => {
    return {
        once: false,
        ...config,
    };
};

/**
 * 创建一个 nextTick 函数。
 *   - nextTick 的 callback 在下次渲染之后执行。
 *   - nextTick 的 Promise 在下次渲染之后兑现。
 *
 * 注意：
 *   - nextTick 中的回调函数依旧在本次渲染的闭包中，拿到的 state 是旧的。
 *   - 如果在最大延迟时间内没有触发渲染更新，将强制执行所有任务。
 *
 * @param dependValue -
 *   依赖值，可选参数。回调函数和 Promise 的结果会基于此值的最新状态。
 *   用于规避 React 中因闭包导致的状态滞后问题。
 *
 * @param maxDelay -
 *   最大延迟时间（毫秒）。默认值为 100 毫秒。
 *   如果超过此时间未触发渲染更新，将强制执行所有任务。
 *
 * @returns
 *   一个函数，用于注册任务。
 *   - 参数：`cb`（可选），在下次渲染后执行的回调函数，接收最新的 `dependValue`。
 *   - 返回：一个 `Promise`，在任务完成后解析为最新的 `dependValue`。
 */
export const useNextTick = <T extends null | Record<any, any> = null>(dependValue: T = null as T, maxDelay = 100) => {
    const forceUpdate = useUpdate();
    const latestValue = useLatest(dependValue);
    const taskList = useRef(new Set<NextTickTask<T>>());
    const scheduleUpdateTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
    // 取消定时器
    const clearTimer = () => {
        if (scheduleUpdateTimer.current) {
            clearTimeout(scheduleUpdateTimer.current);
            scheduleUpdateTimer.current = null;
        }
    };
    // 清空任务队列
    const runTask = () => {
        clearTimer();
        taskList.current.forEach((task) => {
            const { cb, resolve, reject } = task;
            try {
                cb?.(latestValue.current);
                resolve(latestValue.current);
            } catch (err) {
                reject(err);
            }
            taskList.current.delete(task);
        });
    };
    // 超时后强制更新
    const scheduleUpdate = () => {
        clearTimer();
        scheduleUpdateTimer.current = setTimeout(() => {
            if (taskList.current.size) {
                forceUpdate();
            }
        }, maxDelay);
    };
    // 添加任务
    const nextTick = useMemoizedFn((cb?: (latestValue: T) => void) => {
        const { promise, resolve, reject } = withResolvers<T>();
        taskList.current.add({ cb, resolve, reject });
        scheduleUpdate();
        return promise;
    });
    useEffect(runTask);
    return nextTick;
};

/**
 * 观察状态变化的 Hook。
 * @param state - 当前状态，每次状态变更时触发回调。
 * @returns
 *   一个元组，包含以下两个函数：
 *   - `observer` - 注册回调函数：
 *       - `cb` - 状态变更时执行的回调函数。
 *       - `config`（可选） - 配置对象：
 *           - `once` 是否只触发一次回调，默认为 `false`。
 *       返回一个取消订阅函数，用于停止监听该回调。
 *   - `discard` - 清空所有已注册的回调函数。
 */
export const useStateObserver = <T = unknown>(state: T) => {
    const taskList = useRef(new Set<StateObserverTask<T>>());

    useUpdateEffect(() => {
        taskList.current.forEach((task) => {
            const { config, cb } = task;
            cb(state);
            if (config.once) {
                taskList.current.delete(task);
            }
        });
    }, [state]);

    const discard = useMemoizedFn(() => {
        taskList.current.clear();
    });

    const observer = useMemoizedFn((cb: StateObserverTask<T>['cb'], config: Partial<ObserverConfig> = {}) => {
        const task: StateObserverTask<T> = { config: createObserverConfig(config), cb };
        taskList.current.add(task);
        return () => taskList.current.delete(task);
    });

    useUnmount(discard);

    return [observer, discard] as const;
};
