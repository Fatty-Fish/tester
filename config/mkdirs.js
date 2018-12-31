const fs = require("fs");

function mkdirs (parPath, path, content) {
    var pathArr = path.split("/");
    var thispath = pathArr[0];
    fs.access(parPath + "/" + thispath, fs.constants.F_OK, (err) => {
        if (err) {
            // 不存在
            // console.log(parPath + thispath)
            if (path.indexOf("/") === -1) {
                fs.writeFile(parPath + "/" + thispath, content, "utf8", (err)=> {
                    if (err) throw err;
                    return "ok"
                })
            }else {
                fs.mkdir(parPath + "/" + thispath, { recursive: true }, (err) => {
                    if (err) throw err;
                    pathArr.splice(0, 1);
                    mkdirs(parPath + "/" + thispath, pathArr.join("/"), content);
                })
            }
        }else {
            // 存在
            // 判断是否是根
            if (path.indexOf("/") === -1) {
                fs.writeFile(parPath + "/" + thispath, content, "utf8", (err)=> {
                    if (err) throw err;
                    return "ok"
                })
            }else {
                pathArr.splice(0, 1);
                mkdirs(parPath + "/" + thispath, pathArr.join("/"), content);
            }
        }
    });
}




module.exports = mkdirs;