// Cuz built-in Extract type from typescript doesn't work properly and not fully type safe
export type ExtractProperly<T, U> = T extends U ? T : unknown;
