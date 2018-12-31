'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('./webpack.config.dev');
const paths = require('./paths');
const findPath = require('./findState');
const addState = require('./addState');
const mkdirs = require("./mkdirs");
const replaceReg = require("./replaceReg");
const clearArr = require("./clearArr");
const fs = require('fs');
const chai = require("chai");
const axios = require("axios");
const bodyParser = require('body-parser');

const uuidv1 = require("uuid/v1");
var person0 = require("../storage/person0.json");

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

const express = require("express");
var App = express();
App.all("*", function(req, res, next) {             //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
App.get("/task/:uuid", (req, ress)=>{
    console.log(req.params.uuid);
    var para = req.params.uuid;
    fs.readFile("storage/task_uuid.json", "utf8", (err, data)=> {
        // get path person
        if (err) throw err;
        var taskData = JSON.parse(data);
        var path = taskData[para].path;
        console.log(path)
        var person = taskData[para].person;
        var npath = path.replace(person +"/", "");
        console.log(person)
        fs.readFile("storage/" + person + ".json", "utf8", (err, data)=> {
            if (err) throw err;
            var cont = findPath(npath.split("/"), data);
            // 前置脚本 不做处理
            // 后置脚本
            var perState = JSON.parse(data);
            var variable = perState.variable;  // 当前的所有环境变量集合
            console.log(variable);
            console.log(cont.request);
            console.log(78787887)
            var select = cont.request.valSelect;

            // 找出global
            var glo;
            for(var i = 0; i < variable.length; i++) {
                if (variable[i].name === "Global") {
                    glo = i;
                    break;
                }
            }
            var thisList = variable[select];  // 当前选中的环境变量
            var len = thisList.length;
            // 当前所有环境变量和全局变量的集合
            var varContent = [
                ...variable[glo].values,
                ...variable[select].values
            ];
            var testScript = cont.event[1].script.exec.join("");
console.log(testScript)
            var method = cont.request.method;
            var url = cont.request.url.raw;
            if (url.indexOf("http") === -1) {
                // no protocal
                url = "http://" + url;
            }
            // 修改url
            if (url.indexOf("{{") >= 0) {
                len = varContent.length;
                url = replaceReg(url,varContent, len, 0);
            }
            // 修改其他arr
            var header = clearArr(varContent, cont.request.header);
            var headers = {};
            header.map((ele, index)=> {
                headers[ele.key] = ele.value;
            });
            var body = cont.request.body, bodyArr;
            if (body.mode) {
                bodyArr = clearArr(varContent, body[body.mode]);
            }else {
                bodyArr = clearArr(varContent, body.formdata);
            }
            var bodys = {};
            bodyArr.map((ele, index)=> {
                bodys[ele.key] = ele.value;
            });
            var query = clearArr(varContent, cont.request.url.query);
            var querys = {};
            if (query) {
                query.map((ele, index)=> {
                    querys[ele.key] = ele.value;
                })
            }
            axios({
                method: method,
                url: url,
                headers: headers,
                data: bodys,
                params: querys,
            }).then((res)=> {
                var StrTemplate = `<!DOCTYPE html><html><head><title>${path}</title>
<link href="https://cdn.bootcss.com/mocha/5.2.0/mocha.min.css" rel="stylesheet"></head><body><div id="mocha"></div><script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script><script src="https://cdn.bootcss.com/mocha/5.2.0/mocha.min.js"></script><script src="https://cdn.bootcss.com/chai/4.2.0/chai.min.js"></script><script>mocha.setup('bdd')</script>
        <!-- load code you want to test here -->
        <script >
        var varContent = ${JSON.stringify(varContent)};
        var testScript = ${JSON.stringify(testScript)};
                            var pm = {
                    varList:  () => {
                        return ${JSON.stringify(variable)} // 当前的所有环境变量集合
                    },
                    thisList:  ()=> {
                        return ${JSON.stringify(thisList.values)}
                    },
                    len:  ()=> {
                        return ${JSON.stringify(len)}
                    },
                    globalList: ()=> {
                        var varList = pm.varList();
                        var gindex = ${JSON.stringify(glo)};
                        return varList[gindex].values
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
                            varList[select].values = thisList;
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
                            varList[select].values = thisList;
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
                            varList[${JSON.stringify(glo)}].values = gList;
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
                            varList[${JSON.stringify(glo)}].values = gList;
                        }
                    },
                    variables: {
                        get: (var_key)=> {
                            // 当前环境变量和全局变量的集合
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
                            return ${JSON.stringify(res.data)}
                        }
                    },
                    assert: chai.assert
                };

                eval(testScript)
</script>
        <!-- load your test files here -->

<script>mocha.run();</script></body></html>`;
                // 写为文件
                var forePath = path.split("/");
                forePath.splice(forePath.length - 1, 1);
                // var dirPath = forePath.join("/");
                fs.access("test_task/" + path + ".html", fs.constants.F_OK, (err) => {
                    if (err) {
                        mkdirs("test_task", path + ".html", JSON.stringify(StrTemplate));
                    }else {
                        // 文件存在
                        fs.writeFile("test_task/" + path + ".html", StrTemplate, "utf8", (err)=> {
                            if (err) throw err;
                            ress.setHeader('Content-Type', 'text/html; charset=UTF-8');
                            // ress.
                            ress.sendfile("test_task/" + path + ".html")
                        });
                    }
                });

            }).catch((err)=> {
                ress.send("样例请求中断了，无法测试")
            })

        })
    });
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
            console.log("surechange")
            var per = req.body.person;
            var auth = req.body.tar;
            var path = req.body.path;
            var obj = req.body.newData;
            // console.log(obj)
            var runner = req.body.runner;
            fs.readFile("storage/" + per + ".json","utf8", (err, data)=> {
                var objdata = JSON.parse(data);

                if (err) throw err;
                if (auth) {
                    var pre = req.body.preText;
                    var test = req.body.TestText;
                    var resState = addState(data, per, path, obj, pre, test);
                    fs.writeFile("storage/" + per + ".json", JSON.stringify(resState), "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }else if (runner) {
                    // runner
                    objdata.task_runner = runner;
                    fs.writeFile("storage/" + per + ".json", JSON.stringify(objdata), "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }else {
                    var variable = objdata.variable;
                    objdata = {
                        ...obj,
                        variable: [
                            ...variable
                        ]
                    };
                    fs.writeFile("storage/" + per + ".json", JSON.stringify(objdata), "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                }
            });

        });
        app.post("/sureShare", (req, res)=> {
            console.log("sureshare")
            fs.readFile("storage/" + req.body.shareTo + ".json", "utf8", (err, data)=> {
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
                for (var i = 0; i< len; i++) {
                    // 曾经分享过
                    if (shareArr[i].name === req.body.host) {
                        shareArr[i].item = arr;
                        obj = {
                            ...dataobj,
                            shared: shareArr
                        };
                        fs.writeFile("storage/" + req.body.shareTo + ".json", JSON.stringify(obj) ,"utf8", (err)=> {
                            if (err) throw err;
                            return res.json("ok");
                        })
                    }
                }
                shareArr.push({
                    name: req.body.host,
                    item: arr
                });
                obj = {
                    ...dataobj,
                    shared: shareArr
                };
                fs.writeFile("storage/" + req.body.shareTo + ".json", JSON.stringify(obj) ,"utf8", (err)=> {
                    if (err) throw err;
                    return res.json("ok");
                })
            });
        });
        app.post("/changeOthersVar", (req, result)=> {
            var person = req.body.person;
            var addVar = req.body.variable;
            fs.readFile("storage/" + person + ".json", "utf8", (err, data)=> {
                if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable.push(addVar);
                fs.writeFile("storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                    if (err) throw err;
                    return result.json("ok");
                })
            })
        });
        app.post("/changeSingleSelfVar", (req, result)=> {
            var variable = req.body.variable;
            var person = req.body.self;
            var index = req.body.index;
            fs.readFile("storage/" + person + ".json","utf8", (err, data)=> {
                if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable[index] = variable;
                fs.writeFile("storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                    if (err) throw  err;
                    return result.json("ok");
                })
            })
        });
        app.post("/changeSelfVar", (req, result)=> {
            var varList = req.body.varList;
            var person = req.body.self;
           fs.readFile("storage/" + person + ".json","utf8", (err, data)=> {
               if (err) throw err;
                var newData = JSON.parse(data);
                newData.variable = varList;
                fs.writeFile("storage/" + person + ".json", JSON.stringify(newData), "utf8", (err)=> {
                    if (err) throw  err;
                    return result.json("ok");
                })
           })
        });
        // 人名变量替换
        app.get("/new", (req,res)=> {
            console.log("new222")
            var person = req.query.person;
          var path = req.query.path;
          fs.readFile("storage/" + person + ".json","utf8", (err, data)=> {
                if (err) throw err;
                if (!path) {
                    return res.json(data)
                }else {
                    var pathArr = path.split("/");
                    var result = findPath(pathArr, data);
                    return res.json(result);
                }
            });
        });
        app.post("/lightTask", (req, res)=> {
            var path = req.body.path;
            var per = req.body.person;
            var uuid = uuidv1();
            fs.readFile("storage/task_uuid.json", "utf8", (er, dat)=> {
                if (er) throw er;
                var task_uuid = JSON.parse(dat);
                for (var prop in task_uuid) {
                    if (task_uuid[prop].path === path) {
                        delete task_uuid[prop]
                    }
                }
                task_uuid[uuid] = {
                    path: path,
                    person: per
                };
                fs.writeFile("storage/task_uuid.json", JSON.stringify(task_uuid), "utf8", (err)=> {
                    if (err) throw err;
                })
            });
            fs.readFile("storage/" + per + ".json","utf8", (err, data)=> {
                if (err) throw err;
                var perdata = JSON.parse(data);
                perdata["task_runner"][path] = uuid;
                fs.writeFile("storage/" + per + ".json", JSON.stringify(perdata), "utf8", (err)=> {
                    if (err) throw err;
                    return res.json(uuid);
                })
            })
        })
    },
    before(app, server) {
      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(app);
      }

      app.get("/person0", (req,res)=> {
        return res.json(person0);
      });
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
