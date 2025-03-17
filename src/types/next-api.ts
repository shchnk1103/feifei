import { NextRequest } from "next/server";

/**
 * Next.js API 路由处理函数的参数类型
 */
export type RouteHandlerParams = {
  params: Promise<{
    id?: string;
    slug?: string;
    [key: string]: string | undefined;
  }>;
};

/**
 * Next.js API 路由处理函数的类型
 */
export type RouteHandler = (
  request: NextRequest,
  context: RouteHandlerParams
) => Promise<Response>;
