export const withResolvers = <T = void>() => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        promise,
        resolve: resolve!,
        reject: reject!
    };
};

export const isPromise = (value: any): value is Promise<any> => {
    return value && typeof value.then === 'function';
};