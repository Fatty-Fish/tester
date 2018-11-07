
var func = require('./lib/func');
var performance = require('./lib/performance');
var testUtil = require('./lib/testUtil');
var c;
var pub = {
    // init : function (app) {
    //     c = new config(app);
    //     performance.setRequest(c.getRequest());
    //     func.setRequest(c.getRequest());
    // },//config.init,//传入app，用于启动当前project的服务
    // data : {
    //     save : fs.saveFormal,// 无参，将当前临时区的数据保存到标准数据中。临时区有的会替换，没有的保持不变
    //     clearTemp : fs.clearAll()//执行测试前，清理临时区
    // },
    func : {
        //caseName 用例名称，英文。所在project中要唯一
        // url请求地址，相对地址//
        // param 格式：
              /*param : {
                caseName:'',//非必填
                param:{},//执行参数
                result:{}//执行结果的正确值，非必填
              }*/
        // assertFunction(err, res) 回调检查结果正确性
        // done supertest的done函数
        get : func.get,//
        post : func.post,//
        put : func.put,//
        delete : func.delete//
    },
    performance : {
        /*
         * times 最大请求次数
         * url 请求地址，如果传入了app启动配置，则支持使用相对路径。
         * param 参数
         * done supertest的done函数
         * concurrency 最高并发数，默认10个并发
         * */
        get : performance.get,//
        post : performance.post,//
        put : performance.put,//
        delete : performance.delete//
    },
    util : {
        buildGetParam : testUtil.buildGetParam//传入json格式的参数，构建成标准get请求参数
    }
};

module.exports = pub;