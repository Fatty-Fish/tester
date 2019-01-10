const fs = require("fs");
const Path = require("path");

const BASE_URL = Path.join(__dirname, "../");

function mkdirs (parPath, path, content, ress) {
    var pathArr = path.split("/");
    var thispath = pathArr[0];
    fs.access(parPath + "/" + thispath, fs.constants.F_OK, (err) => {
        if (err) {
            // 不存在
            // console.log(parPath + thispath)
            if (path.indexOf("/") === -1) {
                fs.writeFile(parPath + "/" + thispath, content, "utf8", (err)=> {
                    if (err) throw err;
                    console.log("写完了")
                    ress.setHeader('Content-Type', 'text/html; charset=UTF-8');
                    ress.sendFile(BASE_URL+ parPath + "/" + thispath);
                    // console.log(BASE_URL+ parPath + "/" + thispath)

                });

            }else {
                fs.mkdir(parPath + "/" + thispath, { recursive: true }, (err) => {
                    if (err) throw err;
                    pathArr.splice(0, 1);
                    mkdirs(parPath + "/" + thispath, pathArr.join("/"), content, ress);
                })
            }
        }else {
            // 存在
            // 判断是否是根
            if (path.indexOf("/") === -1) {
                fs.writeFile(parPath + "/" + thispath, content, "utf8", (err)=> {
                    if (err) throw err;
                    console.log("写完了");
                    ress.setHeader('Content-Type', 'text/html; charset=UTF-8');
                    // console.log(BASE_URL+ parPath + "/" + thispath)
                    ress.sendFile (BASE_URL+ parPath + "/" + thispath)
                });

            }else {
                pathArr.splice(0, 1);
                mkdirs(parPath + "/" + thispath, pathArr.join("/"), content, ress);
            }
        }
    });
}




module.exports = mkdirs;