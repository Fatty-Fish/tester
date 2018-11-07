var request = require('supertest');
var should = require('should');

exports.get = function ( url, head) {
    // let currParam = param.param || param;
    request.get("/")
            .set(head)
            .expect(200)
            .end(function (err,res) {
                should.not.exist(err);
                // console.log(err)
                var a = "aaa";
                a.should.be.equal("eaaa")
                // res.body.code.should.equal(34423);
                done();
            })
        }
