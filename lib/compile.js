//?
var log = console.log.bind(console, '>>> [DEV]:'.red);
var babelCliDir = require('babel-cli/lib/babel/dir');
var babelCliFile = require('babel-cli/lib/babel/file');
var path = require("path");
var fs = require('fs');
function compile() {
    log('Compiling...'.green);
    let target = path.join(process.cwd(), '/testapp/');
    let src = path.join(process.cwd(), '/src/');
    babelCliDir({outDir: target, retainLines: true, sourceMaps: true}, [src]);
}
function compileFile(srcDir, outDir, filename, cb) {
    var outFile = path.join(outDir, filename);
    var srcFile = path.join(srcDir, filename);
    try {
        babelCliFile({
            outFile: outFile,
            retainLines: true,
            highlightCode: true,
            comments: true,
            babelrc: true,
            sourceMaps: true
        }, [srcFile], {highlightCode: true, comments: true, babelrc: true, ignore: [], sourceMaps: true});
    } catch (e) {
        console.error('Error while compiling file %s', filename, e);
        return
    }
    console.log(srcFile + ' -> ' + outFile);
    cb && cb()
}

function cacheClean() {
    Object.keys(require.cache).forEach(function (id) {
        if (/[\/\\](app)[\/\\]/.test(id)) {
            delete require.cache[id]
        }
    });
    log('♬ App Cache Cleaned...'.green)
}
exports = module.exports = compile;