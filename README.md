# scripts 脚本 README

## 1. i18n 国际化迁移脚本

使用之前请先修改 `i18n.js` 文件中传参的路径，该路径为 Android 项目下的国际化目录路径，修改后执行

```bash
node scripts/i18n.js
```

就会生成 `scripts/i18n.json`，会按照语言类型分类，自行处理 `i18n.json` 文件

## 2. build:card 卡片打包脚本

项目根目录下运行

```bash
npm run build:card
```

会有对话框提示打包的环境、打包的模块、卡片等，支持命令缓存功能，最大 5 条

## 3. build:miniapp 底座包打包脚本

项目根目录下运行

```bash
npm run build:miniapp
```

会有对话框提示打包的环境、打包的模块
