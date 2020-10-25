import { isFunction, isNull, isString, isUndefined } from "is-what";
import { Got } from "got";
import { Pagination } from "./responses";
import Client from "./client";

type NotClean = "" | null | undefined;
export function cleanObject<T>(
  obj: Record<string, T>
): Record<string, Exclude<T, NotClean>> {
  const result: Record<string, Exclude<T, NotClean>> = {};

  // eslint-disable-next-line no-restricted-syntax
  Object.keys(obj).forEach((key) => {
    const v = obj[key];
    if (!isNull(v) && !isUndefined(v) && !isString(v)) {
      result[key] = v as Exclude<T, NotClean>;
    }
  });
  return result;
}

export async function iterateApi<T>(
  request: Got,
  max: number,
  params: Record<any, any>,
  path: string
): Promise<T[]> {
  let after: string | undefined;
  const allData: T[] = [];
  const first = Math.min(100, max);
  while (max < 0 || allData.length < max) {
    const searchParams = cleanObject({ ...params, after, first });
    const body: {
      data: T[];
      pagination: Pagination;
    } = await request.get(path, { searchParams }).json();
    allData.push(...body.data);
    after = body.pagination.cursor;
    if (body.data.length < first) {
      break;
    }
  }
  return max > 0 ? allData.slice(0, max) : allData;
}

export function omitWithoutFunctions(
  obj: Record<any, any>,
  omit: string[]
): Record<any, any> {
  return Object.keys(obj)
    .filter((k) => !isFunction(obj[k]))
    .filter((k) => !omit.includes(k))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as Record<any, any>);
}

export type DataClass<T, U> = new (raw: T, client: Client) => U;
export function transformRawData<T, U>(
  dataClass: DataClass<T, U>,
  client: Client
) {
  return (raw: T): U => {
    // eslint-disable-next-line new-cap
    return new dataClass(raw, client);
  };
}

export function transformRawDataMap<T, U>(
  dataClass: DataClass<T, U>,
  client: Client
) {
  return (raws: T[]): U[] => {
    return raws.map((raw) => {
      // eslint-disable-next-line new-cap
      return new dataClass(raw, client);
    });
  };
}

export function fixEmptyStrings<T extends string>(
  data: T
): Exclude<T, ""> | null {
  if (data === "" || data === undefined) return null;
  return data as Exclude<T, "">;
}
