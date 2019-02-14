function findState (data, arr, caseState,  pre, test) {
    if (arr.length > 1) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].name === arr[0]) {
                arr.splice(0, 1);
                data[i].item = findState(data[i].item, arr, caseState)
            }
        }
    }else {
        // arr.length == 1
        for (i = 0; i < data.length; i++) {
            if (data[i].name === arr[0]) {
                data[i].request = caseState;
                data[i].event = [
                    {
                        "listen": "prerequest",
                        "script": {
                            "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                            "exec": pre,
                            "type": "text/javascript"
                        }
                    },
                    {
                        "listen": "test",
                        "script": {
                            "id": "e405ca8a-268d-4d13-b7bd-70c7571f7828",
                            "exec": test,
                            "type": "text/javascript"
                        }
                    }
                ];
                data[i].response = [];
            }
        }
    }
    return data
}
function caseFn (caseState) {
    var raw, host, routes, url = caseState.url;
    if(url) {
        // 匹配raw
        // raw = url.split("//")[1];
        raw = url
        // 匹配host
        var reg = /([^/:]+)/igm;
        host = url.match(reg)[1];
        // 匹配 路径
        reg = /(\w+):\/\/([^/:]+)?([^# ]*)/;
        routes = url.match(reg)[3];
        //没有参数后缀
        if (url.indexOf("?") === -1) {
            routes = routes.split("/");
            routes.shift();
        }else {
            // 如果有参数后缀
            var queryArr = routes.split("?")[1].split("&");
            var query = [];
            for (var i = 0; i< queryArr.length; i++) {
                var queryItem = queryArr[i].split("=");
                var queryTemp = {
                    "key": queryItem[0],
                    "value": queryItem[1]
                };
                query.push(queryTemp);
            }
            routes = routes.split("?")[0].split("/");
            routes.shift();
        }
    }else {
        raw = "";
        host = "";
        routes = [];
    }
    var obj = {
        method: caseState.method,
        header: caseState.headList,
        body: {
            formdata: caseState.bodyList
        },
        url: {
            raw: raw,
            host: host,
            path: routes,
            query: caseState.paramList
        }
    };
    return obj;
}

function addState (data, person, path, caseState, pre, test) {
    var arr = path.split("/");
    var obj = JSON.parse(data);
    var variable = obj.variable;
    var state = arr[1];
    var newArr = arr.slice(2, arr.length - 1);
    var caseobj = caseFn(caseState);
    obj[state].item = findState(obj[state].item, newArr, caseobj,  caseState.preText, caseState.testText);
    obj = {
        ...obj,
        variable: [
            ...variable
        ]
    };
    return obj;
}
module.exports = addState;
// exports.addState = addState;