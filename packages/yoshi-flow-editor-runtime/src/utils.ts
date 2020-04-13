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

export const loadScript = (scriptSrc: string) => 
  new Promise(resolve => {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = false;
    script.onload = resolve;

    document.body.appendChild(script);
  );
};

export const getEditorSDKSrc = (): string | null => {
  const queryParams: URLSearchParams = getQueryParams();
  return queryParams.get('wix-sdk-version');
};
