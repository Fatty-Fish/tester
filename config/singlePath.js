const axios = require("axios");

const replaceReg = require("./replaceReg");
const clearArr = require("./clearArr");
function singlePath (cont, varContent) {
    var method = cont.request.method;
    var url = cont.request.url.raw;
    if (url.indexOf("http") === -1) {
        // no protocal
        url = "http://" + url;
    }
    // 修改url
    if (url.indexOf("{{") >= 0) {
        len = varContent.length;
        url = replaceReg(url,varContent, len, 0);
    }
    // 修改其他arr
    var header = clearArr(varContent, cont.request.header);
    var headers = {};
    header.map((ele, index)=> {
        headers[ele.key] = ele.value;
    });
    var body = cont.request.body, bodyArr;
    if (body.mode) {
        bodyArr = clearArr(varContent, body[body.mode] || []);
    }else {
        bodyArr = clearArr(varContent, body.formdata || []);
    }
    var bodys = {};
    bodyArr.map((ele, index)=> {
        bodys[ele.key] = ele.value;
    });

    var query = clearArr(varContent, cont.request.url.query || []);
    var querys = {};
    if (query) {
        query.map((ele, index) => {
            querys[ele.key] = ele.value;
        })
    }
    return axios({
        method: method,
        url: url,
        headers: headers,
        data: bodys,
        params: querys,
    });
}

module.exports = singlePath;