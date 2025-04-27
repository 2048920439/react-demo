import {useMemo, useRef, useState} from 'react';

export interface BinaryStateAction<T> {
    /**
     * 更新状态（全覆盖）
     */
    updateState: (...states: T[]) => void;
    /**
     * 添加状态
     */
    addState: (...states: T[]) => void;
    /**
     * 移除状态
     */
    removeState: (...states: T[]) => void;
    /**
     * 是否存在单个状态
     * 处理了闭包问题，始终能拿到最新状态
     */
    hasState: (state: T) => boolean;
    /**
     * 是否存在任意一个状态
     * 处理了闭包问题，始终能拿到最新状态
     */
    hasAnyState: (...states: T[]) => boolean;
    /**
     * 是否存在所有状态
     * 处理了闭包问题，始终能拿到最新状态
     */
    hasAllState: (...states: T[]) => boolean;
}

export function useBinaryState<T extends number = number>(
    initialState: T,
): [state: number, action: BinaryStateAction<T>] {
    const [state, setState] = useState<number>(initialState);
    const currentState = useRef<number>(initialState);

    const set = (callback: (prevState: number) => number) => {
        setState((prev) => {
            const result = callback(prev);
            /**
             * 同步当前状态
             */
            currentState.current = result;
            return result;
        });
    };

    const action: BinaryStateAction<T> = useMemo(() => {
        return {
            updateState: (...states) => {
                checkOnlyOneBitSet(states);
                set(() => states.reduce((prev, curr) => prev | curr, 0));
            },
            addState: (...states) => {
                checkOnlyOneBitSet(states);
                set((prevState) => prevState | states.reduce((prev, curr) => prev | curr, 0));
            },
            removeState: (...states) => {
                checkOnlyOneBitSet(states);
                set((prevState) => prevState & ~states.reduce((prev, curr) => prev | curr, 0));
            },
            hasState: (targetState: T) => {
                checkOnlyOneBitSet([targetState]);
                return targetState === currentState.current || (currentState.current & targetState) !== 0;
            },
            hasAnyState: (...targetStates: T[]) => {
                checkOnlyOneBitSet(targetStates);
                return targetStates.some((targetState) => action.hasState(targetState));
            },
            hasAllState: (...targetStates: T[]) => {
                checkOnlyOneBitSet(targetStates);
                return targetStates.every((targetState) => action.hasState(targetState));
            },
        };
    }, []);

    return [state, action];
}

function hasOnlyOneBitSet(num: number) {
    return (num & (num - 1)) === 0;
}

function checkOnlyOneBitSet(numbers: number[]) {
    const errStateList = numbers.filter((num) => !hasOnlyOneBitSet(num));
    if (errStateList.length) {
        const errorMsg = `传入了复合状态，可能出现bug，请检查（转换为二进制后，有多个1):
      ${errStateList.map((num) => `${num} --> ${num.toString(2)}`).join('\n')}
      `;
        console.error(errorMsg);
    }
}
