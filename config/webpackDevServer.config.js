'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('./webpack.config.dev');
const paths = require('./paths');
const findPath = require('./configTool/findState');
const addState = require('./configTool/addState');
const fs = require('fs');
const Path = require("path");
const execFile = require("child_process").exec;
const axios = require("axios");
const taskManager = require("./configTool/taskManager");
const singlePath = require("./configTool/singlePath");
const bodyParser = require('body-parser');
const BASE_URL = Path.join(__dirname, "../");

const uuidv1 = require("uuid/v1");

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

const express = require("express");
var App = express();
App.all("*", function(req, res, next) {             //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "text/html; charset=UTF-8");
    next();
});
App.use(bodyParser());
App.use(express.static(BASE_URL + "public/test_task"));
// post
App.post("/task/:uuid", (req, ress)=>{
    var query_date = req.query.date;
    var para = req.params.uuid;
    fs.readFile("public/storage/task_uuid.json", "utf8", (err, data)=> {
        // get path person
        if (err) throw err;
        var taskData = JSON.parse(data);
        var path = taskData[para].path; // []
        if (query_date) {
            // 有具体日期，目标 返回任务html
            if (err) throw err;
            // ress.setHeader('Content-Type', 'text/html; charset=UTF-8');
            ress.sendFile (BASE_URL+ "public/test_task/" + para + query_date + ".html");
        }else {
            var person = taskData[para].person;
            var uuidname = taskData[para].name;
            // 多个接口实现：
            var taskFnArr;
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = (nowDate.getMonth()) < 9 ? ("" + nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
            var day = nowDate.getDate() < 10 ? ("0" + nowDate.getDate()) : nowDate.getDate();
            var hours = nowDate.getHours() < 10 ? ("0" + nowDate.getHours()) : nowDate.getHours();
            var minutes = nowDate.getMinutes() < 10 ? ("0" + nowDate.getMinutes()) : nowDate.getMinutes();
            var dateStr = year + month + day + hours + minutes;
            fs.readFile("public/storage/" + person + ".json", "utf8", (err, data)=> {
                if (err) throw err;
                var configArr = []; // 单个接口测试所需配置
                taskFnArr = path.map((ele, index)=> {
                    var npath = ele.replace(person +"/", "");
                    var cont = findPath(npath.split("/"), data);
                    if (cont) {
                        var perState = JSON.parse(data);
                        var variable = perState.variable;
                        var select = cont.request.valSelect || 0; // 新加的属性，说明选中哪一个环境变量 需要保存后才有
                        var glo;
                        for(var i = 0; i < variable.length; i++) {
                            if (variable[i].name === "Global") {
                                glo = i;
                                break;
                            }
                        }
                        var thisList = variable[select];
                        var len = thisList.length;
                        var varContent = [
                            ...variable[glo].values,
                            ...variable[select].values
                        ];
                        var testScript = cont.event[1].script.exec.join("");
                        configArr.push({
                            varContent: varContent,
                            testScript: testScript,
                            variable: variable,
                            thisList: thisList,
                            len: len,
                            glo: glo,
                            path: ele
                        });
                        return singlePath(cont, varContent)
                    }
                    else {
                        return false;
                    }
                });
                if (taskFnArr) {
                    axios.all(taskFnArr).then(axios.spread((...resp)=> {
                        var outerPm = "var configObj, pm;";
                        resp.forEach((ele, index) => {
                            console.log(ele.data); // 返回数据
                            var configObj = configArr[index];
                            var pm = `{
                            varList:  () => {
                                return configObj.variable // 当前的所有环境变量集合
                            },
                            thisList:  ()=> {// 当前选中的环境变量的list
                                return configObj.thisList
                            },
                            len:  ()=> {// 当前选中的环境变量的list的长度
                                return configObj.len
                            },
                            globalList: ()=> {
                                return configObj.variable[configObj.len].values
                            },
                            glen: () => {
                                var gList = pm.globalList();
                                return gList.length
                            },
                            environment: {
                                get:  (var_key)=> {
                                    var thisList = pm.thisList();
                                    var len = pm.len();
                                    for (var i = 0; i < len; i++) {
                                        if (thisList[i].key === var_key) {
                                            return thisList[i].value;
                                        }
                                    }
                                },
                                set:  (var_key, var_val) => {
                                    var thisList = pm.thisList();
                                    var varList = pm.varList();
                                    thisList.push({key: var_key, value: var_val, enable: true});
                                    varList[configObj.select].values = thisList;
                                    configObj.variable = varList;
                                    // this.setState({
                                    //     varList: varList
                                    // });
                                },
                                unset: (var_key) => {
                                    var thisList = pm.thisList();
                                    var varList = pm.varList();
                                    var len = pm.len();
                                    for (var i = 0; i < len; i++) {
                                        if (thisList[i].key === var_key) {
                                            thisList.splice(i, 1);
                                        }
                                    }
                                    varList[configObj.select].values = thisList;
                                    configObj.variable = varList
                                    // this.setState({
                                    //     varList: varList
                                    // });
                                }
                            },
                            globals: {
                                get: (var_key) => {
                                    var len = pm.glen();
                                    var gList = pm.globalList();
                                    for (var i = 0; i < len; i++) {
                                        if (gList[i].key === var_key) {
                                            return gList[i].value
                                        }
                                    }
                                },
                                set: (var_key, var_val) => {
                                    var gList = pm.globalList();
                                    var varList = pm.varList();
                                    gList.push({key: var_key, value: var_val, enable: true});
                                    varList[configObj.glo].values = gList;
                                    configObj.variable = varList
                                    // this.setState({
                                    //     varList: varList
                                    // });
                                },
                                unset: (var_key)=> {
                                    var gList = pm.thisList();
                                    var varList = pm.varList();
                                    var len = pm.glen();
                                    for (var i = 0; i < len; i++) {
                                        if (gList[i].key === var_key) {
                                            gList.splice(i, 1);
                                        }
                                    }
                                    varList[configObj.glo].values = gList;
                                    configObj.variable = varList
                                    // this.setState({
                                    //     varList: varList
                                    // });
                                }
                            },
                            variables: {
                                get: (var_key)=> {
                                    var varContent = configObj.varContent;  // 当前环境变量和全局变量的集合
                                    var len = varContent.length;
                                    for (var i = 0; i < len; i++) {
                                        if (varContent[i].key === var_key) {
                                            return varContent[i].value
                                        }
                                    }
                                }
                            },
                            response: {
                                json: ()=> {
                                    return ${JSON.stringify(ele.data)}
                                }
                            },
                            assert: chai.assert
                        };`;
                            var eachTest = `
                        configObj=${JSON.stringify(configObj)};
                        pm=${pm}
                        ${configObj.testScript}
                        `;
                            outerPm += eachTest
                        });
                        var testStr = `
                    describe('测试报告', function() {
                        it('${uuidname} / ${dateStr}', function() {
                           ${outerPm}
                        })
                    })`;
                        var htmlStr = `<!DOCTYPE html><html><head><title>${path}</title>
<link href="https://cdn.bootcss.com/mocha/5.2.0/mocha.min.css" rel="stylesheet"></head><body><div id="mocha"></div><script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script><script src="https://cdn.bootcss.com/mocha/5.2.0/mocha.min.js"></script><script src="https://cdn.bootcss.com/chai/4.2.0/chai.min.js"></script><script>mocha.setup('bdd')</script>
        <!-- load code you want to test here -->
        <script >
        ${testStr}
</script>
        <!-- load your test files here -->

<script>mocha.run();</script></body></html>`;
                        fs.writeFile("public/test_task/" + uuidname + dateStr + ".html", htmlStr, "utf8", (err)=> {
                            if (err) throw err;
                            var jsStr = `const chai = require("chai");
                            ${testStr}
                        `;
                            fs.writeFile(BASE_URL +"test"+ person + ".js", jsStr, "utf8", (err)=> {
                                if (err) throw err;
                                execFile(`mocha test${person}.js`, (err, stdout, stderr)=> {
                                    console.log(err, stdout, stderr);
                                    var testURL = uuidname + dateStr + ".html";
                                    if (err) {
                                        // 测试有失败
                                        return ress.json({
                                            state: false,
                                            testURL: testURL
                                        })
                                    }else {
                                        return ress.json({
                                            state:true,
                                            testURL: testURL
                                        })
                                    }
                                })
                            })
                        })
                    })).catch((err)=> {
                        return ress.json(err.config);
                    })
                }else {
                    return ress.json(false);
                }
            })
        }
    })
});


var server = App.listen(3002,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s',host,port)
});


module.exports = function(proxy, allowedHost) {
  return {
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    contentBase: paths.appPublic,
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host,
    overlay: false,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
      after(app) {
        app.use(bodyParser());
        app.post("/", (req, result)=> {
            // 想在此获取页面post过来的data参---------使用body-parser
            axios({
                method: req.body.method,
                url: req.body.url,
                headers: req.body.headers,
                data: req.body.body,
                params: req.body.param
            }).then((res)=> {

              return result.json(res.data);
            }).catch((err)=> {
              return result.json(err.data);
            });
        });
        app.post("/surechange",(req, result)=> {
            console.log("surechange");
            var per = req.body.person;
            var auth = req.body.tar;
            var path = req.body.path;
            var obj = req.body.newData;
            // console.log(obj)
            var runner = req.body.runner;
            fs.readFile("public/storage/" + per + ".json","utf8", (err, data)=> {
                var objdata = JSON.parse(data);

                if (err) throw err;
                if (auth) {
                    // share
                    var pre = req.body.preText;
                    var test = req.body.TestText;
                    var resState = addState(data, per, path, obj, pre, test);
                    if (JSON.stringify(resState) === "{}" || resState === undefined) {
                        fs.writeFile("public/storage/" + per + ".json",data, "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }else {
                        fs.writeFile("public/storage/" + per + ".json", JSON.stringify(resState), "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }
                }else if (runner) {
                    // runner
                    objdata.task_runner = runner;
                    // 改变自己json
                    if (JSON.stringify(objdata) === "{}" || objdata === undefined) {
                        fs.writeFile("public/storage/" + per + ".json", data, "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }else {
                        fs.writeFile("public/storage/" + per + ".json", JSON.stringify(objdata), "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }
                    // 改变接口json
                    taskManager(runner, per);
                }else if (typeof obj === "object") {
                    var variable = objdata.variable;
                    objdata = {
                        ...obj,
                        variable: [
                            ...variable
                        ]
                    };
                    if (JSON.stringify(objdata) === "{}") {
                        fs.writeFile("public/storage/" + per + ".json", data, "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }else {
                        fs.writeFile("public/storage/" + per + ".json", JSON.stringify(objdata), "utf8", (err)=> {
                            if (err) throw err;
                            return result.json("ok");
                        })
                    }
                }
            });
        });
        app.post("/sureShare", (req, res)=> {
            console.log("sureshare");
            console.log(req.body.host);
            fs.readFile("public/storage/" + req.body.shareTo + ".json", "utf8", (err, data)=> {
                if(err) throw err;
                var dataobj = JSON.parse(data);
                var shareArr = dataobj.shared;
                var len = shareArr.length;
                var arr = [];
                var rarr = req.body.r;
                var warr = req.body.w;
                rarr.forEach((ele, index)=> {
                    arr.push({"path": ele, "auth": "r"});
                });
                warr.forEach((ele, index)=> {
                    arr.push({"path": ele, "auth": "w"});
                });
                var obj = {};
                var shareFlag = true;
                for (var i = 0; i< len; i++) {
                    // 曾经分享过
                    if (shareArr[i].name === req.body.host) {
                        shareFlag = false;
                        shareArr[i].item = arr;
                        obj = {
                            ...dataobj,
                            shared: shareArr
                        };
                        if (JSON.stringify(obj) === "{}" || obj === undefined) {
                            fs.writeFile("public/storage/" + req.body.shareTo + ".json", data, "utf8", (err)=> {
                                if (err) throw err;
                                return res.json("ok");
                            })
                        }else {
                            fs.writeFile("public/storage/" + req.body.shareTo + ".json", JSON.stringify(obj) ,"utf8", (err)=> {
                                if (err) throw err;
                                return res.json("ok");
                            })
                        }
                    }
                }
                if (shareFlag) {
                    shareArr.push({
                        name: req.body.host,
                        item: arr
                    });
                    obj = {
                        ...dataobj,
                        shared: shareArr
                    };
                    if (JSON.stringify(obj) === "{}" || obj === undefined) {
                        fs.writeFile("public/storage/" + req.body.shareTo + ".json", data, "utf8", (err)=> {
                            if (err) throw err;
                            return res.json("ok");
                        })
                    }else {
                        fs.writeFile("public/storage/" + req.body.shareTo + ".json", JSON.stringify(obj) ,"utf8", (err)=> {
                            if (err) throw err;
                            return res.json("ok");
                        })
                    }
                }
            });
        });
        app.post("/changeOthersVar", (req, result)=> {
            var person = req.body.person;
            var addVar = req.body.variable;
            fs.readFile("public/storage/" + person + ".json", "utf8", (err, data)=> {
                if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable.push(addVar);
                if (JSON.stringify(newData) === "{}" || newData === undefined) {
                    fs.writeFile("public/storage/" + person + ".json", data, "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }else {
                    fs.writeFile("public/storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }
            })
        });
        app.post("/changeSingleSelfVar", (req, result)=> {
            var variable = req.body.variable;
            var person = req.body.self;
            var index = req.body.index;
            fs.readFile("public/storage/" + person + ".json","utf8", (err, data)=> {
                if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable[index] = variable;
                if (JSON.stringify(newData) === "{}" || newData === undefined) {
                    fs.writeFile("public/storage/" + person + ".json", data, "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }else {
                    fs.writeFile("public/storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                        if (err) throw  err;
                        return result.json("ok");
                    })
                }
            })
        });
        app.post("/changeSelfVar", (req, result)=> {
            var varList = req.body.varList;
            var person = req.body.self;
           fs.readFile("public/storage/" + person + ".json","utf8", (err, data)=> {
               if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable = varList;
               if (JSON.stringify(newData) === "{}" || newData === undefined) {
                   fs.writeFile("public/storage/" + person + ".json", data, "utf8", (err)=> {
                       if (err) throw err;
                       return result.json("ok");
                   })
               }else {
                   fs.writeFile("public/storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                       if (err) throw  err;
                       return result.json("ok");
                   })
               }
           })
        });
        // 人名变量替换
        app.get("/new", (req,res)=> {
            // console.log(getIPAddress()); 10.12.28.36
            // 每次遍历人数，及时增加share列表
            console.log("new222");
            var person = req.query.person;
            console.log(person);

            var path = req.query.path;
          fs.readFile("public/storage/" + person + ".json","utf8", (err, data)=> {
                if (err) throw err;
                if (!path) {
                    // 初始全部请求
                    var stateData = JSON.parse(data);
                    var shareArr = stateData.share;
                    var slen = shareArr.length;
                    var shareArrName = [];
                    for (var k = 0; k < slen; k++) {
                        shareArrName.push(shareArr[k].name);
                    }
                    // console.log(666)
                    fs.readFile("public/storage/ip_address.json", "utf8", (err, ipdata)=> {
                        var ipAdd = JSON.parse(ipdata);
                        // console.log(ipAdd)
                        // ipAdd.ip  [{"ip":"10.12.28.36","name":"person0"}]
                        var iplen = ipAdd.ip.length;
                        // console.log(stateData.share)
                        for (var s = 0; s < iplen; s++) {
                            // 现有ipname不是本身，且本身shareList不包含ipname
                            if (person !== ipAdd.ip[s].name && shareArrName.indexOf(ipAdd.ip[s].name) === -1 )  {
                                // 增加
                                var shareObj = {
                                    name: ipAdd.ip[s].name,
                                    item: [{
                                        "r": []
                                    },
                                    {
                                        "w": []
                                    }]
                                };
                                stateData.share.push(shareObj);
                            }
                        }
                        // console.log(stateData)

                        if (JSON.stringify(stateData) === "{}" || stateData === undefined) {
                            fs.writeFile("public/storage/" + person + ".json", data, "utf8", (err)=> {
                                if (err) throw err;
                                return res.json(data);
                            })
                        }else {
                            fs.writeFile("public/storage/" + person + ".json", JSON.stringify(stateData), "utf8", (err)=> {
                                if (err) throw err;
                                // console.log(stateData)
                                return res.json(stateData)
                            });
                        }
                    });
                }else {
                    var pathArr = path.split("/");
                    var result = findPath(pathArr, data);
                    return res.json(result);
                }
            });
        });
        app.post("/createUuid", (req, res)=>{
              var name = req.body.taskName;
              var per = req.body.person;
              var uuid = uuidv1();
              // 写入task_uuid文件
              // console.log(uuid);

              fs.readFile("public/storage/task_uuid.json", "utf8", (err, data)=> {
                  if (err) throw err;
                  var task_uuid = JSON.parse(data);
                  console.log(uuid);
                  task_uuid[uuid] = {
                      "path": [],
                      "name": name,
                      "person": per
                  };
                  // console.log(task_uuid)
                  if (JSON.stringify(task_uuid) === "{}" || task_uuid === undefined) {
                      fs.writeFile("public/storage/task_uuid.json", data, "utf8", (err)=> {
                          if (err) throw err;
                          return res.json("ok");
                      })
                  }else {
                      fs.writeFile("public/storage/task_uuid.json", JSON.stringify(task_uuid), "utf8", (err)=> {
                          if (err) throw err;
                      })
                  }
              });
              // 写入person文件
              fs.readFile("public/storage/" + per +".json", "utf8", (er, dat)=> {
                  if (er) throw er;
                  var perdata = JSON.parse(dat);
                  perdata["task_runner"][name] = {
                      taskUuid:uuid,
                      path: []
                  };
                  if (JSON.stringify(perdata) === "{}" || perdata === undefined) {
                      fs.writeFile("public/storage/" + per + ".json", dat, "utf8", (err)=> {
                          if (err) throw err;
                          return res.json("ok");
                      })
                  }else {
                      fs.writeFile("public/storage/" + per + ".json", JSON.stringify(perdata), "utf8", (err)=> {
                          if (err) throw err;
                          return res.json(uuid);
                      })
                  }
              })
          })
    },
    before(app, server) {
      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(app);
      }
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
        app.get("/ip", (req,res)=> {
            let getClientIp = function (req) {
                return req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress || '';
            };
            let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
            ip = ip ? ip.join('.') : null;
            var IPAddress = ip;
            fs.readFile("public/storage/ip_address.json", "utf8", (err, data)=> {
                if (err) throw err;
                var ipData = JSON.parse(data);
                var ipArr = ipData.ip;
                var len = ipArr.length;
                var person;
                for (var i = 0; i < len; i++) {
                    if (ipArr[i].ip === IPAddress) {
                        person = ipArr[i].name;
                        break;
                    }
                }
                if (!person) {
                    // 新入
                    ipData.ip[len] = {
                        ip: IPAddress,
                        name: "ip" + IPAddress
                    };
                    // 创建新
                    var shareArr = [];
                    for (var j = 0; j < len; j++) {
                        var obj = {
                            // "name": "person" + j,
                            name: ipData.ip[j].name,
                            "item": [{
                                "r": []
                            },
                                {
                                    "w": []
                                }]
                        };
                        shareArr.push(obj)
                    }
                    // person = "person" + len;
                    person = "ip" + IPAddress;
                    var newPerson = {
                        variable: [{
                            "name": "Global",
                            "values": [{
                                "key": "userType",
                                "value": "changyou",
                                "enabled": true
                            }],
                            "from": "raw"
                        }],
                        shared:[],
                        share: shareArr,
                        task_runner: {}
                    };
                    // 新增数据
                    fs.writeFile("public/storage/" + person + ".json", JSON.stringify(newPerson), "utf8", (err)=> {
                        if (err) throw err;
                        if (JSON.stringify(ipData) === "{}" || ipData === undefined) {
                            fs.writeFile("public/storage/ip_address.json", data, "utf8", (err)=> {
                                if (err) throw  err;
                            });
                            return res.json(null); // 创建失败，重新刷新, 覆盖创建失败的person
                        }else {
                            // 新增id标识
                            fs.writeFile("public/storage/ip_address.json", JSON.stringify(ipData), "utf8", (err) => {
                                if (err) throw  err;
                            });
                            return res.json({
                                person: person,
                                IPAddress: IPAddress
                            });
                        }
                    })
                }else {
                    // 不是新入，刷新share
                    return res.json({
                        person: person,
                        IPAddress: IPAddress
                    });
                }
                // console.log(person)
            });
        });
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
