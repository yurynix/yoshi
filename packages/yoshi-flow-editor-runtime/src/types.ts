// Names of properties in T with types that include undefined
type OptionalPropertyNames<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

// Common properties from L and R with undefined in R[K] replaced by type in L[K]
type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};
