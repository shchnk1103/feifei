# 文章 API 文档

## 概述

文章 API 提供了文章的创建、读取、更新和删除功能，以及封面图片管理功能。所有 API 端点都遵循 RESTful 设计原则。

## 基础 URL

```
/api/articles
```

## 认证

所有需要认证的端点都需要在请求头中包含有效的会话令牌。未认证的请求将返回 401 状态码。

## 端点

### 创建文章

```http
POST /api/articles
```

**请求体：**
```json
{
  "title": "文章标题",
  "content": "文章内容",
  "status": "draft", // 可选，默认为 "draft"
  "visibility": "private", // 可选，默认为 "private"
  "allowComments": true, // 可选，默认为 true
  "tags": ["标签1", "标签2"], // 可选，默认为空数组
  "metadata": { // 可选
    "wordCount": 1000,
    "readingTime": 5,
    "views": 0,
    "likes": 0
  }
}
```

**响应：**
```json
{
  "success": true,
  "id": "文章ID",
  "title": "文章标题",
  "content": "文章内容",
  "author": {
    "id": "作者ID",
    "name": "作者名称",
    "email": "作者邮箱"
  },
  "createdAt": "创建时间",
  "updatedAt": "更新时间",
  "status": "draft",
  "visibility": "private",
  "allowComments": true,
  "tags": ["标签1", "标签2"],
  "metadata": {
    "wordCount": 1000,
    "readingTime": 5,
    "views": 0,
    "likes": 0
  }
}
```

### 获取文章列表

```http
GET /api/articles
```

**查询参数：**
- `page`: 页码，默认为 1
- `limit`: 每页数量，默认为 10
- `status`: 文章状态过滤
- `visibility`: 文章可见性过滤
- `authorId`: 作者 ID 过滤
- `tag`: 标签过滤

**响应：**
```json
{
  "articles": [
    {
      "id": "文章ID",
      "title": "文章标题",
      "content": "文章内容",
      "author": {
        "id": "作者ID",
        "name": "作者名称",
        "email": "作者邮箱"
      },
      "createdAt": "创建时间",
      "updatedAt": "更新时间",
      "status": "draft",
      "visibility": "private",
      "allowComments": true,
      "tags": ["标签1", "标签2"],
      "metadata": {
        "wordCount": 1000,
        "readingTime": 5,
        "views": 0,
        "likes": 0
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 获取文章详情

```http
GET /api/articles/:id
```

**响应：**
```json
{
  "id": "文章ID",
  "title": "文章标题",
  "content": "文章内容",
  "author": {
    "id": "作者ID",
    "name": "作者名称",
    "email": "作者邮箱"
  },
  "createdAt": "创建时间",
  "updatedAt": "更新时间",
  "status": "draft",
  "visibility": "private",
  "allowComments": true,
  "tags": ["标签1", "标签2"],
  "metadata": {
    "wordCount": 1000,
    "readingTime": 5,
    "views": 0,
    "likes": 0
  }
}
```

### 更新文章

```http
PATCH /api/articles/:id
```

**请求体：**
```json
{
  "title": "新标题",
  "content": "新内容",
  "status": "published",
  "visibility": "public",
  "allowComments": true,
  "tags": ["新标签1", "新标签2"],
  "metadata": {
    "wordCount": 2000,
    "readingTime": 10
  }
}
```

**响应：**
```json
{
  "success": true
}
```

### 获取文章封面图片

```http
GET /api/articles/:id/cover
```

**响应成功：**
```json
{
  "success": true,
  "url": "图片URL"
}
```

**响应失败（未找到图片）：**
```json
{
  "success": false,
  "message": "未找到封面图片"
}
```

### 更新文章封面图片

```http
POST /api/articles/:id/cover
```

**请求体：**
```json
{
  "url": "图片URL"
}
```

**响应：**
```json
{
  "success": true,
  "message": "封面图片已更新"
}
```

### 删除文章封面图片

```http
DELETE /api/articles/:id/cover
```

**响应：**
```json
{
  "success": true,
  "message": "封面图片已删除"
}
```

## 错误响应

所有端点都可能返回以下错误响应：

```json
{
  "error": "错误信息",
  "details": "详细错误信息" // 可选
}
```

常见状态码：
- 400: 请求参数错误
- 401: 未授权访问
- 404: 资源不存在
- 500: 服务器内部错误 