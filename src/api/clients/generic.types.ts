import { HttpStatusCodes } from "@/lib/constants/httpstatuscodes";

export type TAPIResponse<T> = {
  result: T;
  duration: number;
  message: string;
  path: string;
  statusCode: HttpStatusCode;
  success: boolean;
};

export type TGetAPIMetaResponse<T> = TAPIResponse<T> & {
  result: {
    data: T;
    meta: {
      pageCount: number;
      totalCount: number;
      totalRecords: number;
      page: number;
      nextPage: number;
      previousPage: number;
    };
  };
};

export type HttpStatusCode =
  (typeof HttpStatusCodes)[keyof typeof HttpStatusCodes][keyof (typeof HttpStatusCodes)[keyof typeof HttpStatusCodes]];

export type TQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export type TBaseQueryParams = {
  limit?: number;
  page?: number;
  searchTerm?: string;
};