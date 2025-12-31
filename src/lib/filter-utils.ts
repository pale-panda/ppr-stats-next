import type { SearchParams } from 'next/dist/server/request/search-params';

export const createFilterParams = (filter: string): SearchParams => {
  if (!filter?.trim()) return {};

  return filter
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string[]>>((acc, part) => {
      const [rawKey, rawValue = ''] = part.split(':');
      const key = (rawKey ?? '').trim();

      if (!key) return acc;

      const values = rawValue
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      if (values.length === 0) return acc;
      acc[key] = acc[key] ? [...acc[key], ...values] : values;

      return acc;
    }, {});
};

export const filterByFilterParams = (
  data: Array<Record<string, unknown>>,
  filterParams: SearchParams
) => {
  if (Object.keys(filterParams).length === 0) return data;
  if (Object.values(filterParams).every((v) => !v || v.length === 0))
    return data;
  return data.filter((item) =>
    Object.entries(filterParams).every(([key, values]) => {
      if (values && values.length === 0) return true;
      const itemValue = item[key];

      if (itemValue === undefined || itemValue === null) return false;

      const valuesArray = Array.isArray(values) ? values : [values];
      if (Array.isArray(itemValue)) {
        return valuesArray.some((value) => itemValue.includes(value));
      }

      return valuesArray.includes(String(itemValue));
    })
  );
};
