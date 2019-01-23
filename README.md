# test 接口测试
## 启动命令
### 开发环境
安装/卸载依赖包 ***npm install/uninstall***
启动： npm start/npm run start
### 生产环境
npm run build


## 项目目录解析
### build
压缩编译后的文件
#### static
压缩编译后的src文件夹的东西
#### asset-manifest.json 
静态资源映射
#### manifest.json
基本信息
#### precache-manifest.6cd24037b306b8a18219eace8f77bfdb.js
离线缓存数据
#### service-worker.js
离线缓存。
### config
配置文件
#### configTool
配置脚本用到的工具函数
#### jest
文件转换器，不知道为什么要转换
#### env.js
好像是配置环境变量
#### paths.js
配置路径
#### webpack.config.dev.js
开发环境配置
#### webpack.config.prod.js
生产环境配置
#### webpackDevServer.config.js
微服务器配置（一个webpack，一个express）
### node_modules 
所有node模块依赖的工具包
### public
静态资源1
#### storage
任务信息(task_uuid.json)，使用者信息(ip+ * .json),(ip_address.json)
#### test-task
测试报告
### scripts
启动脚本，***生产，开发，测试***
### src                     
源码资源
#### css
#### templates
#### index.js
连接HTML和资源脚本
#### serviceWorker.js
本地缓存服务
### .gitignore 文件。
这个是用来定义那些在提交到git时要忽略的文件
### package.json
用来声明项目的各种模块安装版本信息，脚本信息，执行命令等
### package-lock.json 文件。
记录当前状态下实际安装的各个npm package的具体来源和版本号。





This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
