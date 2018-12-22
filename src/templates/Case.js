import React, { Component } from 'react';
import $ from "jquery";
import  VarSet from "./VarSet";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/Case.css"

class Case extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.caseRender
        };
        this.submitProxy = this.submitProxy.bind(this);
        this.changeMethod = this.changeMethod.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.jumpToHeaders = this.jumpToHeaders.bind(this);
        this.jumpToBody = this.jumpToBody.bind(this);
        this.jumpToParam = this.jumpToParam.bind(this);
        this.addLine = this.addLine.bind(this);
        this.addHeaders = this.addHeaders.bind(this);
        this.addBody = this.addBody.bind(this);
        this.addParam = this.addParam.bind(this);
        this.delLine = this.delLine.bind(this);
        this.disableFn = this.disableFn.bind(this);
        this.changeKey = this.changeKey.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.clearRequest = this.clearRequest.bind(this);
        this.saveChange = this.saveChange.bind(this);
        this.setVariable = this.setVariable.bind(this);
        this.varSetHide = this.varSetHide.bind(this);
        this.removeVar = this.removeVar.bind(this);
        this.importVar = this.importVar.bind(this);
        this.changeVarName = this.changeVarName.bind(this);
        this.findVarIndex = this.findVarIndex.bind(this);
        this.disableVar = this.disableVar.bind(this);
    };
    varSetHide () {
        this.setState({
            varSet: false
        })
    }
    setVariable (e) {
        e.stopPropagation();
        // axios({
        //     method: "get",
        //     url: "/new",
        //     params: {
        //         person: "person0"
        //     },
        //     contentType:"application/json",
        // }).then((res)=> {
        //     var caseList = JSON.parse(res.data);
        //     // console.log(caseList.variable)
            this.setState({
                varSet: true,
                // varList: caseList.variable
            })
        // });
    }
    saveChange () {
        var arr = this.props.k.split("/");
        var auth = this.state.auth;
        var from = arr[0];
        if (auth) {
            // r  no rights to save
            if(auth === "r") {
                alert("你没有权限保存更改")
            }else {
                // w
                var obj = this.props.stateFarm(this.state);
                axios({
                    url: "/surechange",
                    method: "post",
                    data: {
                        "newData": obj,
                        "person": from,
                        "tar": auth,
                        "path": this.props.k
                    }
                }).then((res) => {
                    //ol
                });
            }
        }else {
            if (from !== "newCase") {
                this.props.savechange(this.props.k, from);
            }else {
                // 弹出框：保存？ 保存在哪里？
                // console.log(this.props.k)
                this.props.caseSave(this.props.k)
            }
        }
    }
    clearRequest(arr, disArr) {
        //排disabled
        var Arr = arr.filter((ele, index)=> {
            return disArr.indexOf(index) < 0
        })
        // disArr.forEach((ele)=> {
        //     arr.splice(ele, 1);
        // }); 会修改整个state不好
        //排空
        var newArr = Arr.filter((ele)=> {
            return ele.key && ele.value;
        });
        var obj = {};
        newArr.forEach((ele)=> {
            obj[ele.key] = ele.value;
        })
        return obj;
    }
    submitProxy () {
        var method = this.state.method;
        var url = this.state.url;
        var headerlist = this.state.headersList;
        var paramlist = this.state.paramList;
        var bodylist = this.state.bodyList;
        var head = this.clearRequest(headerlist, this.state.disableList.header);
        var param = this.clearRequest(paramlist,this.state.disableList.param);
        var body = this.clearRequest(bodylist, this.state.disableList.body);
        this.setState({
            result: "Waiting...."
        });
        axios({
            method: "post",
            url: "/",
            contentType:"application/json",
            timeout: 3000,
            data: {
                "method": method,
                "url": url,
                "headers": head,
                "body": body,
                "param": param
            }
        }).then((res)=> {
            this.setState({
                result: JSON.stringify(res.data, null, 4)
            });
            // 提供下载。。
        }).catch((error)=> {
            this.setState({
                result: JSON.stringify(error.data, null, 4)
            });
        })
    }
    changeMethod (e) {
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        // if (from === "newCase") {
        //     this.setState({
        //         method: e.target.value
        //     });
        // }else {
            this.props.changeMethod(this.props.k, e.target.value);
        // }
    }
    changeUrl (e) {
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        var url = e.target.value;
        if (url.indexOf("?") >= 0) {
                var reg = /(\w+):\/\/([^/:]+)?([^# ]*)/;
                var path = url.match(reg)[3];
                var query = [];
                if (path.indexOf("&")) {// 如果需要增加param line
                    var paramarr = path.split("?")[1].split("&");
                    paramarr.forEach((ele)=> {
                        var param = ele.split("=");
                        if (param.length === 1) {
                            query.push({
                                "key": param[0],
                                "value": ""
                            })
                        }else {
                            query.push({
                                "key": param[0],
                                "value": param[1]
                            })
                        }
                    })
                    // query
                }else {
                    // 不需要增加line
                    var queryArr = path.split("?")[1];
                    for (var i = 0; i< queryArr.length; i++) {
                        var queryItem = queryArr[i].split("=");
                        var queryTemp = {
                            "key": queryItem[0],
                            "value": queryItem[1]
                        };
                        query.push(queryTemp);
                    }
                }
            // 保证param最后一位是空
            query.push({
                "key": "",
                "value" : ""
            });
            // if (from === "newCase") {
            //     this.setState({
            //         paramList: query
            //     });
            // }else {
                this.props.changeContent(this.props.k, "paramList", query);
            // }
        }
        // if (from === "newCase") {
        //     this.setState({
        //         url: url
        //     });
        // }else {
            this.props.changeUrl(this.props.k, url)
        // }
    }
    jumpToHeaders (e) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        // if (from === "newCase") {
        //     this.setState({
        //         showTable: "Headers"
        //     })
        // }else {
            this.props.changeShowTable(this.props.k, "Headers")
        // }
    }
    jumpToBody (e) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        // if (from === "newCase") {
        //     this.setState({
        //         showTable: "Body"
        //     })
        // }else {
            this.props.changeShowTable(this.props.k, "Body")
        // }
    }
    jumpToParam (e) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        // if (from === "newCase") {
        //     this.setState({
        //         showTable: "Param"
        //     })
        // }else {
            this.props.changeShowTable(this.props.k, "Param")
        // }
    }
    addLine (e) {
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        var type = e.target ? $(e.target).parent().parent().attr("class") : e;
        if (type === "header") {
            var headersList = this.state.headersList;
            headersList.push({key: "", value: ""});
             // if (from === "newCase") {
             //     this.setState({
             //         headersList: headersList
             //     });
             // }else {
                 this.props.changeContent(this.props.k, "headersList", headersList);
             // }
            return;
        }else if (type === "body") {
            var bodyList = this.state.bodyList;
            bodyList.push({key: "", value: ""});
             // if (from === "newCase") {
             //     this.setState({
             //         bodyList: bodyList
             //     });
             // }else {
                 this.props.changeContent(this.props.k, "bodyList", bodyList);
             // }
            return;
        }else if (type === "param") {
            var paramList = this.state.paramList;
            paramList.push({key: "", value: ""});
            // if (from === "newCase") {
            //     this.setState({
            //         paramList: paramList
            //     });
            // }else {
                this.props.changeContent(this.props.k, "paramList", paramList);
            // }
            return;
        }
    }
    addHeaders (e) {
        var headersList = this.state.headersList;
        headersList.push({key: "", value: ""});
        this.addLine("header");
    }
    addBody (e) {
        var bodyList = this.state.bodyList;
        bodyList.push({key: "", value: ""});
        // this.setState({
        //     bodyList: bodyList
        // });
        this.addLine("body");
    }
    addParam (e) {
        var paramList = this.state.paramList;
        paramList.push({key: "", value: ""});
        // this.setState({
        //     paramList: paramList
        // });
        this.addLine("param");
    }
    disableFn(e) {
        var type,
            index,
            flag;
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
            flag = "i";
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
            flag = "td";
        }
        if (this.state.disableList[type].indexOf(index) >= 0) { //变为able
            var num = this.state.disableList[type].indexOf(index);
            this.state.disableList[type].splice(num, 1);
            flag === "i" ? $(e.target).parent().css({color: "#fdfdfd", background: "#767676"}) : $(e.target).css({color: "#fdfdfd", background: "#767676"})
        }else {//变为disable
            this.state.disableList[type].push(index);
            flag === "i" ? $(e.target).parent().css({color: "#fff", background: "#d4d4d4"}) :  $(e.target).css({color: "#fff", background: "#d4d4d4"});
        }
        // type = param 需要修改url
        // if (from === "newCase") {
        //     this.setState({
        //         disableList: this.state.disableList
        //     })
        // }else {
            this.props.changeAble(this.props.k, this.state.disableList)
        // }
    }
    delLine (e) {
        var type,
            index;
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
        }
        if (type === "header") {
            var headersList = this.state.headersList;
            var disHeader = this.state.disableList.header;
            headersList.splice(index, 1);
            //如果减去的是dis的，则消除dis
            var num = disHeader.indexOf(index);
            if (num >=0) {
                disHeader.splice(num, 1);
            }
            var disablelist = this.state.disableList;
            disablelist.header = disHeader;
             // if (from === "newCase") {
             //     this.setState({
             //         headersList: headersList,
             //         disableList: disablelist
             //     });
             // }else {
                 this.props.delCaseLine(this.props.k,"headersList", headersList, disablelist);
             // }
            return;
        }else if (type === "body") {
            var BodyList = this.state.bodyList;
            var disBody = this.state.disableList.body;
            BodyList.splice(index, 1);
            num = disBody.indexOf(index);
            if(num >= 0) {
                disBody.splice(num, 1);
            }
            disablelist = this.state.disableList;
            disablelist.body = disBody;
             // if (from === "newCase") {
             //     this.setState({
             //         bodyList: BodyList,
             //         disableList: disablelist
             //     });
             // }else {
                 this.props.delCaseLine(this.props.k,"bodyList", BodyList, disablelist);
             // }
            return;
        }else if (type === "param") {
            var ParamList = this.state.paramList;
            var disParam = this.state.disableList.param;
            ParamList.splice(index, 1);
            num = disParam.indexOf(index);
            if (num >= 0) {
                disParam.splice(num, 1);
            }
            disablelist = this.state.disableList;
            disablelist.param = disParam;
            // if (from === "newCase") {
            //     this.setState({
            //         paramList: ParamList,
            //         disableList: disablelist
            //     });
            // }else {
                this.props.delCaseLine(this.props.k,"paramList", ParamList, disablelist);
            // }
            return;
        }
    }
    changeFn (e, name) {
        // var arr = this.props.k.split("/");
        // var from = arr[0];
        var type = $(e.target).parent().parent().attr("class");
        var index = $(e.target).parent().parent().index();
        var val = e.target.value;
        if (type === "header") {
            var headerList = this.state.headersList;
            headerList[index][name] = val;
             // if (from === "newCase") {
             //     this.setState({
             //         headersList: headerList
             //     });
             // }else {
                 this.props.changeContent(this.props.k, "headersList", headerList);
             // }
            return;
        }else if (type === "body") {
            var bodyList = this.state.bodyList;
            bodyList[index][name] = val;
            // if (from === "newCase") {
            //     this.setState({
            //         bodyList: bodyList
            //     });
            // }else {
                this.props.changeContent(this.props.k, "bodyList", bodyList);
            // }
            return
        }else if (type === "param") {
            var paramList = this.state.paramList;
            paramList[index][name] = val;
            // if (from === "newCase") {
            //     this.setState({
            //         paramList: paramList
            //     });
            // }else {
                this.props.changeContent(this.props.k, "paramList", paramList);
            // }
            return;
        }
    }
    changeKey (e) {
        this.changeFn(e, "key");
    }
    changeValue (e) {
        this.changeFn(e, "value");
    }
    findVarIndex(varNm) {
        var varList = this.state.varList;
        var len = varList.length;
        for (var i = 0; i < len; i++) {
            if (varList[i].name === varNm) {
                return i;
            }
        }
    }
    removeVar (index) {
        var varList = this.state.varList;
        varList.splice(index, 1);
        this.setState({
            varList: varList
        });
        axios({
            url: "/changeSelfVar",
            method: "post",
            data: {
                varList: varList,
                self: "person0"
            }
        }).then((res)=> {
            //
        })
    };
    importVar (newVar) {
        var varList = this.state.varList;
        var index = this.findVarIndex(newVar.name);
        newVar.from = "self-import";
        console.log(varList);
        console.log(newVar.name);
        if (index >= 0) {
            var sure = window.confirm(newVar.name + "已经存在，替换？");
            if (sure) {
                varList[index] = newVar;
                this.setState({
                    varList: varList
                });
                axios({
                    url: "/changeSelfVar",
                    method: "post",
                    data: {
                        varList: varList,
                        self: "person0"
                    }
                }).then((res)=> {
                    //
                })
            }
        }else {
            varList.push(newVar);
            this.setState({
                varList: varList
            });
            axios({
                url: "/changeSelfVar",
                method: "post",
                data: {
                    varList: varList,
                    self: "person0"
                }
            }).then((res)=> {
                //
            })
        }
    };
    changeVarName (varlist) {
        // var varList = this.state.varList;
        this.setState({
            varList: varlist
        });
        axios({
            url: "/changeSelfVar",
            method: "post",
            data: {
                varList: varlist,
                self: "person0"
            }
        }).then((res)=> {
            //
        });
    }
    componentDidUpdate () {
        // 把case组件里最新的state更新到父级APP组件的state里（为了保证父组件export时，是最新的method，URL，header等，且case组件能自由监听变化method，URL。。。）
        // var key = this.props.k;
        // var newState = this.state;
        // this.props.stateFn(newState, key);

        // 提取Case后不需要了
    }
    componentWillReceiveProps(nextProps) {
        var plen = nextProps.caseRender.paramList.length - 1;
        var hlen = nextProps.caseRender.headersList.length - 1;
        var blen = nextProps.caseRender.bodyList.length - 1;
        if(JSON.stringify(nextProps.caseRender.paramList[plen]) !== JSON.stringify({key: "", value: ""})) {
            nextProps.caseRender.paramList.push({key: "", value: ""})
        }
        if(JSON.stringify(nextProps.caseRender.headersList[hlen]) !== JSON.stringify({key: "", value: ""})) {
            nextProps.caseRender.headersList.push({key: "", value: ""})
        }
        if(JSON.stringify(nextProps.caseRender.bodyList[blen]) !== JSON.stringify({key: "", value: ""})) {
            nextProps.caseRender.bodyList.push({key: "", value: ""})
        }
        this.setState({
            ...nextProps.caseRender
        })
    }
    disableVar(newList) {
        this.setState({
            varList: newList
        });
    }
    componentWillMount() {
        axios({
            method: "get",
            url: "/new",
            params: {
                person: "person0"
            },
            contentType:"application/json",
        }).then((res)=> {
            var caseList = JSON.parse(res.data);
            // console.log(caseList.variable)
            this.setState({
                // varSet: true,
                varList: caseList.variable
            })
        });
    }

    render () {
        var varList = this.state.varList;
        console.log(varList);
        // var varOptions = varList.map((ele, index)=> {
        //    return (<option key={index} value={ele.name}>{ele.name}</option>)
        // });
        var seen = this.props.style;
        var caseNamearr = this.props.caseName.split("/");
        var caseName =caseNamearr[caseNamearr.length - 1];
        if (Number(caseName) || (Number(caseName) == 0)) {
            caseName = "newCase"
        }else if (caseName === "r" || caseName === "w") {
            caseNamearr.splice(caseNamearr.length - 1, 1);
            caseName = caseNamearr.join("/")
        }else {
            caseName = this.props.caseName;
        }
        var method,url,raw,disparamList,paramsList,len,paramStr,headersShow,bodyShow,paramShow,headerFlag,disHeader,HeadersList,
            bodyFlag,disBody,BodyList,paramFlag,disParam,ParamList;
             method = this.props.caseRender.method;
             url = this.props.caseRender.url;
             raw = url.split("?")[0];
            // 先排出disable
             disparamList = this.props.caseRender.disableList.param;
             paramsList = this.props.caseRender.paramList.filter((ele, index)=> {
                return disparamList.indexOf(index) < 0;
            });
            paramsList = paramsList.filter((ele)=> {
                return ele.key && ele.value
            });
             len = paramsList.length;
            if (len === 0) {
                url = raw;
            }else {
                 paramStr = "";
                paramsList.forEach((ele, index)=> {
                    if (index === 0) {
                        paramStr = "?" + ele.key + "=" + ele.value;
                    }else {
                        paramStr += "&" + ele.key + "=" + ele.value
                    }
                });
                url = raw + paramStr;
            }
             headersShow = this.props.caseRender.showTable === "Headers" ? true : false;
             bodyShow = this.props.caseRender.showTable === "Body" ? true : false;
             paramShow = this.props.caseRender.showTable === "Param" ? true : false;
             headerFlag = this.props.caseRender.headersList.length;
             disHeader = this.props.caseRender.disableList.header;
             HeadersList = this.props.caseRender.headersList.map((ele, index)=> {
                if (index === headerFlag - 1) {
                    return (<tr className="header" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i
                            className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i
                            className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    if (disHeader.indexOf(index) >= 0) {
                        return (<tr className="header" key={index}>
                            <td className="btn" style={{
                                width: "100%",
                                height: "34px",
                                color: "#fff",
                                background: "#d4d4d4",
                                lineHeight: "34px"
                            }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    } else {
                        return (<tr className="header" key={index}>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    }
                }
            });


             bodyFlag = this.props.caseRender.bodyList.length;
             disBody = this.props.caseRender.disableList.body;
             BodyList = this.props.caseRender.bodyList.map((ele, index)=> {
                if (index === bodyFlag - 1) {
                    return (<tr className="body" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    if (disBody.indexOf(index) >= 0) {
                        return (<tr className="body" key={index}>
                            <td className="btn" style={{
                                width: "100%",
                                height: "34px",
                                color: "#fff",
                                background: "#d4d4d4",
                                lineHeight: "34px"
                            }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    } else {
                        return (<tr className="body" key={index}>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    }
                }
            });
             paramFlag = this.props.caseRender.paramList.length;
             disParam = this.props.caseRender.disableList.param;
             ParamList = this.props.caseRender.paramList.map((ele, index)=> {
                if (index === paramFlag - 1) {
                    return (<tr className="param" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    if (disParam.indexOf(index) >= 0) {
                        return (<tr className="param" key={index}>
                            <td className="btn" style={{
                                width: "100%",
                                height: "34px",
                                color: "#fff",
                                background: "#d4d4d4",
                                lineHeight: "34px"
                            }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    } else {
                        return (<tr className="param" key={index}>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                            <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                       value={ele.key}/></td>
                            <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                       value={ele.value}/></td>
                            <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                                onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                        </tr>)
                    }
                }
            });
        return (
            <div className="case" style={seen}>
                <div className="top">
                    <div className="method">
                        <select className="form-control" value={method} onChange={this.changeMethod}>
                            <option value="get">GET</option>
                            <option value="post">POST</option>
                            <option value="put">PUT</option>
                            <option value="patch">PATCH</option>
                            <option value="delete">DELETE</option>
                        </select>
                    </div>
                    <div className="url">
                        <input type="text" name = "url" value={url} onChange={this.changeUrl}/>
                    </div>
                    <button className="btn submit" onClick={this.submitProxy}>提交</button>
                    <button className="btn save" onClick={this.saveChange}>保存</button>
                    <button className="btn setting" onClick={this.setVariable}><i className="glyphicon glyphicon-cog"></i></button>
                </div>
                <div className="content">
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={headersShow ? "active" : ""}><a href="#" onClick={this.jumpToHeaders}>Headers</a></li>
                        <li role="presentation" className={bodyShow　? "active" : ""}><a href="#" onClick={this.jumpToBody}>Body</a></li>
                        <li role="presentation" className={paramShow　? "active" : ""}><a href="#" onClick={this.jumpToParam}>Param</a></li>
                    </ul>
                    <table className="table table-bordered table-hover" style={{display: headersShow ? "table" : "none"}}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>key</th>
                                <th>value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="header">
                        {HeadersList}
                        </tbody>
                    </table>




                    <table className="table table-bordered table-hover" style={{display: bodyShow ? "table" : "none"}}>
                        <thead>
                        <tr>
                            <th></th>
                            <th>key</th>
                            <th>value</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="body">
                        {BodyList}
                        </tbody>
                    </table>



                    <table className="table table-bordered table-hover" style={{display: paramShow ? "table" : "none"}}>
                        <thead>
                        <tr>
                            <th></th>
                            <th>key</th>
                            <th>value</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="param">
                        {ParamList}
                        </tbody>
                    </table>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Response for {caseName}</h3>
                    </div>
                    <div className="panel-body" style={{textAlign: "justify"}}>
                        <pre>
                            <code>
                                {this.state.result ? this.state.result : "Click Send Button to Test This URL"}
                            </code>
                        </pre>
                    </div>
                </div>
                {this.state.varSet ? (<VarSet disableVar={this.disableVar} changeVarName={this.changeVarName} importVar={this.importVar} removeVar={this.removeVar} varSetHide={this.varSetHide} varList={this.state.varList}></VarSet>) : ""}
                <select className="form-control">
                    {/*{varOptions}*/}
                </select>
            </div>
        )
    }
}

export default Case;
