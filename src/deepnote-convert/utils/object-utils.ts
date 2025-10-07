import _isEqual from 'lodash/isEqual';

export function pickBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => predicate(v as T[keyof T]))
  ) as Partial<T>;
}

export function pickNonEmpty<T extends object>(obj: T) {
  return pickBy(obj, v => v != null) as Partial<{
    [K in keyof T]: NonNullable<T[K]>;
  }>;
}

export function getObjectDiff<E extends object>(
  objectA: E,
  objectB: E
): Partial<E> | null {
  const diff: Partial<E> = {};

  // NOTE: We need to cover the situation where some keys are missing in one of the objects.
  const keys = new Set([
    ...Object.keys(objectA),
    ...Object.keys(objectB) 
  ] as Array<keyof E>);
  for (const key of keys) {
    if (!_isEqual(objectA[key], objectB[key])) {
      diff[key] = objectB[key];
    }
  }

  return Object.keys(diff).length > 0 ? diff : null;
}

export function nullKeysToUndefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v ?? undefined])
  ) as {
    [K in keyof T]: NonNullable<T[K]> | undefined;
  };
}

export function getSortedObjectEntries<T extends object>(obj: T) {
  return Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)) as Array<
    [keyof T, T[keyof T]]
  >;
}
