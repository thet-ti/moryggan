export interface IPaginationHelperParams {
  [key: string]: undefined | string | string[] | number | IPaginationHelperParams | IPaginationHelperParams[]
}

export function PaginationHelper({ pageSize = 16, page = 1 }: IPaginationHelperParams) {

  pageSize = Number(pageSize);
  page = Number(page);

  return {
    skip: page && page > 1 ? (page - 1 * pageSize) : 0,
    take: pageSize,
  };
}
