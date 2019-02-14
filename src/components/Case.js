import React, { Component } from 'react';
import $ from "jquery";
import  VarSet from "./VarSet";
import axios from "axios";
import mocha from "mocha"
import chai from 'chai';
import Immutable from "seamless-immutable";
import pureRender from 'pure-render-decorator';
import sureChangeTool from "./sureChangeTool"
import "mocha/mocha.css"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/Case.css"
//延伸jQuery

(function($){
    $.fn.extend({
        "insert":function(value){
            //默认参数
            value=$.extend({
                "text":"123"
            },value);

            var dthis = $(this)[0]; //将jQuery对象转换为DOM元素

            //IE下
            if(document.selection){

                $(dthis).focus();        //输入元素textara获取焦点
                var fus = document.selection.createRange();//获取光标位置
                fus.text = value.text;    //在光标位置插入值
                $(dthis).trigger("focus");    ///输入元素textara获取焦点
            }
            //火狐下标准
            else if(dthis.selectionStart || dthis.selectionStart == '0'){

                var start = dthis.selectionStart;
                var end = dthis.selectionEnd;
                var top = dthis.scrollTop;

                //以下这句，应该是在焦点之前，和焦点之后的位置，中间插入我们传入的值
                dthis.value = dthis.value.substring(0, start) + value.text + dthis.value.substring(end, dthis.value.length);
                $(dthis).trigger("focus"); //输入元素textara获取焦点
                dthis.selectionEnd = end + value.text.length - 2;
            }

            //在输入元素textara没有定位光标的情况
            else{
                this.value += value.text;
                this.trigger("focus");

            }
            return $(this);
        }
    })
})($);
@pureRender
class Case extends Component {
    constructor(props) {
        super(props);
        var mutableCaseRender = this.props.caseRender;
        var plen = mutableCaseRender.paramList.length - 1;
        var hlen = mutableCaseRender.headersList.length - 1;
        var blen = mutableCaseRender.bodyList.length - 1;
        if(JSON.stringify(mutableCaseRender.paramList[plen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.paramList.push({key: "", value: ""})
        }
        if(JSON.stringify(mutableCaseRender.headersList[hlen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.headersList.push({key: "", value: ""})
        }
        if(JSON.stringify(mutableCaseRender.bodyList[blen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.bodyList.push({key: "", value: ""})
        }
        this.state = {
            ...Immutable(mutableCaseRender)
        };
        this.submitProxy = this.submitProxy.bind(this);
        this.changeMethod = this.changeMethod.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.jumpToHeaders = this.jumpToHeaders.bind(this);
        this.jumpToBody = this.jumpToBody.bind(this);
        this.jumpToParam = this.jumpToParam.bind(this);
        this.jumpToPreScript = this.jumpToPreScript.bind(this);
        this.jumpToTestScript = this.jumpToTestScript.bind(this);
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
        this.changeVarSelect = this.changeVarSelect.bind(this);
        this.replaceReg = this.replaceReg.bind(this);
        this.textAreaChange = this.textAreaChange.bind(this);
        this.textAreaTestChange = this.textAreaTestChange.bind(this);
        this.insertText = this.insertText.bind(this);
        this.insertTestText = this.insertTestText.bind(this);
        this.jumpToPanel = this.jumpToPanel.bind(this);
        this.jumpToTest = this.jumpToTest.bind(this);
        this.jumpHelp = this.jumpHelp.bind(this);
        this.addLineFn = this.addLineFn.bind(this);
    };
    jumpToTest (e) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        this.setState({
            show: "test"
        })
    }
    jumpToPanel (e) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        this.setState({
            show: "panel"
        })
    }
    changeVarSelect (e) {
        var selectName = $(e.target).val();
        var varList = this.state.varList;
        var len = varList.length;
        var global = this.state.global;
        for (var i = 0; i < len; i++) {
            if (varList[i].name === selectName) {
                this.props.changeSelfVar(this.props.k, i);
                this.setState({
                    valSelect: i,
                    varContent: Immutable([
                        ...varList[i].values,
                        ...varList[global].values
                    ])
                });
                break;
            }
        }

    }
    varSetHide () {
        this.setState({
            varSet: false
        })
    }
    setVariable (e) {
        e.stopPropagation();
        this.setState({
            varSet: true,
        })
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
                var obj = this.props.stateFarm(this.toDeepMutabale(this.state));
                sureChangeTool(obj, false, from, auth, this.props.k, this.state.text_val || "",this.state.textTest_val || "");
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
        });
        // disArr.forEach((ele)=> {
        //     arr.splice(ele, 1);
        // }); 会修改整个state不好
        //排空
        var newArr = Arr.filter((ele)=> {
            return ele.key && ele.value;
        });
        // 替换变量
        var varContent = this.state.varContent;
        // 找出enable
        varContent = varContent.filter((ele, index) => {
           return ele.enable || ele.enabled
        });
        var varContents = {};
        varContent.forEach((ele, index)=> {
            varContents["{{" + ele.key + "}}"] =  ele.value
        });
        // 不希望{{}}被改变
        newArr.forEach((ele, index)=> {
            if (varContents.hasOwnProperty(ele.value)) {
                newArr[index] = {key: ele.key, value: varContents[ele.value]};
            }
        });
        var obj = {};
        newArr.forEach((ele)=> {
            obj[ele.key] = ele.value;
        });
        return obj;
    }
    replaceReg (str,varContent, len, index) {
        if (varContent[index].enabled || varContent[index].enable) {
            var re = new RegExp("{{" + varContent[index].key + "}}", "igm");
            var tar = varContent[index].value;
            str = str.replace(re, tar);
            if (len !== 1) {
                str = this.replaceReg(str, varContent, len - 1, index + 1);
                return str;
            }else {
                return str;
            }
        }
    }
    textAreaChange (e) {
        this.setState({
            text_val: $(e.target).val()
        });
        this.props.PreChange($(e.target).val(), this.props.k);
    }
    textAreaTestChange (e) {
        this.setState({
            textTest_val: $(e.target).val()
        });
        this.props.TestChange($(e.target).val(), this.props.k);
    }
    insertText (e) {
        $(".text-area").insert({"text": $(e.target).text() + "();"})
    }
    insertTestText (e) {
        // console.log($(e.target).text())
        $(".text-areaTest").insert({"text": $(e.target).text() + "();"})
    }
    submitProxy () {
        var str = "";
        eval(str);
        // 每次提交清空mocha div
        var method = this.state.method;
        var url = this.state.url;
        // header this.state.headersList 指向同一个引用，一改都改。
        var headerlist = this.toDeepMutabale(this.state.headersList);
        var paramlist = this.toDeepMutabale(this.state.paramList);
        var bodylist = this.toDeepMutabale(this.state.bodyList);
        var head = this.clearRequest(headerlist, this.state.disableList.header);
        var param = this.clearRequest(paramlist,this.state.disableList.param);
        var body = this.clearRequest(bodylist, this.state.disableList.body);
        this.setState({
            result: "Waiting...."
        });
        var varContent = this.toDeepMutabale(this.state.varContent);
        // 修改 url
        if (url.indexOf("{{") >= 0) {
            var len = varContent.length;
            url = this.replaceReg(url,varContent, len, 0);
        }
        var pm = {
            varList:  () => {
                return this.state.varList // 当前的所有环境变量集合
            },
            thisList:  ()=> {
                var varList = pm.varList(); // 当前选中的环境变量的list
                return varList[this.state.valSelect].values
            },
            len:  ()=> {
                var thisList = pm.thisList(); // 当前选中的环境变量的list的长度
                return thisList.length
            },
            globalList: ()=> {
                var varList = pm.varList();
                var gindex = this.state.global;
                return varList[gindex].values
            },
            glen: () => {
                var gList = pm.globalList();
                return gList.length
            },
            environment: {
                get:  (var_key)=> {
                    var thisList = pm.thisList();
                    var len = pm.len();
                    for (var i = 0; i < len; i++) {
                        if (thisList[i].key === var_key) {
                            return thisList[i].value;
                        }
                    }
                },
                set:  (var_key, var_val) => {
                    var thisList = pm.thisList();
                    var varList = pm.varList();
                    thisList.push({key: var_key, value: var_val, enable: true});
                    varList[this.state.valSelect].values = thisList;
                    this.setState({
                        varList: Immutable(varList)
                    });
                },
                unset: (var_key) => {
                    var thisList = pm.thisList();
                    var varList = pm.varList();
                    var len = pm.len();
                    for (var i = 0; i < len; i++) {
                        if (thisList[i].key === var_key) {
                            thisList.splice(i, 1);
                        }
                    }
                    varList[this.state.valSelect].values = thisList;
                    this.setState({
                        varList: Immutable(varList)
                    });
                }
            },
            globals: {
                get: (var_key) => {
                    var len = pm.glen();
                    var gList = pm.globalList();
                    for (var i = 0; i < len; i++) {
                        if (gList[i].key === var_key) {
                            return gList[i].value
                        }
                    }
                },
                set: (var_key, var_val) => {
                    var gList = pm.globalList();
                    var varList = pm.varList();
                    gList.push({key: var_key, value: var_val, enable: true});
                    varList[this.state.global].values = gList;
                    this.setState({
                        varList: Immutable(varList)
                    });
                },
                unset: (var_key)=> {
                    var gList = pm.thisList();
                    var varList = pm.varList();
                    var len = pm.glen();
                    for (var i = 0; i < len; i++) {
                        if (gList[i].key === var_key) {
                            gList.splice(i, 1);
                        }
                    }
                    varList[this.state.global].values = gList;
                    this.setState({
                        varList: Immutable(varList)
                    });
                }
            },
            variables: {
                get: (var_key)=> {
                    var varContent = this.state.varContent;  // 当前环境变量和全局变量的集合
                    var len = varContent.length;
                    for (var i = 0; i < len; i++) {
                        if (varContent[i].key === var_key) {
                            return varContent[i].value
                        }
                    }
                }
            }
        };
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
            // 每次测试清空报告
            $("#mocha").html("");
            // 后置脚本
            pm.response = {
                json: ()=> {
                    return res.data
                }
            };
            pm.assert = chai.assert;
            // 没有textTest_val时，eval报错，不继续执行。
            if (this.state.textTest_val) {
                var casename = this.props.k;
                str = "mocha.setup('bdd');describe('测试报告', function() {it('" + casename + "', function() {" +  this.state.textTest_val + "})});mocha.run();";
                var Runner = eval("mocha.setup('bdd');");
                // 清除runner记录
                Runner.suite.suites = [];
                eval(str);
                // console.log(a)
            }
            // 消除无用的a标签跳转
            $(function () {
                $(".suite h1").find("a").removeAttr("href");
            });
            // 提供下载。。
            // console.log(this.state.textTest_val)
            return res.data;
        }).catch((error)=> {
            this.props.changeResult(this.props.k, JSON.stringify(error.data, null, 4))
        }).then((res)=> {
            // 希望result 在没有新请求时，被记录。
            this.props.changeResult(this.props.k, JSON.stringify(res, null, 4))
        });
        // 执行pre-script
        eval(this.state.text_val);
    }
    changeMethod (e) {
        this.props.changeMethod(this.props.k, e.target.value);
    }
    changeUrl (e) {
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
            this.props.changeContent(this.props.k, "paramList", query);
        }
        this.props.changeUrl(this.props.k, url)
    }
    jumpHelp(e, k, val) {
        e.preventDefault();
        $(e.target).parent().parent().find(".active").removeClass("active");
        $(e.target).parent().addClass("active");
        this.props.changeShowTable(k, val)
    }
    jumpToHeaders (e) {
        this.jumpHelp(e, this.props.k, "Headers")
    }
    jumpToBody (e) {
        this.jumpHelp(e, this.props.k, "Body")
    }
    jumpToParam (e) {
        this.jumpHelp(e, this.props.k, "Param")
    }
    jumpToPreScript (e) {
        this.jumpHelp(e, this.props.k, "preScriptShow")
    }
    jumpToTestScript (e) {
        this.jumpHelp(e, this.props.k, "testScriptShow")
    }
    addLineFn (type, k) {
        var tarList = this.toDeepMutabale(this.state[type]);
        tarList.push({key: "", value: ""});
        this.props.changeContent(k, type, tarList);
    }
    addLine (e) {
        var type = e.target ? $(e.target).parent().parent().attr("class") : e;
        if (type === "header") {
            this.addLineFn("headersList", this.props.k)
        }else if (type === "body") {
            this.addLineFn("bodyList", this.props.k)
        }else if (type === "param") {
            this.addLineFn("paramList", this.props.k)
        }
    }
    addHeaders (e) {
        var headersList = this.toDeepMutabale(this.state.headersList);
        headersList.push({key: "", value: ""});
        this.addLine("header");
    }
    addBody (e) {
        var bodyList = this.toDeepMutabale(this.state.bodyList);
        bodyList.push({key: "", value: ""});
        this.addLine("body");
    }
    addParam (e) {
        var paramList = this.toDeepMutabale(this.state.paramList);
        paramList.push({key: "", value: ""});
        this.addLine("param");
    }
    disableFn(e) {
        var type,
            index,
            flag;
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
            flag = "i";
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
            flag = "td";
        }
        var disableList = this.toDeepMutabale(this.state.disableList);
        if (disableList[type].indexOf(index) >= 0) { //变为able
            var num = this.state.disableList[type].indexOf(index);
            disableList[type].splice(num, 1);
            flag === "i" ? $(e.target).parent().css({color: "#fdfdfd", background: "#767676"}) : $(e.target).css({color: "#fdfdfd", background: "#767676"})
        }else {//变为disable
            disableList[type].push(index);
            flag === "i" ? $(e.target).parent().css({color: "#fff", background: "#d4d4d4"}) :  $(e.target).css({color: "#fff", background: "#d4d4d4"});
        }
            this.props.changeAble(this.props.k, disableList)
    }
    delLineFn (dis, list, index) {
        list.splice(index, 1);
        var num = dis.indexOf(index);
        if (num >=0) {
            dis.splice(num, 1);
        }
        return dis;
    }
    delLine (e) {
        var type,
            index;
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
        }
        if (type === "header") {
            var headersList = this.toDeepMutabale(this.state.headersList);
            var disHeader = this.toDeepMutabale(this.state.disableList.header);
            disHeader = this.delLineFn(disHeader, headersList, index);
            var disablelist = this.toDeepMutabale(this.state.disableList);
            disablelist.header = disHeader;
            this.props.delCaseLine(this.props.k,"headersList", headersList, disablelist);
        }else if (type === "body") {
            var BodyList = this.toDeepMutabale(this.state.bodyList);
            var disBody = this.toDeepMutabale(this.state.disableList.body);
            disBody = this.delLineFn(disBody, BodyList, index);
            disablelist = this.toDeepMutabale(this.state.disableList);
            disablelist.body = disBody;
            this.props.delCaseLine(this.props.k,"bodyList", BodyList, disablelist);
        }else if (type === "param") {
            var ParamList = this.toDeepMutabale(this.state.paramList);
            var disParam = this.toDeepMutabale(this.state.disableList.param);
            disParam = this.delLineFn(disParam, ParamList, index);
            disablelist = this.toDeepMutabale(this.state.disableList);
            disablelist.param = disParam;
            this.props.delCaseLine(this.props.k,"paramList", ParamList, disablelist);
        }
    }
    toDeepMutabale (obj) {
        return Immutable.asMutable(obj, {deep: true});
    }
    changeFn (e, name) {
        var type = $(e.target).parent().parent().attr("class");
        var index = $(e.target).parent().parent().index();
        var val = e.target.value;
        if (type === "header") {
            var headerList = this.toDeepMutabale(this.state.headersList);
            headerList[index][name] = val;
            this.props.changeContent(this.props.k, "headersList", headerList);
            // return;
        }else if (type === "body") {
            var bodyList = this.toDeepMutabale(this.state.bodyList);
            bodyList[index][name] = val;
                this.props.changeContent(this.props.k, "bodyList", bodyList);
            // return
        }else if (type === "param") {
            var paramList = this.toDeepMutabale(this.state.paramList);
            paramList[index][name] = val;
                this.props.changeContent(this.props.k, "paramList", paramList);
            // return;
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
        var varList = this.toDeepMutabale(this.state.varList);
        varList.splice(index, 1);
        this.setState({
            varList: Immutable(varList)
        });
        axios({
            url: "/changeSelfVar",
            method: "post",
            data: {
                varList: varList,
                self: this.props.per
            }
        }).then((res)=> {
            //
        })
    };
    importVar (newVar) {
        var varList = this.toDeepMutabale(this.state.varList);
        var index = this.findVarIndex(newVar.name);
        newVar.from = "self-import";
        if (index >= 0) {
            var sure = window.confirm(newVar.name + "已经存在，替换？");
            if (sure) {
                varList[index] = newVar;
                this.setState({
                    varList: Immutable(varList)
                });
                axios({
                    url: "/changeSelfVar",
                    method: "post",
                    data: {
                        varList: varList,
                        self: this.props.per
                    }
                }).then((res)=> {
                    //
                })
            }
        }else {
            varList.push(newVar);
            this.setState({
                varList: Immutable(varList)
            });
            axios({
                url: "/changeSelfVar",
                method: "post",
                data: {
                    varList: varList,
                    self: this.props.per
                }
            }).then((res)=> {
                //
            })
        }
    };
    changeVarName (varlist) {
        this.setState({
            varList: Immutable(varlist)
        });
        axios({
            url: "/changeSelfVar",
            method: "post",
            data: {
                varList: varlist,
                self: this.props.per
            }
        }).then((res)=> {
            //
        });
    };
    disableVar(newList) {
        // console.log(newList)
        // 还要改变 varContent,
        var index = this.state.valSelect;
        var global = this.state.global;
        var cont = [
            ...newList[global].values,
            ...newList[index].values
        ];
        this.setState({
            varList: Immutable(newList),
            varContent: Immutable(cont)
        });
    }
    componentWillReceiveProps(nextProps) {
        var mutableCaseRender = this.toDeepMutabale(nextProps.caseRender);
        var plen = mutableCaseRender.paramList.length - 1;
        var hlen = mutableCaseRender.headersList.length - 1;
        var blen = mutableCaseRender.bodyList.length - 1;
        if(JSON.stringify(mutableCaseRender.paramList[plen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.paramList.push({key: "", value: ""})
        }
        if(JSON.stringify(mutableCaseRender.headersList[hlen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.headersList.push({key: "", value: ""})
        }
        if(JSON.stringify(mutableCaseRender.bodyList[blen]) !== JSON.stringify({key: "", value: ""})) {
            mutableCaseRender.bodyList.push({key: "", value: ""})
        }
        this.setState({
            show: "panel",
            ...Immutable(mutableCaseRender),
            text_val: mutableCaseRender.preText,
            textTest_val: mutableCaseRender.testText
        });
    };
    componentWillMount() {
        var caseRender = this.toDeepMutabale(this.props.caseRender);
            var varSelect = this.props.valSelect;
            var variable = this.props.variable;
            var len = variable.length;
            var index;
            for (var i = 0; i < len; i ++) {
                if (variable[i].name === "Global") {
                    index = i;
                    break;
                }
            }
            this.setState({
                show: "panel",
                varList: Immutable(variable),
                valSelect: varSelect || 0,
                global: index,
                varContent: Immutable([
                    ...variable[0].values,
                    ...variable[index].values
                ]),
                text_val: caseRender.preText,
                textTest_val: caseRender.testText,
                result: caseRender.result
            });
    }

    render () {
        var text_val = this.state.text_val;
        var textTest_val = this.state.textTest_val;
        var varSelect = this.state.varList;
        if (varSelect) {
            var selectVar = varSelect[this.state.valSelect].name;
            var varOptions = varSelect.map((ele, index)=> {
                return (<option key={index} value={ele.name}>{ele.name}</option>)
            });
        }
        var seen = this.props.style;
        // console.log(this.props.caseName)
        var caseNamearr = this.props.caseName.split("/");
        var caseName =caseNamearr[caseNamearr.length - 1];
        if (Number(caseName) || (Number(caseName) == 0)) {
            caseName = "newCase"
        }else if (caseName === "r" || caseName === "w") {
            caseNamearr.splice(caseNamearr.length - 1, 1);
            caseName = caseNamearr.join("/")
        }

        var method,url,raw,disparamList,paramsList,len,paramStr,headersShow,bodyShow,paramShow,preScriptShow, testScriptShow,headerFlag,disHeader,HeadersList,
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
            // console.log(url)
             headersShow = this.props.caseRender.showTable === "Headers" ? true : false;
             bodyShow = this.props.caseRender.showTable === "Body" ? true : false;
             paramShow = this.props.caseRender.showTable === "Param" ? true : false;
             preScriptShow = this.props.caseRender.showTable === "preScriptShow" ? true : false;
             testScriptShow = this.props.caseRender.showTable === "testScriptShow" ? true : false;
             var panelShow = this.state.show === "panel" ? true : false;
             var testShow = this.state.show === "test" ? true : false;
             var color76 = {width: "100%", height: "34px", color: "#767676", lineHeight: "34px"};
             headerFlag = this.props.caseRender.headersList.length;
             disHeader = this.props.caseRender.disableList.header;
             HeadersList = this.props.caseRender.headersList.map((ele, index)=> {
                if (index === headerFlag - 1) {
                    return (<tr className="header" key={index}>
                        <td className="btn" style={color76}><i
                            className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={color76}><i
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
                        <td className="btn" style={color76}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={color76}><i className="glyphicon glyphicon-minus"></i></td>
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
                        <td className="btn" style={color76}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                                   value={ele.value}/></td>
                        <td className="btn" style={color76}><i className="glyphicon glyphicon-minus"></i></td>
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
            <div className="case" style={{display: seen ? "block" : "none"}}>
                <div className="top">
                    <div className="method">
                        <select className="form-control" value={method.toLowerCase()} onChange={this.changeMethod}>
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
                    <select value={selectVar} onChange={this.changeVarSelect} className="form-control">
                        {varOptions ? varOptions : ""}
                    </select>
                </div>
                <div className="content">
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={headersShow ? "active" : ""}><a href="#" onClick={this.jumpToHeaders}>Headers</a></li>
                        <li role="presentation" className={bodyShow　? "active" : ""}><a href="#" onClick={this.jumpToBody}>Body</a></li>
                        <li role="presentation" className={paramShow　? "active" : ""}><a href="#" onClick={this.jumpToParam}>Param</a></li>
                        <li role="presentation" className={preScriptShow　? "active" : ""}><a href="#" onClick={this.jumpToPreScript}>Pre-request Script</a></li>
                        <li role="presentation" className={testScriptShow　? "active" : ""}><a href="#" onClick={this.jumpToTestScript}>Test Script</a></li>
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

                    <div className="text" style={{display: preScriptShow ? "block" : "none"}}>
                        <textarea className="text-area form-control" placeholder="your pre-request script" rows="3" value={text_val} onChange={this.textAreaChange}>
                        </textarea>
                        <ul className="textlist" onClick={this.insertText}>
                            <li>console.log</li>
                            <li>pm.environment.get</li>
                            <li>pm.environment.set</li>
                            <li>pm.environment.unset</li>
                            <li>pm.globals.get</li>
                            <li>pm.globals.set</li>
                            <li>pm.globals.unset</li>
                            <li>pm.variables.get</li>
                        </ul>
                    </div>
                    <div className="text" style={{display: testScriptShow ? "block" : "none"}}>
                        <textarea className="text-areaTest form-control" placeholder="your test script" rows="3" value={textTest_val} onChange={this.textAreaTestChange}>
                        </textarea>
                        <ul className="textlist" onClick={this.insertTestText}>
                            <li>console.log</li>
                            <li>pm.environment.get</li>
                            <li>pm.environment.set</li>
                            <li>pm.environment.unset</li>
                            <li>pm.globals.get</li>
                            <li>pm.globals.set</li>
                            <li>pm.globals.unset</li>
                            <li>pm.variables.get</li>
                            <li>pm.response.json</li>
                        </ul>
                    </div>

                </div>
                <div className="panel panel-default">
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={panelShow ? "active" : ""}><a href="#" onClick={this.jumpToPanel}>Result Data</a></li>
                        <li role="presentation" className={testShow　? "active" : ""}><a href="#" onClick={this.jumpToTest}>Test Page</a></li>
                    </ul>
                    <div className="panel-cover" style={{display: panelShow ? "block" : "none"}}>
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
                    <div className="iframe-test" style={{display: testShow ? "block" : "none"}}>
                        <div id={seen ? "mocha" : ""}></div>
                    </div>
                </div>
                {this.state.varSet ? (<VarSet per={this.props.per} disableVar={this.disableVar} changeVarName={this.changeVarName} importVar={this.importVar} removeVar={this.removeVar} varSetHide={this.varSetHide} varList={varSelect}></VarSet>) : ""}
            </div>
        )
    }
}

export default Case;
