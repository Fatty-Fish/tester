
var logger = require('core-logger').logger;
var path = require("path");
var fs = require('fs');
var _ = require('lodash');

// var exec = require('child_process').exec,child;
// child = exec('rm -rf test',function(err,out) {
//     console.log(out); err && console.log(err);
// });
var util = require('util');


let dirTemp = path.join(process.cwd(), '/testdata/v2/');
// let dirTemp = path.join(process.cwd(), '/exampleLog/');
// let dirFormal = path.join(process.cwd(), '/standardData');
let dirFormal = path.join(process.cwd(), '/testdata/v0/');

exports.saveTemp = function (caseName, data) {
    // clearAll();
    if(!fs.existsSync(dirTemp))
        makeMutilDir(dirTemp);
    let file = path.join(dirTemp, caseName);
    // fs.writeFileSync(file, data);
    fs.writeFile(file, data, function(err) {
        if (err) throw err;
        // logger.debug('存储临时数据%s完成', caseName);
    });
};

exports.saveFormal = function () {
    let files = read(dirTemp);
    if(undefined == files || files.size == 0){
        logger.warn('没有结果数据，请先执行测试用例，检查数据正确后重试');
        return;
    }
    if(!fs.existsSync(dirFormal))
        makeMutilDir(dirFormal);
    for(let file of files){
        clear(file, 'standardData');
        move(path.join(dirTemp, file), path.join(dirFormal, file));
        logger.debug('保存测试数据： %s', file);
    }
    logger.debug('保存本次测试数据完成！');
};

/*
* 执行测试前必须清理，且只能清理一次。
* */
exports.clearAll = function () {
    if(fs.existsSync(dirTemp))//fs.statSync(curPath).isDirectory()
        deleteFolderRecursive(dirTemp);
};
/*
* 读取已经保存过的标准结果
* fileName : result 格式
* */
exports.readStandardData = function (caseName) {
    let files = read(dirFormal);
    if(files.length == 0) return;
    let datas = {};
    let singleCase = undefined != caseName && '' != caseName;
    for(let file of files){
        if(singleCase && file != caseName) continue;

        let data = fs.readFileSync(path.join(dirFormal, file), 'utf-8');
        if(singleCase) return data;
        else datas[file] = data;
    }
    if(_.isEmpty(datas))return;
    return datas;
};

let clear = function (caseName, version) {
    let dir;
    if('v0' == version)dir = dirFormal;
    else dir = dirTemp;
    let file = path.join(dir, caseName);
    if(fs.existsSync(file))
        fs.unlinkSync(file);
};

let read = function (dir) {
    if(!fs.existsSync(dir)) return[];
    let files = fs.readdirSync(dir);
    return files;
};

let move = function (src, des) {
    let is = fs.createReadStream(src)
    let os = fs.createWriteStream(des);
    is.pipe(os);
    /*util.pump(is, os, function() {
        fs.unlinkSync(src);
    });*/
};
//?
function makeMutilDir(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split("/").forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
                if(dirname){
                    pathtmp = dirname;
                }else{
                    pathtmp = "/";
                }
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }else{
        deleteFolderFiles(dirpath);
    }
    return true;
}
function deleteFolderRecursive(dir) {
    var files = [];
    //判断给定的路径是否存在
    if(fs.existsSync(dir) ) {
        //返回文件和子目录的数组
        files = fs.readdirSync(dir);
        files.forEach(function(file,index){
            // var curPath = url + "/" + file;
            var curPath = path.join(dir,file);
            //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                // 是文件delete file
            } else {
                fs.unlinkSync(curPath);
            }
        });
        //清除文件夹
        fs.rmdirSync(dir);
    }
}