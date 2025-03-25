import { NextRequest } from "next/server";

/**
 * Next.js API 路由处理函数的参数类型
 * @template T 路由参数的类型
 */
export type RouteHandlerParams<
  T = { id?: string; slug?: string; [key: string]: string | undefined }
> = {
  params: T;
};

/**
 * Next.js API 路由处理函数的类型
 * @template T 路由参数的类型
 */
export type RouteHandler<
  T = { id?: string; slug?: string; [key: string]: string | undefined }
> = (request: NextRequest, context: RouteHandlerParams<T>) => Promise<Response>;
