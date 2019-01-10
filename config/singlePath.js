const fs = require('fs');
const findPath = require('./findState');
const mkdirs = require("./mkdirs");
const axios = require("axios");

const replaceReg = require("./replaceReg");
const clearArr = require("./clearArr");
function singlePath (cont, varContent) {
    // var npath = path.replace(person +"/", "");
    // var cont = findPath(npath.split("/"), data);
    // var perState = JSON.parse(data);
    // var variable = perState.variable;
    // var select = cont.request.valSelect || 0; // 新加的属性，说明选中哪一个环境变量 需要保存后才有
    // var glo;
    // for(var i = 0; i < variable.length; i++) {
    //     if (variable[i].name === "Global") {
    //         glo = i;
    //         break;
    //     }
    // }
    // var thisList = variable[select];
    // var len = thisList.length;
    // var varContent = [
    //     ...variable[glo].values,
    //     ...variable[select].values
    // ];
    // var testScript = cont.event[1].script.exec.join("");
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
    //     .then((res)=> {
    //     var nowDate = new Date();
    //     var year = nowDate.getFullYear();
    //     var month = (nowDate.getMonth()) < 9 ? ("" + nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
    //     var day = nowDate.getDate() < 10 ? ("0" + nowDate.getDate()) : nowDate.getDate();
    //     var hours = nowDate.getHours() < 10 ? ("0" + nowDate.getHours()) : nowDate.getHours();
    //     var minutes = nowDate.getMinutes() < 10 ? ("0" + nowDate.getMinutes()) : nowDate.getMinutes();
    //     var dateStr = year + month + day + hours + minutes;
    //     var StrTemplate = `<!DOCTYPE html><html><head><title>${path}</title>
    //                 <link href=https://cdn.bootcss.com/mocha/5.2.0/mocha.min.css rel=stylesheet>
    //                 </head>
    //                 <body>
    //                 <div id=mocha></div>
    //                 <div class="time" style="margin-left: 50px;">测试时间： ${dateStr}</div>
    //                 <script src=https://cdn.bootcss.com/axios/0.18.0/axios.min.js></script>
    //                 <script src=https://cdn.bootcss.com/mocha/5.2.0/mocha.min.js></script>
    //                 <script src=https://cdn.bootcss.com/chai/4.2.0/chai.min.js></script>
    //                 <script>mocha.setup('bdd')</script>
    //                         <!-- load code you want to test here -->
    //                 <script>
    //                     var varContent = ${JSON.stringify(varContent)};
    //                     var testScript = ${JSON.stringify(testScript)};
    //                     var pm = {
    //                         varList:  () => {
    //                             return ${JSON.stringify(variable)} // 当前的所有环境变量集合
    //                         },
    //                         thisList:  ()=> {
    //                             return ${JSON.stringify(thisList.values)}
    //                         },
    //                         len:  ()=> {
    //                             return ${JSON.stringify(len)}
    //                         },
    //                         globalList: ()=> {
    //                             var varList = pm.varList();
    //                             var gindex = ${JSON.stringify(glo)};
    //                             return varList[gindex].values
    //                         },
    //                         glen: () => {
    //                             var gList = pm.globalList();
    //                             return gList.length
    //                         },
    //                         environment: {
    //                             get:  (var_key)=> {
    //                                 var thisList = pm.thisList();
    //                                 var len = pm.len();
    //                                 for (var i = 0; i < len; i++) {
    //                                     if (thisList[i].key === var_key) {
    //                                         return thisList[i].value;
    //                                     }
    //                                 }
    //                             },
    //                             set:  (var_key, var_val) => {
    //                                 var thisList = pm.thisList();
    //                                 var varList = pm.varList();
    //                                 thisList.push({key: var_key, value: var_val, enable: true});
    //                                 varList[select].values = thisList;
    //                             },
    //                             unset: (var_key) => {
    //                                 var thisList = pm.thisList();
    //                                 var varList = pm.varList();
    //                                 var len = pm.len();
    //                                 for (var i = 0; i < len; i++) {
    //                                     if (thisList[i].key === var_key) {
    //                                         thisList.splice(i, 1);
    //                                     }
    //                                 }
    //                                 varList[select].values = thisList;
    //                             }
    //                         },
    //                         globals: {
    //                             get: (var_key) => {
    //                                 var len = pm.glen();
    //                                 var gList = pm.globalList();
    //                                 for (var i = 0; i < len; i++) {
    //                                     if (gList[i].key === var_key) {
    //                                         return gList[i].value
    //                                     }
    //                                 }
    //                             },
    //                             set: (var_key, var_val) => {
    //                                 var gList = pm.globalList();
    //                                 var varList = pm.varList();
    //                                 gList.push({key: var_key, value: var_val, enable: true});
    //                                 varList[${JSON.stringify(glo)}].values = gList;
    //                             },
    //                             unset: (var_key)=> {
    //                                 var gList = pm.thisList();
    //                                 var varList = pm.varList();
    //                                 var len = pm.glen();
    //                                 for (var i = 0; i < len; i++) {
    //                                     if (gList[i].key === var_key) {
    //                                         gList.splice(i, 1);
    //                                     }
    //                                 }
    //                                 varList[${JSON.stringify(glo)}].values = gList;
    //                             }
    //                         },
    //                         variables: {
    //                             get: (var_key)=> {
    //                                 // 当前环境变量和全局变量的集合
    //                                 var len = varContent.length;
    //                                 for (var i = 0; i < len; i++) {
    //                                     if (varContent[i].key === var_key) {
    //                                         return varContent[i].value
    //                                     }
    //                                 }
    //                             }
    //                         },
    //                         response: {
    //                             json: ()=> {
    //                                 return ${JSON.stringify(res.data)}
    //                             }
    //                         },
    //                         assert: chai.assert
    //                     };
    //
    //                     var a = eval(testScript);
    //                     console.log(a)
    //                 </script>
    //                         <!-- load your test files here -->
    //
    //                 <script>mocha.run();</script></body></html>`;
    //     // 写为文件
    //     var forePath = path.split("/");
    //     forePath.splice(forePath.length - 1, 1);
    //     // var dirPath = forePath.join("/");
    //     fs.access("test_task/" + path + ".html", fs.constants.F_OK, (err) => {
    //         if (err) {
    //             // 不存在，写入
    //             mkdirs("test_task", path + dateStr + ".html", StrTemplate, ress);
    //         }else {
    //             // 文件存在 覆盖
    //             fs.writeFile("test_task/" + path + dateStr + ".html", StrTemplate, "utf8", (err)=> {
    //                 if (err) throw err;
    //                 ress.setHeader('Content-Type', 'text/html; charset=UTF-8');
    //                 ress.sendFile (BASE_URL+ "test_task/" + path + dateStr + ".html")
    //             });
    //         }
    //     });
    //
    // }).catch((err)=> {
    //     ress.send("样例请求中断了，无法测试")
    // })


}

module.exports = singlePath;