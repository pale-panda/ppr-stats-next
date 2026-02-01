export type PageResult<T> = {
  items: T[];
  nextCursor: string | null;
};
