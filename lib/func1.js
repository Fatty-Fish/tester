var request = require('superagent');
require("should");
var fs = require('./fs');
var comparator = require('./comparator');

/***  GET请求  **/ 
var get = function (url, query, head, caseName, param, callback, done) {
    request.get(url)
            .set(head)
            .query(query)
            .end((err, res) => {
                should.not.exist(err)
                afterRequest(caseName, param, err, res.body, callback, done);
            })
};

/***   POST请求  ****/ 
var post = function (url, head,caseName, param, callback, done) {
    request.post(url)
            .set(head)
            .end((err, res) => {
                should.not.exist(err)
                afterRequest(caseName, param, err, res.body, callback, done);
            })
}



var afterRequest = function (caseName, param, err, res, callback, done) {
    if (err) throw new Error(err);
    else fs.saveTemp(caseName, JSON.stringify(res));

    callback(err, res);
    //与传入的param比较
    sysAssert(param, res);
    //与标准data比较，
    dataAssert(caseName, res);
    done();
}
let sysAssert = function (param, res) {
    if(!param) return;
    comparator(param, res);
};

let dataAssert = function (caseName, res) {
    let standard = fs.readStandardData(caseName);
    if(undefined == standard || null == standard) return;
    comparator(JSON.parse(standard), res);
};


module.exports = {
    get,
    post

};