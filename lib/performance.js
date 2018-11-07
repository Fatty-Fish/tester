
var logger = require('core-logger').logger;
var testUtil = require('./testUtil');
var async = require('async');
var should = require('should');
var request = require('./config').getRequest();
// exports.setRequest = function(r){
//     request = r;
// };
/*
* times 最大请求次数
* url 请求地址，如果传入了app启动配置，则支持使用相对路径。
* param 参数
* done supertest的done函数
* concurrency 最高并发数，默认10个并发
* */
exports.get = function (times, url, param, done, concurrency) {
    test(times, url, param, done, function (newParam, afterRequest, beginTime) {
        request.get(url)
        // .set('Content-type', 'application/json')
            .expect('Content-Type', /json/)
            .query(newParam)
            .expect(200)
            .end(function (err, res) {
                requestEnd(afterRequest, err, res, beginTime);
            });
    }, concurrency);
};

exports.post = function (times, url, param, done, concurrency) {
    test(times, url, param, done, function (newParam, afterRequest, beginTime) {
        request.post(url)
            .set('Content-type', 'application/json')
            .send(newParam)
            .expect(200)
            .end(function (err, res) {
                requestEnd(afterRequest, err, res, beginTime);
            });
    }, concurrency);
};

exports.put = function (times, url, param, done, concurrency) {
    test(times, url, param, done, function (newParam, afterRequest, beginTime) {
        request.put(url)
            .set('Content-type', 'application/json')
            .send(newParam)
            .expect(200)
            .end(function (err, res) {
                requestEnd(afterRequest, err, res, beginTime);
            });
    }, concurrency);
};

exports.delete = function (times, url, param, done, concurrency) {
    test(times, url, param, done, function (newParam, afterRequest, beginTime) {
        request.delete(url)
            .set('Content-type', 'application/json')
            .send(newParam)
            .expect(200)
            .end(function (err, res) {
                requestEnd(afterRequest, err, res, beginTime);
            });
    }, concurrency);
};

var test = function (times, url, param, done, doRequest, concurrency) {
    let param_ = testUtil.buildGetParam(param);
    let arr = [];
    for(let i = 0; i < times; i++)
        arr.push({});

    let begin0 = new Date().getTime();
    let limitConcurrency = 10;
    if(concurrency) limitConcurrency = concurrency;
    logger.debug('并发数限制：%s', limitConcurrency);
    async.mapLimit(arr, limitConcurrency, function (item, afterRequest) {
        let begin = new Date().getTime();
        /*request.get(url)
        // .set('Content-type', 'application/json')
            .expect('Content-Type', /json/)
            .query(param_)
            .expect(200)
            .end(function (err, res) {
                requestEnd(callback, err, res, begin);
            });*/
        doRequest(param_, afterRequest, begin);

    }, function (err, results) {
        let end = new Date().getTime();
        should.not.exists(err);
        if(err) logger.error(err);

        let analyzer = testUtil.analyzeResults(results);

        // logger.warn(JSON.stringify(analyzer));
        logger.warn('call url ： %s %s times, cost %s ms, result : %s', url, times, end - begin0, JSON.stringify(analyzer));
        // logger.debug(JSON.stringify(results));
        // analyzer.successRate.should.not.be.below(testUtil.successRate());

        done();
    });
};

var requestEnd = function (callback, err, res, begin) {
    let end = new Date().getTime();
    if (err) throw new Error(err);
    res.body.code.should.be.equal(10000);

    callback(err, {"time" : (end - begin), "err" : err});
};