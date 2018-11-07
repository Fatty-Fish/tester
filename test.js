var func = require("./lib/func1");

// describe("一组test", function(){
//     it("用例", function(done){
//         func.get("http://test-activity.changyou.com/test/token?guid=1", {
//             "APP": "dsdjz",
//             "ACTIVITY": "test",
//             "VERSIONCODE": "20180521",
//             "Content-Type":"application/json; charset=UTF-8"
//         }, "testToken用例", {
//             "code": 10000,
//             "data": "eyJhbGciOiJIUzUxMiJ9.eyJKT0lOX1VTRVIiOiIxIn0.vBuCOGW3hYy5nFDDise4JKi6Ol1flrl_bY9oGj9Tx8I_5b5tvZo3YeLgr6zpIXmf1AwE0_Lb64cNLKae_9wiRw"
//         }, function (err, res) {
//             console.log(res.code)
//         }, done);
//     });
//     it("用例2", function (done) {
//         func.get("http://test-activity.changyou.com/test/token2?guid=1", {
//             "APP": "dsdjz"
//         }, "ipToken测试",{
//             "code": 10000,
//             "data": "0FD56D71D315E1392DA5DD64606ED42FDF3326A47BC8286CEBEAC9690CF8BC4737BAFB59A726A0BF068B5607618F7AA8B5302D7F4A574068F5E5EBDB2F142A277F8B78B9611C51DAF47CA2414326A162E54B8EE90D02463F6558D5DA6E6D4178A9E76B8F1DA53A6613BFA5B0740C337D5116BE85887ED223DA6433740D28034396D2A86425FD1509B05AFA008761ADE20803B56798E07E8CC9C3238CBE9D593F"
//         }, function (err, res) {
//             console.log(res.data)
//         }, done);
//     })
// });

// describe("二组抽奖", function () {
//     it("抽奖", function (done) {
//         func.post("http://test-activity.changyou.com/changyou/lottery",{
//             "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJKT0lOX1VTRVIiOiIxIn0.vBuCOGW3hYy5nFDDise4JKi6Ol1flrl_bY9oGj9Tx8I_5b5tvZo3YeLgr6zpIXmf1AwE0_Lb64cNLKae_9wiRw",
//             "APP": "dsdjz",
//             "ACTIVITY": "test",
//             "VERSIONCODE": "20180521",
//             "JOIN_LOGIN":"0FD56D71D315E1392DA5DD64606ED42FDF3326A47BC8286CEBEAC9690CF8BC4737BAFB59A726A0BF068B5607618F7AA8B5302D7E4A574068D3D3F8F14D192A55229079EE551620CFEB7EA32C6807AA2EC945D0C32D07583274308FE16B44095499B664985884507B52A4E7C86151105867528CC3AC71CD1FA86F14485F302671E19FA85A21F22428AA0FFC1BE061ADE20803B56798E07E8CC1CD2189BD91503B"
//         }, "抽奖post", {
//             "code": "1012",
//             "message": "用户未登录",
//             "source": "filter"
//         }, function (err, res) {
//             console.log(res.code)
//         }, done);
//     })
//     it("中奖日志", function (done) {
//         func.get("http://test-activity.changyou.com/changyou/lottery", {
//             "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJKT0lOX1VTRVIiOiIxIn0.vBuCOGW3hYy5nFDDise4JKi6Ol1flrl_bY9oGj9Tx8I_5b5tvZo3YeLgr6zpIXmf1AwE0_Lb64cNLKae_9wiRw",
//             "APP": "dsdjz",
//             "ACTIVITY": "test",
//             "VERSIONCODE": "20180521"
//         }, "中奖日志get", {"code":10000,"data":{"pageNum":0,"pageSize":20,"size":0,"startRow":0,"endRow":0,"total":3,"pages":1,"list":[{"gameCode":"dsdjz","activityCode":"test","activityVersion":"20180521","userId":"1","lotteryType":1,"prizeCode":"0005","prizeType":"V","prizeName":"第四组大礼包测上限","prizeContent":"test20180725005-02","isWin":1,"notWinReason":"UNKNOWN","userIp":"10.12.29.41","id":325},{"gameCode":"dsdjz","activityCode":"test","activityVersion":"20180521","userId":"1","lotteryType":1,"prizeCode":"0005","prizeType":"V","prizeName":"第四组大礼包测上限","prizeContent":"test20180725005-01","isWin":1,"notWinReason":"UNKNOWN","userIp":"10.12.28.36","id":326},{"gameCode":"dsdjz","activityCode":"test","activityVersion":"20180521","userId":"1","lotteryType":1,"prizeCode":"01","prizeType":"R","prizeName":"鼠标垫","prizeContent":"一组五种奖","isWin":1,"notWinReason":"UNKNOWN","userIp":"10.12.28.36","id":416}],"prePage":0,"nextPage":0,"isFirstPage":true,"isLastPage":true,"hasPreviousPage":false,"hasNextPage":false,"navigatePages":0,"navigateFirstPage":0,"navigateLastPage":0,"lastPage":0,"firstPage":0}}, function (err, res) {
//             console.log(res.data.pageSize);
//         }, done);
//     })
// })

describe("登陆模块", function () {
    it("发送验证码", function (done) {
        func.get("http://test-activity.changyou.com/changyou/xtl/3vsGame/sendCode", {"phone": "18804622892"}, {
                        // "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJKT0lOX1VTRVIiOiIxIn0.vBuCOGW3hYy5nFDDise4JKi6Ol1flrl_bY9oGj9Tx8I_5b5tvZo3YeLgr6zpIXmf1AwE0_Lb64cNLKae_9wiRw",
                        "APP": "xtl",
                        "ACTIVITY": "3VsGame",
                        "VERSIONCODE": "20180926",
                        // "JOIN_LOGIN":"0FD56D71D315E1392DA5DD64606ED42FDF3326A47BC8286CEBEAC9690CF8BC4737BAFB59A726A0BF068B5607618F7AA8B5302D7E4A574068D3D3F8F14D192A55229079EE551620CFEB7EA32C6807AA2EC945D0C32D07583274308FE16B44095499B664985884507B52A4E7C86151105867528CC3AC71CD1FA86F14485F302671E19FA85A21F22428AA0FFC1BE061ADE20803B56798E07E8CC1CD2189BD91503B"
                    },"发送验证码测试get", {}, function (err, res) {
            console.log(res.body)
        }, done)
    });
    // it("检查用户是否合格", function (done) {
    //     func.get("http://test-activity.changyou.com/changyou/xtl/3vsGame/queryUserByPhone", {"phone": "18804622892", "codeNum": ""}, {},"检查用户是否合格",{}, function(err, res) {
    //         console.log(res)
    //     }, done)
    // })
})
