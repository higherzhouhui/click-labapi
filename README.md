## 环境
### Nodejs >= 18.0
### Redis  >= 6
### Mysql >= 5.744

## 连接数据库
## mysql -uroot -p

## 创建数据库，名称和密码在env文件中,可自定义修改

### create database lost_db;

## 安装依赖
### yarn 
### or npm i
### or pnpm i


## 初始化数据库（该命令会清空所有数据表并插入基本配置数据，一般是第一次启动项目或者需要清空数据的时候执行，其他情况可以跳过该步骤）
### npm run init

## 本地调试启动
### npm run dev (使用.env.dev配置)
### npm run start （使用.env配置）

## 服务器启动，NODEJS进程守卫，使用pm2;npm i pm2 -g
## 启动 或者 直接 pm2 start server.js --name 'Click v1'

### npm run pm2

### 本地开发时如果是vscode/gitbash启动的则需要开启全局vpn代理，否则无法连接上；一个bot对应一个服务端，部署时联系我关闭我的测试服务器上运行的项目