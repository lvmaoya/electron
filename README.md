### 一、项目概述
本项目是一个基于 Vite 和 Electron 构建的桌面应用程序模板。Vite 作为前端构建工具，提供了快速的开发体验和高效的打包能力；Electron 则允许使用 Web 技术（HTML、CSS、JavaScript）来创建跨平台的桌面应用。

### 二、功能特性
快速开发：利用 Vite 的快速热更新功能，在开发过程中实现实时预览。
跨平台支持：基于 Electron，应用程序可以在 Windows、Mac 和 Linux 等主流操作系统上运行。
模块化开发：使用 Vite 的模块化特性，方便组织和管理代码。

### 三、环境准备
Node.js：建议使用 Node.js 版本 14 或更高版本。你可以从 Node.js 官方网站 下载并安装。
npm：Node.js 自带 npm 包管理器，安装 Node.js 后即可使用。
python：2.7.18

### 四、安装与运行
#### 克隆项目
```
git clone <项目仓库地址>
cd <项目目录>
```
#### 安装依赖
```
npm install
```
#### 开发模式
```
npm run dev
```
该命令会同时启动 Vite 开发服务器和 Electron 应用程序。在开发过程中，对代码的修改会自动触发热更新，无需手动刷新。
#### 打包应用

```
npm run build
```
该命令会使用 Vite 打包前端代码，并使用 Electron Builder 打包 Electron 应用程序。打包后的应用程序会生成在 dist 目录下。

#### 项目结构
```
├── dist               # 打包文件
├── resource           # 静态资源
├── src                # 源代码目录
│   ├── main           # Electron 主进程代码
│   │   └── index.js   # 主进程入口文件
│   ├── renderer       # 渲染进程代码
│   │   ├── App.vue    # 根组件
│   │   └── main.js    # 渲染进程入口文件
│   └── preload        # 预加载脚本
│       └── index.js   # 预加载脚本入口文件
├── vite.config.js     # Vite 配置文件
├── electron-builder.yml # Electron Builder 配置文件
└── package.json       # 项目配置文件
```