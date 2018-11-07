
exports.buildGetParam = function (params) {
    if(undefined == params || null == params) return '';
    let keys = Object.keys(params);
    if(undefined == keys || '' == keys || keys.length == 0) return params;
    let res = '';
    for(let item of keys){
        res = res.concat('&', item, '=', encodeURIComponent(JSON.stringify(params[item])));
    }
    return res.substring(1);
};

//最长请求时间
exports.maxRequestCost = function () {
    return 177;
};

exports.successRate = function () {
    return 0.9;
};

/*
* name 名称
* time 耗费时间
* */
exports.testResult = function () {
    return {"name": -1, "time": -1, "err" : undefined};
};

exports.analyzeResults = function (results) {
    let err = 0;
    let success = 0;
    let timeout = 0;
    let res = {"costs":[], "errs" :[]};
    for(let item of results){
        if(item.err != undefined){
            err ++;
            res.errs.push(item.err);
        }
        else if(item.time > this.maxRequestCost()) timeout ++;
        else success ++;
        res.costs.push(item.time);
    }
    return res;
    // return {"success" : success, "timeout" : timeout, "err" : err, "successRate" : (success / results.length)};
};