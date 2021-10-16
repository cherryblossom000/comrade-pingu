export type ReadonlyNonEmpty<T> = readonly [T, ...T[]]

export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

export type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & T

export type Override<T, U> = Omit<T, keyof U> & U
