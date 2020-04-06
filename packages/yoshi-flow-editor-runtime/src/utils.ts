// from an object of promises to a promise of an object
export function objectPromiseAll(target: Record<string, any>) {
  return Object.keys(target).reduce(async (acc, key) => {
    const obj = await acc;

    return {
      ...obj,
      [key.replace('Promise', '')]: await target[key],
    };
  }, Promise.resolve({}));
}

export const getQueryParams = (
  search = window.location.search,
): URLSearchParams => {
  return new URLSearchParams(search);
};

export * from './createInstances';
export * from './fetchFrameworkData';
