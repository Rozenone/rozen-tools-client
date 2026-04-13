# Rozen Tools

一款专为开发者打造的桌面工具集应用，基于 Vue3 + Electron 构建，提供 20+ 种实用的开发辅助工具。

## 功能特性

Rozen Tools 集成了以下 20 个实用工具：

### 数据格式化
| 工具 | 描述 |
|------|------|
| JSON 格式化 | JSON 格式化与压缩工具 |
| XML 格式化 | XML 格式化与压缩工具 |
| SQL 格式化 | 粘贴 SQL 代码或存储过程代码，自动格式化换行、对齐 |
| 文档格式化 | Excel 等文档格式化工具 |

### 编码加密
| 工具 | 描述 |
|------|------|
| Base64 编解码 | Base64 编码与解码工具 |
| URL 编码 | URL 编码与解码工具 |
| Unicode 转码 | ASCII/Unicode/中文互相转换工具 |
| 哈希加密 | SHA256/SHA512 哈希计算工具 |
| JWT 解析 | JWT Token 解析与编码工具 |
| 编码转换 | 文件编码格式转换工具 |

### 生成器
| 工具 | 描述 |
|------|------|
| UUID 生成器 | 生成 UUID 标识符 |
| CSV 生成器 | 自定义模板批量生成 CSV 文件 |
| 文档树生成 | 选择文件夹自动生成文档树结构 |

### 实用工具
| 工具 | 描述 |
|------|------|
| 正则表达式 | 正则表达式测试工具 |
| 代码语言检测 | 检测代码中是否包含指定语言字符 |
| 文件检索 | 在指定文件夹中检索文件 |

### 时间日期
| 工具 | 描述 |
|------|------|
| 时间戳转换器 | 时间戳与日期格式互转工具 |
| 日期计算器 | 计算日期差值或进行日期加减运算 |
| 秒表 | 精准计时器，支持计次功能 |

### 系统工具
| 工具 | 描述 |
|------|------|
| 防睡眠 | 防止电脑进入睡眠或屏幕关闭 |
| 单位换算 | 储存单位与网络速率换算工具 |

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **桌面框架**: Electron 32
- **构建工具**: Vite 6
- **UI 组件库**: Quasar 2
- **状态管理**: Pinia + Pinia Plugin Persistedstate
- **语言**: TypeScript
- **国际化**: Vue I18n
- **拖拽排序**: VueDraggable

## 安装与运行

### 环境要求
- Node.js 18+
- npm 9+

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建应用
```bash
npm run build
```

### 预览构建产物
```bash
npm run preview
```

### 代码检查
```bash
npm run lint      # 检查代码
npm run fix       # 自动修复
```

## 项目结构

```
rozen-tools-client/
├── src/                      # 主进程源码
│   ├── assets/               # 静态资源
│   │   ├── css/              # 样式文件
│   │   └── img/              # 图片资源
│   ├── components/           # 公共组件
│   │   └── common/           # 通用组件
│   ├── locales/              # 国际化配置
│   │   ├── cn/               # 中文
│   │   └── jp/               # 日文
│   ├── router/               # 路由配置
│   ├── stores/               # Pinia 状态管理
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   ├── views/                # 页面视图
│   │   ├── common/           # 通用页面
│   │   ├── documentation/    # 文档页面
│   │   ├── favorites/        # 收藏页面
│   │   ├── searchPage/       # 搜索页面
│   │   ├── service/          # 工具服务页面
│   │   └── top/              # 首页
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
├── src-preload/              # Preload 脚本
├── src-render/               # 主进程入口
├── dist/                     # 构建输出目录
├── dist-electron/            # Electron 构建输出
└── package.json              # 项目配置
```

## 功能亮点

- **拖拽排序**: 支持自定义工具卡片排序
- **收藏功能**: 可收藏常用工具，优先显示
- **多语言支持**: 支持中文和日文切换
- **本地存储**: 使用 Pinia Persistedstate 持久化用户偏好设置
- **响应式布局**: 适配不同窗口尺寸

## 许可证

[MIT](LICENSE)

---

Made with ❤️ by rozenone
