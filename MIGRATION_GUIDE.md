# 迁移指南

本文档提供了从旧目录结构迁移到新的模块化结构的指南。

## 迁移步骤

### 1. 更新导入路径

在迁移过程中，您需要更新导入路径。以下是一些常见的路径映射：

#### 组件导入

**旧路径**:
```typescript
import { AuthDialog } from "@/modules/auth/components/AuthDialog";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";
import { ArticleContent } from "@/modules/blog/components/ArticleContent";
```

**新路径**:
```typescript
import { AuthDialog } from "@/modules/auth";
import { ThemeToggle } from "@/modules/theme";
import { ArticleContent } from "@/modules/blog";
```

#### 钩子导入

**旧路径**:
```typescript
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useArticle } from "@/hooks/useArticle";
```

**新路径**:
```typescript
import { useAuth } from "@/modules/auth";
import { useTheme } from "@/modules/theme";
import { useArticle } from "@/modules/blog";
```

#### 类型导入

**旧路径**:
```typescript
import { UserData } from "@/types/user";
import { Article } from "@/types/blog";
```

**新路径**:
```typescript
import { UserData } from "@/modules/auth";
import { Article } from "@/modules/blog";
```

#### 共享资源导入

**旧路径**:
```typescript
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { formatDate } from "@/utils/date";
```

**新路径**:
```