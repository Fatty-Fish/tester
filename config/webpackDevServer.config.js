'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('./webpack.config.dev');
const paths = require('./paths');
const findPath = require('./findState');
const addState = require('./addState');
const fs = require('fs');
const axios = require("axios");
const bodyParser = require('body-parser');
var person0 = require("../storage/person0.json");

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

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
            var per = req.body.person;
            var auth = req.body.tar;
            var path = req.body.path;
            var obj = req.body.newData;
            if (auth) {
                fs.readFile("storage/" + per + ".json","utf8", (err, data)=> {
                    if (err) throw err;
                    var resState = addState(data, per, path, obj);
                    fs.writeFile("storage/" + per + ".json", JSON.stringify(resState), "utf8", (err)=> {
                        if (err) throw err;
                        return result.json("ok");
                    })
                });
            }else {
                fs.writeFile("storage/" + per + ".json", JSON.stringify(obj), "utf8", (err)=> {
                    if (err) throw err;
                    return result.json("ok");
                })
            }
        });
        app.post("/sureShare", (req, res)=> {
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
                for (var i = 0; i< len; i++) {
                    if (shareArr[i].name === req.body.host) {
                        shareArr[i].item = arr
                    }
                };
                var obj = {
                    ...dataobj,
                    shared: shareArr
                };
                fs.writeFile("storage/" + req.body.shareTo + ".json", JSON.stringify(obj) ,"utf8", (err)=> {
                    if (err) throw err;
                    return result.json("ok");
                })
            });
        });
        // 人名变量替换
        app.get("/new", (req,res)=> {
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
          app.post("/task/:id", (req, res)=>{

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
