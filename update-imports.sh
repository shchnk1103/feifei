#!/bin/bash

# 更新组件导入路径
echo "更新组件导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/auth|@/modules/auth/components|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/blog|@/modules/blog/components|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/editor|@/modules/editor/components|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/ThemeToggle|@/modules/theme/components/ThemeToggle|g'

# 更新钩子导入路径
echo "更新钩子导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useAuth|@/modules/auth/hooks/useAuth|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useUserInfo|@/modules/auth/hooks/useUserInfo|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useArticle|@/modules/blog/hooks/useArticle|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useEditorShortcuts|@/modules/editor/hooks/useEditorShortcuts|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useTheme|@/modules/theme/hooks/useTheme|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useImage|@/shared/hooks/useImage|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/useScrollLock|@/shared/hooks/useScrollLock|g'

# 更新类型导入路径
echo "更新类型导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/types/user|@/modules/auth/types/user|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/types/blog|@/modules/blog/types/blog|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/types/blocks|@/modules/editor/types/blocks|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/types/common|@/shared/types/common|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/types/image|@/shared/types/image|g'

# 更新服务导入路径
echo "更新服务导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/lib/firebase/services/authService|@/modules/auth/services/authService|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/lib/articles|@/modules/blog/services/articles|g'

# 更新工具导入路径
echo "更新工具导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/utils/|@/shared/utils/|g'

# 更新UI组件导入路径
echo "更新UI组件导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Button|@/shared/components/ui/Button|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Card|@/shared/components/ui/Card|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Input|@/shared/components/ui/Input|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Modal|@/shared/components/ui/Modal|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Dialog|@/shared/components/ui/Dialog|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Container|@/shared/components/ui/Container|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Section|@/shared/components/ui/Section|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Skeleton|@/shared/components/ui/Skeleton|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Stack|@/shared/components/ui/Stack|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Carousel|@/shared/components/ui/Carousel|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/Grid|@/shared/components/ui/Grid|g'

# 更新布局组件导入路径
echo "更新布局组件导入路径..."
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/layout/Header|@/shared/components/layout/Header|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/layout/Footer|@/shared/components/layout/Footer|g'

# 添加 "use client" 指令
echo "添加 'use client' 指令..."
find src/modules -type f -name "*.tsx" | grep -v "index.tsx" | xargs -I{} sed -i '' '1s/^/"use client";\n\n/' {}
find src/shared/components -type f -name "*.tsx" | grep -v "index.tsx" | xargs -I{} sed -i '' '1s/^/"use client";\n\n/' {}

echo "导入路径更新完成！" 