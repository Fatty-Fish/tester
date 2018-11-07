
// var logger = require('core-logger').logger;
var testUtil = require('./testUtil');
var async = require('async');
var request = require('supertest');//require('./config').getRequest();
var should = require('should');
// exports.setRequest = function(r){
//     request = r;
// };

var fs = require('./fs');

var comparator = require('./comparator');

exports.get = function ( url, head) {
    // let currParam = param.param || param;
    request = request(url);
    request.get("/")
            .set(head)
            .end(function (err, res) {
                if (err) {
                    return err
                }
                res.body.code
            })

            //  .expect({
            //     "code": 10000,
            //     "data": "eyJhbGciOiJIUzUxMiJ9.eyJKT0lOX1VTRVIiOiIxIn0.vBuCOGW3hYy5nFDDise4JKi6Ol1flrl_bY9oGj9Tx8I_5b5tvZo3YeLgr6zpIXmf1AwE0_Lb64cNLKae_9wiRw"
            // },function (err) {
            //     console.log(err)
            // })


            //  .end(function (err, res) {
                //  afterRequest(caseName, param, err, res.body, assertFunction, done);
            //  });
};

exports.post = function (caseName, url, param, assertFunction, done) {
    let currParam = param.param || param;
    request.post(url)
        .set('Content-type', 'application/json')
        .send(currParam)
        .expect(200)
        .end(function (err, res) {
            afterRequest(caseName, param, err, res.body, assertFunction, done);
        });
};

exports.put = function (caseName, url, param, assertFunction, done) {
    let currParam = param.param || param;
    request.put(url)
        .set('Content-type', 'application/json')
        .send(currParam)
        .expect(200)
        .end(function (err, res) {
            afterRequest(caseName, param, err, res.body, assertFunction, done);
        });
};

exports.delete = function (caseName, url, param, assertFunction, done) {
    let currParam = param.param || param;
    request.delete(url)
        .set('Content-type', 'application/json')
        .send(currParam)
        .expect(200)
        .end(function (err, res) {
            afterRequest(caseName, param, err, res.body, assertFunction, done);
        });
};

let afterRequest = function (caseName, param, err, res, assertFunction, done) {
    if (err) throw new Error(err);
    else fs.saveTemp(caseName, JSON.stringify(res));

    assertFunction(err, res);
    sysAssert(param, res);
    sysAssert(param, res);
    dataAssert(caseName, res);
    done();
};

let sysAssert = function (param, res) {
    if(!param.result) return;
    comparator(param.result, res);
};

let dataAssert = function (caseName, res) {
    let standard = fs.readStandardData(caseName);
    if(undefined == standard || null == standard) return;
    comparator(JSON.parse(standard), res);
};




