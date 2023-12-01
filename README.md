# chrome 扩展程序开发基座

### 项目目录结构

```
src
 -+ assets        # 资源目录，构建时会被直接复制到 dist 目录
 -+ modules       # 普通 js 模块
 -+ scripts       # 此目录下 js 文件都被视为 rollup 入口文件
 -+ views         # html 页面，构建时会被直接复制到 dist 目录
 -- manifest.json   
```