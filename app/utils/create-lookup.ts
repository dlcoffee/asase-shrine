type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

export const createLookup = <T extends Record<string, any>>(
  records: T[],
  lookupKey: KeysMatching<T, string | number>
) => {
  return records.reduce((map, record) => {
    const key = record[lookupKey]

    if (key) {
      map[key.toString()] = record
    }

    return map
  }, {} as Record<string, T>)
}
