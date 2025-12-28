export interface FilterParams {
  [key: string]: string[];
}

export const createFilterParams = (filter: string): FilterParams => {
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
  filterParams: FilterParams
) => {
  if (Object.keys(filterParams).length === 0) return data;
  return data.filter((item) =>
    Object.entries(filterParams).every(([key, values]) => {
      const itemValue = item[key];

      if (itemValue === undefined || itemValue === null) return false;

      if (Array.isArray(itemValue)) {
        return values.some((value) => itemValue.includes(value));
      }
      return values.includes(String(itemValue));
    })
  );
};
