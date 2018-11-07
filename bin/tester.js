#!/usr/bin/env node


var fs = require('../lib/fs');

process.argv.slice(2).forEach(function(arg) {
    var flag = arg.split('=')[0];
    console.info(flag);
    switch (flag) {
        case '-clear':
            fs.clearAll();
            break;
        case '-save':
            fs.saveFormal();
            break;
    }
});

// process.argv

// [ 'C:\\Program Files\\nodejs\\node.exe',
//   'D:\\Program Files\\nodejs\\node_global\\node_modules\\mocha\\bin\\_mocha',
//   'tester.js' ]