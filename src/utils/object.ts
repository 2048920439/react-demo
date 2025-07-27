/**
 * 判断对象是否包含某个key
 */
export const has = <T extends object>(obj: T, key: keyof T | string | symbol | number): key is keyof T =>
  Object.prototype.hasOwnProperty.call(obj, key);

/**
 * 获取对象中的某些key,不改变原对象
 */
export const pick = <TObj extends object, TKeys extends Array<keyof TObj>>(obj: TObj, keys: TKeys) => {
  return keys
    .filter((key) => has(obj, key))
    .reduce((prev, key) => ({ ...prev, [key]: obj[key] }), {} as unknown as Pick<TObj, TKeys[number]>);
};

/**
 * 删除对象中的某些key,不改变原对象
 */
export const omit = <TObj extends object, TKeys extends Array<keyof TObj>>(obj: TObj, keys: TKeys) => {
  return Object.keys(obj)
    .filter((key) => !keys.includes(key as any))
    // @ts-ignore
    .reduce((prev, key) => ({ ...prev, [key]: obj[key] }), {} as unknown as Omit<TObj, TKeys[number]>);
};

const isError = (data: any) => {
  return !!data && !!data.stack && !!data.message;
};

/**
 * 转换未知类型为字符串
 */
export const changeUnknownToString = (data: any): string => {
  let res = '';
  if (isError(data)) {
    res = JSON.stringify({
      message: data.message,
      stack: data.stack,
    });
  } else if (typeof data !== 'string') {
    res = JSON.stringify(data);
  } else {
    res = String(data);
  }
  return res;
};
