
class Config{
    constructor() {
        if(undefined != this.request && null != this.request) return;
        else{
            process.version

            // var rootPath = process.cwd();
            // var app = require(rootPath + "/src/app");
            var app = this.getApp();
            var _request_ = require('supertest');
            this.request = _request_(app.listen());
        }
    }
    getRequest() {
        return this.request;
    }
    getApp(){
        var rootPath = process.cwd();

        var _ = require('lodash');
        let v = process.version;
        let v_ = _.split(v, '\.', 3);
        let version = _.replace(v_[0], 'v', '');
        //if(version < 6){

            //compiler();
        var app = require(rootPath + '/app/app');
        return app;
        /*}else{
            var app = require(rootPath + "/src/app");
            return app;
        }*/
    }
}

exports = module.exports = new Config();