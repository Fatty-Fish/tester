import React, { Component } from 'react';
import {saveAs}  from "file-saver";
import '../css/App.css';
import Tool from "../containers/tool.container";
import List from "../containers/list.container";
import Nav from "./Nav"
import Case from "../containers/case.container";
import WillSave from "./WillSave"
import IfSure from "./IfSure";
import ShareForm from "../containers/shareform.container"
import axios from "axios";
import pureRender from "pure-render-decorator";
import Immutable from 'seamless-immutable';
import sureChangeTool from "./sureChangeTool"
// import {storeCaseList} from "../actions";
// case模板对象
const CASE_TEMP = function () {
    this.bodyList =  [{key: "", value: ""}];
    this.disableList = {
        header:[],
        body: [],
        param:[]
    };
    this.headersList = [{key: "", value: ""}];
    this.method = "GET";
    this.paramList = [{key:"", value: ""}];
    this.result = "";
    this.showTable = "Headers";
    this.show = "panel";
    this.url = "";
};
// 匹配人名
const REG = /^[A-Za-z0-9\u2E80-\u9FFF]+$/;
@pureRender
class App extends Component {
  constructor (props) {
    super(props);
      // const {storeCaseList, caseList} = this.props;
    this.state = {
      caseList: Immutable({...props.caseList}),//props.store, // 原始json对象{info, item}
      caseStore: {}, // 抽离后存储为 casename：casecontent，匹配本组件的对象 {name:{}}
      activeCase: [], // 被点击排布在case里的case
      activeIndex: 0, // 被点击block显示在case里的对象,
        sureFlag: -1, // 有， 显示在activeCase中的index，
        saveFlag: -1,
        ...props.common
    };
      this.addCase = this.addCase.bind(this);
      this.delFn = this.delFn.bind(this);
      this.renameFn = this.renameFn.bind(this);
      this.acCaseFn = this.acCaseFn.bind(this);
      this.exportStateFn = this.exportStateFn.bind(this);
      this.addState = this.addState.bind(this);
      // 提取Casejs 到APPjs中监听
      this.changeMethod = this.changeMethod.bind(this);
      this.changeUrl = this.changeUrl.bind(this);
      this.changeShowTable=  this.changeShowTable.bind(this);
      this.changeAble = this.changeAble.bind(this);
      this.delCaseLine = this.delCaseLine.bind(this);
      this.changeContent = this.changeContent.bind(this);

      // 更改结构后修改的函数
      this.findCase = this.findCase.bind(this);
      this.changeAcName = this.changeAcName.bind(this);
      this.deleteFn = this.deleteFn.bind(this);
      this.renameDirFn = this.renameDirFn.bind(this);
      this.findDirName = this.findDirName.bind(this);
      this.delDirFn = this.delDirFn.bind(this);
      this.deleteDirFn = this.deleteDirFn.bind(this);
      this.changeFarm = this.changeFarm.bind(this);
      this.refresh = this.refresh.bind(this);
      this.storeChange = this.storeChange.bind(this);
      this.whetherSave = this.whetherSave.bind(this);
      this.findName = this.findName.bind(this);
      this.changeActiveCase = this.changeActiveCase.bind(this);
      this.exportCaseFileFn = this.exportCaseFileFn.bind(this);
      this.exportDirFn = this.exportDirFn.bind(this);
      this.findExportDir = this.findExportDir.bind(this);
      this.findShare = this.findShare.bind(this);
      this.findshareFile = this.findshareFile.bind(this);
      this.addFile = this.addFile.bind(this);
      this.loseFn = this.loseFn.bind(this);
      this.cancelFn = this.cancelFn.bind(this);
      this.saveFn = this.saveFn.bind(this);
      this.saveAs = this.saveAs.bind(this);
      this.saveAsFn = this.saveAsFn.bind(this);
      this.cancelSave = this.cancelSave.bind(this);
      this.caseSave = this.caseSave.bind(this);
      this.receiveShare = this.receiveShare.bind(this);
      this.sharechange = this.sharechange.bind(this);
      this.importCase = this.importCase.bind(this);
      this.importCaseFn = this.importCaseFn.bind(this);
      this.TestChange = this.TestChange.bind(this);
      this.PreChange = this.PreChange.bind(this);
      this.taskRunnerChange = this.taskRunnerChange.bind(this);
      this.changeShow = this.changeShow.bind(this);
      this.changeResult = this.changeResult.bind(this);
      this.changeSelfVar = this.changeSelfVar.bind(this);
      this.saveAsRoot = this.saveAsRoot.bind(this);
      this.caseStoreFn = this.caseStoreFn.bind(this);
      this.changeAuth = this.changeAuth.bind(this);
      this.changeHelp = this.changeHelp.bind(this);
  }

    taskRunnerChange (runner) {
        // this.props.task_runner = runner;
        // dispatch
      // this.setState({
      //     caseList: caseList
      // });
        sureChangeTool("", runner, this.props.per);
    }
    PreChange (text, k) {
      this.changeHelp(k, text, "preText");
      // var preText = this.state.preText || {};
      // preText[k] = text;
      // this.setState({
      //     preText: preText
      // })
    }
    TestChange (text, k) {
        this.changeHelp(k, text, "testText");
        // var testText = this.state.testText || {};
        // testText[k] = text;
        // this.setState({
        //     testText: testText
        // })
    }
    caseSave(acName) {
      // acName  newCase/0
      //   console.log("caseSave")
      var acArr = this.state.activeCase;
      var index = acArr.indexOf(acName);
        this.setState({
            saveFlag: index, // 在activeCase中的位置
            caseFlag: true
        })
    }
    loseFn() {
      var index = this.state.sureFlag;
      // 改变caseStore 在caseStore中的位置 activeCase中找
        var name = this.state.activeCase[index];
        // var caseIndex = name.split("/")[1];
        var caseStore = Immutable.asMutable(this.state.caseStore, {deep:true});
        delete caseStore.newCase[name];
        caseStore.newCase.length -= 1;
        this.changeActiveCase(index, "newCase");
        this.setState({
          sureFlag: -1,
          caseStore: Immutable(caseStore)
      });
    }
    cancelFn () {
      this.setState({
          sureFlag: -1,
      })
    }
    saveFn() {
      var index = this.state.sureFlag;
      // var name = this.state.activeCase[index].split("/")[0];
      this.setState({
          sureFlag: -1,
          saveFlag: index,
          // requestName: name
      })
    }
    cancelSave () {
      this.setState({
          saveFlag: -1
      })
    }
    saveAsRoot (from, name, saveflag) {
      // console.log(from, name)
        if (!from) {
            var caseList = this.props.caseList;
            var caseStore = Immutable.asMutable(this.state.caseStore, {deep: true});
            var data = caseStore.newCase[this.state.activeCase[this.state.activeIndex]];
            var chData = this.stateFarm(data);
            var testScript = data.testText ? data.testText : "";
            var textScript = data.preText ? data.preText : "";
            var obj = {
                name: name,
                request: {
                    method: chData.method,
                    header: chData.headList,
                    body: {
                        mode: "raw",
                        raw: chData.bodyList
                    },
                    url: {
                        raw: chData.url
                    }
                },
                response: [],
                event: [{
                    "listen": "prerequest",
                    "script": {
                        "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                        "exec": [textScript],
                        "type": "text/javascript"
                    }
                },
                    {
                        "listen": "test",
                        "script": {
                            "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                            "exec": [testScript],
                            "type": "text/javascript"
                        }
                    }]
            };
            caseList[name] = {
                "info": {
                    "_postman_id": "1cc76b57-abb3-44b6-870f-0504e56d56f0",
                    "name": name,
                    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                },
                "item": [obj]
            };
            this.changeActiveCase(this.state.saveFlag);
            this.setState({
                saveFlag: -1
            });
            // caseStore
            this.refresh(caseList);
            // dispatch
            this.props.newCaseList(caseList);
            var dataList = this.fixCaseList(caseList);
            sureChangeTool(dataList, false, this.props.per);
        }
    }
    saveAsFn (item, arr, name, obj, from) {
      var len = item.length;
      var alen = arr.length;
        if (alen >1) {
            for (var i = 0; i< len; i++) {
                if (item[i].name === arr[alen - 1]) {
                    arr.splice(alen - 1, 1);
                    item[i].item = this.saveAsFn(item[i].item, arr, name, obj, from);
                    return item
                }
            }
        }else if (alen === 1) {
            for (i = 0; i < len; i++) {
                if (item[i].name === arr[0]) {
                    var ilen = item[i].item.length;
                    for (var j = 0; j < ilen; j++) {
                        if (item[i].item[j].name === name) {
                            var sure = window.confirm(name + "已经存在，替换？");
                            if (sure) {
                                item[i].item[j] = obj;
                                return item
                            }else {
                                return
                            }
                        }
                    }
                    item[i].item.push(obj);
                    return item;
                }
            }
        }
    }
    saveAs (str, from, name) {
      // newCase 的保存方法： nav中删除  或者  直接保存
      var activeCase = this.state.activeCase;
      var source = activeCase[this.state.saveFlag];
      var sourceArr = source.split("/");
      var slen = sourceArr.length;
      var obj = this.exportCaseFileFn(sourceArr[slen - 1], source, name);

        // str 找到位置放入
        var arr = str.split("/");
        arr.splice(0, 1);
        var len = arr.length;
        var caseList = this.props.caseList;
        if (len === 1 && arr[0] === from) {
            // 根
            var ilen = caseList[from].item.length;
            for (var i = 0; i < ilen; i++) {
                if (caseList[from].item[i].name === name) {
                    var sure = window.confirm(name + "已经存在， 替换？");
                    if (sure) {
                        caseList[from].item[i] = obj.item[0];
                        // console.log(obj.item[0])
                        if (!this.state.caseFlag) {
                            // nav 的删除操作
                            this.changeActiveCase(this.state.saveFlag, from);
                        }else {
                            // case的直接保存
                            activeCase = Immutable.asMutable(this.state.activeCase, {deep: true});
                            activeCase[this.state.saveFlag] = from + "/" + name;
                            this.setState({
                                activeCase: Immutable(activeCase),
                                activeIndex: this.state.saveFlag
                            })
                        }
                        this.setState({
                            saveFlag: -1
                        });
                        // caseStore
                        this.refresh(caseList);
                        var dataList = this.fixCaseList(caseList);
                        this.props.newCaseList(caseList);
                        sureChangeTool(dataList, false, this.props.per);
                        return;
                    }else {
                        return;
                    }
                }
            }
            caseList[from].item.push(obj.item[0]);
            if (!this.state.caseFlag) {
                this.changeActiveCase(this.state.saveFlag, from);
            }else {
                // case的直接保存
                activeCase = Immutable.asMutable(this.state.activeCase, {deep:true});
                activeCase[this.state.saveFlag] = from + "/" + name;
                this.setState({
                    activeCase: Immutable(activeCase),
                    activeIndex: this.state.saveFlag
                })
            }
            this.setState({
                saveFlag: -1
            });
            // caseStore
            this.refresh(caseList);
            dataList = this.fixCaseList(caseList);
            this.props.newCaseList(caseList)
            sureChangeTool(dataList, false, this.props.per);
        }else {
            // 保存sub文件夹下
            var sarr = arr.splice(len - 1, 1);
            var newItem = this.saveAsFn(caseList[sarr[0]].item, arr, name, obj.item[0], from);
            if (newItem) {
                caseList[sarr[0]].item = newItem;
                if(!this.state.caseFlag) {
                    this.changeActiveCase(this.state.saveFlag, from);
                }else {
                    // case的直接保存
                    activeCase = Immutable.asMutable(this.state.activeCase, {deep: true});
                    activeCase[this.state.saveFlag] = from + "/" + name;
                    this.setState({
                        activeCase: Immutable(activeCase),
                        activeIndex: this.state.saveFlag
                    })
                }
                this.setState({
                    saveFlag: -1
                });
                // caseStore
                this.refresh(caseList);
                dataList = this.fixCaseList(caseList);
                this.props.newCaseList(caseList);
                sureChangeTool(dataList, false, this.props.per);
            }
        }
        // 更改state成功
    }
    addCase (obj) {
        // 导入文件：
        var caseList = this.props.caseList;
        var name = obj.info.name;
        if (caseList.hasOwnProperty(name)) {
            var replace = window.confirm(name + "文件已经存在，替换？");
            if (replace) {
                // 替换
                newObj = {};
                this.storeChange(obj, newObj);
                caseStore = this.state.caseStore;
                caseList[name] = obj;
                caseStore[name] = newObj;
                var dataList = this.fixCaseList(caseList);
                sureChangeTool(dataList, false, this.props.per);
                this.setState({
                    // caseList: caseList,
                    caseStore :Immutable(caseStore)
                })
            }else {
                // 不替换，保存到别处

            }
        }else {
            // 不存在， 新加
            var newObj = {};
            this.storeChange(obj, newObj);
            var caseStore = this.state.caseStore;
            caseList[name] = obj;
            caseStore[name] = newObj;
            dataList = this.fixCaseList(caseList);
            sureChangeTool(dataList, false, this.props.per);
            this.setState({
                // caseList: caseList,
                caseStore :Immutable(caseStore)
            })
        }
    }
    addFile() {
        var acLen = this.state.activeCase.length;
        var newActiveCase = Immutable.asMutable(this.state.activeCase, {deep:true});
        var newCaseStore = Immutable.asMutable(this.state.caseStore, {deep: true});
        if (!newCaseStore["newCase"]) {
            newCaseStore["newCase"] = {};
            newCaseStore["newCase"]["newCase/0"] = new CASE_TEMP();
            newCaseStore["newCase"].length = 1;
            newActiveCase.push("newCase/0");
        }else {
            var len = Array.prototype.slice.call(newCaseStore["newCase"]).length;
            newCaseStore["newCase"]["newCase/" + len] = new CASE_TEMP();
            newCaseStore["newCase"].length = len + 1;
            newActiveCase.push("newCase/" + len);
        }
        this.setState({
            activeCase: Immutable(newActiveCase),
            activeIndex: acLen,
            caseStore: Immutable(newCaseStore)
        })
    }
    changeFarm (obj, name, from, path) {
            if (obj.info) {
                var fromArr = from.split("/");
                fromArr.shift();
                this.changeFarm(obj.item, name, from, fromArr.join("/"));
            }else if(!obj.item && !obj.info){
                obj.map((ele, index)=> {
                    if(ele.item) {
                        if (ele.name === path.split("/")[0]) {
                            var newpath = path.split("/");
                            newpath.shift();
                            this.changeFarm(ele.item, name, from, newpath.join("/"));
                        }else {
                            this.changeFarm(ele.item, name, from, "/");
                        }
                    }else if (ele.request) {
                        // console.log(from)
                        if (name !== "/") {
                            var store = this.state.caseStore[name];
                            var trueNamearr = from.split("/");
                            var trueName = trueNamearr[trueNamearr.length - 1];
                            if (ele.name === trueName && ele.name === path) {
                                ele.request.body = {
                                    formdata: store[from].bodyList
                                };
                            }
                            var body = ele.request.body.formdata;
                            if (body) {
                                ele.request.body.formdata = body.filter((ele, index) => {
                                    return ele.key && ele.value;
                                })
                            }
                            if (ele.name === trueName && ele.name === path) {
                                ele.request.header = store[from].headersList;
                                ele.request.valSelect = store[from].valSelect || 0;
                            }
                            var header = ele.request.header;
                            if (header) {
                                ele.request.header = header.filter((ele, index) => {
                                    return ele.key && ele.value;
                                })
                            }
                            if (ele.name === trueName && ele.name === path) {
                                ele.request.method = store[from].method;
                            }
                            if (ele.name === trueName && ele.name === path) {
                                ele.request.url.query = store[from].paramList;
                            }
                            var query = ele.request.url.query;
                            if (query) {
                                ele.request.url.query = query.filter((ele, index) => {
                                    return ele.key && ele.value;
                                })
                            }
                            // console.log(ele);
                            ele.event = [{
                                "listen": "prerequest",
                                "script": {
                                    "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                    "exec": ele.event ? ele.event[0].script.exec : [],
                                    "type": "text/javascript"
                                }
                            }, {
                                "listen": "test",
                                "script": {
                                    "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                    "exec": ele.event ? ele.event[1].script.exec : [],
                                    "type": "text/javascript"
                                }
                            }];
                            if (ele.name === trueName && ele.name === path) {
                                var preTexts = store[from].preText;
                                if (preTexts) {
                                    var arrPre = preTexts.split(";");
                                    var alen = arrPre.length;
                                    if (arrPre[alen - 1] === ";") {
                                        arrPre.pop();
                                    }
                                    alen = arrPre.length;
                                    arrPre = arrPre.map((ele, index) => {
                                        if (index === alen - 1) {
                                            return ele = ele
                                        }
                                        return ele = ele + ";"
                                    });
                                    ele.event[0].script.exec = arrPre;
                                }
                                var testTexts = store[from].testText;
                                if (testTexts) {
                                    var testPre = testTexts.split(";");
                                    alen = testPre.length;
                                    if (testPre[alen - 1] === ";") {
                                        testPre.pop();
                                    }
                                    alen = testPre.length;
                                    testPre = testPre.map((ele, index) => {
                                        if (index === alen - 1) {
                                            return ele = ele
                                        }
                                        return ele = ele + ";"
                                    });
                                    ele.event[1].script.exec = testPre;
                                }
                            }
                            if (ele.name === trueName && ele.name === path) {
                                ele.request.url.raw = store[from].url;
                                ele.request.url.raw.replace("{{url}}", "http://test-activity.changyou.com");
                            }
                        }
                    }
                })
            }
            // return obj;
        }
    whetherSave (name, from) {
            var tochangeArr = name.split("/");
            var tochangeName = tochangeArr[tochangeArr.length - 1];
            var forsure = window.confirm("是否保存对" + tochangeName + "的更改?");
            if(forsure) {
                var casefromList = this.props.caseList;
                // console.log(this.props.caseList)   mutable
                this.changeFarm(casefromList[from], from, name);
                // 拿到完整的json
                var dataList = this.fixCaseList(casefromList);
                sureChangeTool(dataList, false, this.props.per);
            }
        }
    changeActiveCase (index, from) {
      console.log("changeActiveCase")
            var acIndex = this.state.activeIndex; //[]
            var len = this.state.activeCase.length;
            var activeCase = Immutable.asMutable(this.state.activeCase, {deep: true});
            if (len === 1) { // case只有一个
                // console.log("case只有一个");
                this.setState({
                    activeCase: [],
                    activeIndex: 0
                })
            }else {
                if (index === acIndex) {// 删除是activeIndex
                    // console.log("删除是activeIndex");
                    var k;
                    if(acIndex === 0) {
                        k = index;
                    }else {
                        k = index -1;
                    }
                    activeCase.splice(index, 1);
                    this.setState({
                        activeCase: Immutable(activeCase),
                        activeIndex: k
                    });
                }else {
                    // 删除activeIndex后面
                    if (index > acIndex) {
                        // console.log("删除activeIndex后面");
                        activeCase.splice(index, 1);
                        this.setState({
                            activeCase: Immutable(activeCase),
                        });
                    }else if (index < acIndex) {// 删除activeIndex前面
                        // console.log("删除activeIndex前面");
                        activeCase.splice(index, 1);
                        this.setState({
                            activeCase: Immutable(activeCase),
                            activeIndex: acIndex - 1,
                        });
                    }
                }
            }
        }
        // 在nav中删除，询问是否保存
    delFn (index, from) {
      //询问是否保存更改
        var fromArr = from.split("/");
        var auth = fromArr[fromArr.length -1];
        var per = fromArr[0];
        var name = this.state.activeCase[index];
        var nameFrom = name.split("/");
        if (auth === "r") {
            // console.log(this.state.activeCase);
            this.changeActiveCase(index, from);
        }else if (auth === "w") {
            var path = fromArr.slice(0, fromArr.length - 1);
            var forsure = window.confirm("是否保存对" + path.join("/") + "的更改?");
            if(forsure) {
               var stateobj = this.stateFarm(this.state.caseStore[per][from]);
               if (this.state.preText[from]) {
                   var preArr = this.state.preText[from].split(";");
                   var alen = preArr.length;
                   if (preArr[alen - 1] === ";") {
                       preArr.pop();
                   }
                   alen = preArr.length;
                   preArr = preArr.map((ele, index)=> {
                       if (index === alen - 1) {
                           return ele
                       }
                       return ele + ";"
                   });
               }
                if (this.state.testText[from]) {
                    var testArr = this.state.testText[from].split(";");
                    alen = testArr.length;
                    if (testArr[alen - 1] === ";") {
                        testArr.pop();
                    }
                    alen = testArr.length;
                    testArr = testArr.map((ele, index)=> {
                        if (index === alen -1) {
                            return ele
                        }
                        return ele + ";"
                    });
                }
                sureChangeTool(stateobj, false, per, auth, from, preArr, testArr);
            }
            this.changeActiveCase(index, from);
        }else if (nameFrom[0] === "newCase" && from === "newCase") {
            // newCase
            this.setState({
                sureFlag: index
            })
        }else {
            // var trueName = name.split("/")[1];
            this.whetherSave(name, from);
            // 改变显示
            this.changeActiveCase(index, name);
        }
    }
    findName(arr, from) {
      arr.forEach((ele)=> {
          if(ele.item) {
              this.findName(ele.item);
          }else if(ele.request) {
              var acCase = this.state.activeCase;
              acCase.forEach((ele, index)=> {
                  if (ele.indexOf(from)=== 0) {
                      this.changeActiveCase(index, from);
                  }
              });
          }
      })
    }
    // 文件夹辅助删除
    deleteDirFn (arr, name, from) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i].name === name) {
                // 改变active
                this.findName(arr[i].item, from);
                // arr.splice(i, 1);
                arr[i] = {}
            }else if (arr[i].item) {
                arr[i].item = this.deleteDirFn(arr[i].item, name, from)
            }
        }
        return arr;
    }
    // 删除文件夹
    delDirFn (name, from) {
        var forsure = window.confirm("是否真的删除" + name + "文件夹？");
        if(forsure) {
            var caseList = this.props.caseList;
            var fromArr = from.split("/");
            // console.log(fromArr)// haiaaaa
            var caselist;
            for (var prop in caseList) {
                if (prop !== "shared" && prop !== "share" && prop !== "variable" && prop !== "task_runner") {
                    if (prop === fromArr[0]) {
                        caselist = caseList[prop];
                        var activelist = this.state.activeCase;
                        // var activeindex = this.state.activeIndex;
                        if (caselist.info.name === name) {
                            //删除顶层文件夹
                            delete caseList[fromArr[0]];
                            activelist = activelist.filter((ele, index)=> {
                                var arr = ele.split("/")[0];
                                // console.log(arr, from)
                                return arr !== from
                            });
                            // console.log(activelist)
                            // console.log(this.state.activeCase)
                            var caseStore = this.caseStoreFn(caseList);
                            this.setState({
                                activeCase: Immutable(activelist),
                                activeIndex: 0,
                                // caseList: caseList,
                                caseStore: Immutable(caseStore)
                            });
                        } else {
                            caseList[prop].item = this.deleteDirFn(caselist.item, name, from);
                            caseStore = this.caseStoreFn(caseList);
                            // 更新activeCase
                            var acLen = activelist.length;
                            for (var i = 0; i < acLen; i++) {
                                if (activelist[i].indexOf(from) === 0) {
                                    this.changeActiveCase(i);
                                }
                            }
                            this.refresh(caseList)
                        }
                        this.props.newCaseList(caseList);
                        var dataList = this.fixCaseList(caseList);
                        sureChangeTool(dataList, false, this.props.per);
                        break
                    }
                }
            }
        }
    }
    // 删除文件
    deleteFn (name, from) {
        // 会删除原始数据
        var forsure = window.confirm("是否删除" + name + "文件?");
        if(forsure) {
            //  name, from   quan, tl线上/库/quan
            var fromArr = from.split("/");
            var trFrom = fromArr[0];
            fromArr.shift();
            this.findCase(name, "delete", "", this.props.caseList[trFrom].item, fromArr.join("/"));
            var newCaseList = this.props.caseList;
            var newList = Immutable.asMutable(this.state.caseStore, {deep: true});
            var activeCase = this.state.activeCase;
            var index = activeCase.indexOf(from);
            delete newList[trFrom][from];
            //
            if (index >= 0) {
                this.changeActiveCase(index, from);
            }
            var dataList = this.fixCaseList(newCaseList);
            // dispatch
            this.props.newCaseList(newCaseList);
            sureChangeTool(dataList, false, this.props.per);
            this.setState({
                caseStore: Immutable(newList),
            })
        }
    }
    renameCase (arr, oldName, newName, from) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          if(arr[i].name === oldName && arr[i].name === from) {
              var newArr = arr[i].event ? {
                  name: newName,
                  event: [...arr[i].event],
                  request: {
                      ...arr[i].request
                  },
                  response: []
              } : {
                  name: newName,
                  event: [{
                      "listen": "prerequest",
                      "script": {
                          "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                          "exec": [],
                          "type": "text/javascript"
                      }
                  },
                      {
                          "listen": "test",
                          "script": {
                              "id": "e405ca8a-268d-4d13-b7bd-70c7571f7828",
                              "exec": [],
                              "type": "text/javascript"
                          }
                      }],
                  request: {
                      ...arr[i].request
                  },
                  response: []
              };
              arr[i] = newArr;
              break;
          }else if(arr[i].item) {
              var fromArr = from.split("/");
              fromArr.shift();
              this.renameCase(arr[i].item, oldName, newName, fromArr.join("/"));
          }
      }
      return arr
    }
    renameFn (name, newName, from) {
      // console.log(name, newName, from)   quasnssssaaaszz quas s nssssaaaszz tl线上/库/quasnssssaaaszz
        var fromArr = from.split("/");
        fromArr[fromArr.length - 1] = newName;
        var newNameStr = fromArr.join("/");
        // caseStore -- {from:
        // 占位
        this.changeFarm(this.props.caseList[fromArr[0]], "/", from);
        var caseList = this.props.caseList[fromArr[0]];
        fromArr = from.split("/");
        var fromName = fromArr.shift();
        var newCaseItem = this.renameCase(caseList.item, name, newName, fromArr.join("/"));
        var newCaseList = {
            info: {
                ...caseList.info
            },
            item: newCaseItem
        };
        var caselist = this.props.caseList;
        caselist[fromName] = newCaseList;
        var dataList = this.fixCaseList(caselist);
        sureChangeTool(dataList, false, this.props.per, false, false, this.state.preText, this.state.testText);
        // activeCase 也被更改
        var activeCase = Immutable.asMutable(this.state.activeCase, {deep: true});
        var acIndex = this.state.activeIndex;
        activeCase[acIndex] = newNameStr;
        this.refresh(caselist);
        this.props.newCaseList(caselist);
        this.setState({
            activeCase: Immutable(activeCase)
        })
    }
    findDirName (old, now, arr, from) {
      var fromArr = from.split("/");
      var fromlen = fromArr.length;
      if (fromlen > 3) {
          var len = arr.length;
          for (var i = 0; i < len; i++) {
              if (arr[i].name === fromArr[1]) {
                  fromArr.shift();
                  arr[i].item = this.findDirName(old, now, arr[i].item, fromArr.join("/"));
              }
          }
      }else if (fromlen === 3) {
          len = arr.length;
          for (i = 0; i < len; i++) {
              if (arr[i].name === fromArr[1]) {
                  arr[i].name = now;
              }
          }
      }
      return arr
    }
    renameDirFn(name, newName, from) {
      var fromArr = from.split("/");
      var arr = this.props.caseList[fromArr[0]];
        var arrList = this.props.caseList;
        var newArr;
        if (arr.info.name === name) {
          arr.info.name = newName;
          newArr = {
              info: {
                  ...arr.info
              },
              item: arr.item
          };
        // delete arrList[fromArr[0]];

        // arrList[name] = newArr;
            arrList[fromArr[0]] = newArr;

        }else {
          var newarr = this.findDirName(name, newName, arr.item, from + "/" + name);
          newArr = {
              info: {
                  ...arr.info
              },
              item: newarr
          };
          arrList[fromArr[0]] = newArr;
      }
        var dataList = this.fixCaseList(arrList);
        sureChangeTool(dataList, false, this.props.per);
        this.refresh(arrList);
        this.props.newCaseList(arrList)
    }
    acCaseFn (index) {
        this.setState({
            activeIndex: index
        });
    }
    stateFarm (obj) {
        // 先排除disable
        var disBody = obj.disableList.body;
        var body = obj.bodyList;
        var header = obj.headersList;
        var param = obj.paramList;
        if(disBody.length) {
            body = body.filter((ele, index)=> {
                return disBody.indexOf(index) < 0
            });
        }
        var disHeader = obj.disableList.header;
        if(disHeader.length) {
            header = header.filter((ele, index)=> {
                return disHeader.indexOf(index) < 0
            });
        }
        var disParam = obj.disableList.param;
        if (disParam.length) {
            param = param.filter((ele, index)=> {
                return disParam.indexOf(index) < 0
            });
        }
        //再排除空
        var bodyList = body.filter((ele)=> {
            return ele.key && ele.value;
        });
        var headersList = header.filter((ele)=> {
            return ele.key && ele.value;
        });
        var paramList = param.filter((ele)=> {
            return ele.key && ele.value;
        });
        return {
            method: obj.method,
            url: obj.url,
            valSelect: obj.valSelect || 0,
            headList: headersList,
            bodyList: bodyList,
            paramList: paramList // 不用
        }
    }
    exportCaseFileFn (name, from, changedName) {
      // console.log(from);
      // console.log(this.state.preText[from]) // str
        var preTexts = this.state.caseStore["newCase"][from].preText;
        if (preTexts) {
            var arrPre = preTexts.split(";");
            var alen = arrPre.length;
            if (arrPre[alen - 1] === ";") {
                arrPre.pop();
            }
            alen = arrPre.length;
            arrPre = arrPre.map((ele, index)=> {
                if (index === alen - 1) {
                    return ele
                }
                ele = ele + ";";
                return ele
            });
        }
        var testTexts = this.state.caseStore["newCase"][from].testText;
        if (testTexts) {
            var testPre = testTexts.split(";");
            alen = testPre.length;
            if (testPre[alen - 1] === ";") {
                testPre.pop();
            }
            alen = testPre.length;
            testPre = testPre.map((ele, index)=> {
                if (index === alen -1) {
                    return ele
                }
                ele = ele + ";";
                return ele
            });
        }
      var fromArr = from.split("/");
        var rawState = this.state.caseStore[fromArr[0]][from] || {};
        // console.log(rawState); 保存newCase发生rawState===undefined
        var fileName = changedName || name;
        var upstate = this.stateFarm(rawState);
        var url = upstate.url || "";
        var raw,host,path;
        if (url) {
            // 匹配raw
            raw = url.split("//")[1];
            // 匹配host
            var reg = /([^/:]+)/igm;
            host = url.match(reg)[1];
            // 匹配 路径
            reg = /(\w+):\/\/([^/:]+)?([^# ]*)/;
            path = url.match(reg)[3];
            //没有参数后缀
            if (url.indexOf("?") === -1) {
                path = path.split("/");
                path.shift();
            }else {
                // 如果有参数后缀
                var queryArr = path.split("?")[1].split("&");
                var query = [];
                for (var i = 0; i< queryArr.length; i++) {
                    var queryItem = queryArr[i].split("=");
                    var queryTemp = {
                        "key": queryItem[0],
                        "value": queryItem[1]
                    };
                    query.push(queryTemp);
                }
                path = path.split("?")[0].split("/");
                path.shift();
            }
        }else {
            raw = "";
            host = "";
            path = [];
        }
        return  {
            "info": {
                "_postman_id": "",
                "name": fileName,
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            "name": fileName,
            "item": [
                {
                    "name": fileName,
                    "request": {
                        "method": upstate.method,
                        "header": upstate.headList,
                        "body": {
                            "mode": "formdata",
                            "formdata": upstate.bodyList
                        },
                        "url": {
                            "raw": raw,
                            "host": [
                                host
                            ],
                            "path": path,
                            "query": upstate.paramList.length ? upstate.paramList : query
                        }
                    },
                    "event": [{
                                "listen": "prerequest",
                                "script": {
                                    "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                    "exec": arrPre ? arrPre : [],
                                    "type": "text/javascript"
                                }
                            }, {
                            "listen": "test",
                            "script": {
                                "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                "exec": testPre? testPre : [],
                                "type": "text/javascript"
                            }
                        }],
                    "response": []
                }
            ]
        };
    }
    exportDirFn (dirname, from) {
        var obj;
        var fromArr = from.split("/");
      if (dirname === fromArr[0]) {
          // 导出整个caseList
          obj = this.props.caseList[dirname];
      }else {
          var caselist = this.props.caseList[fromArr[0]];
          obj = this.findExportDir(dirname, caselist.item)
      }
      var blob = new Blob([JSON.stringify(obj, null, 4)]);
      saveAs(blob, dirname + ".json");
    }
    findExportDir (name, arr) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          if (arr[i].name === name) {
              return {
                  "info": {
                      "_postman_id": "1cc76b57-abb3-44b6-870f-0504e56d56f0",
                      "name": name,
                      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                  },
                  "item": arr[i].item
              };
          }else if (arr[i].item) {
              this.findExportDir(name, arr[i].item);
          }
      }
    }
    exportStateFn(name, from) {
        var ParmObj = this.exportCaseFileFn(name, from);
        // 导出
        var blob = new Blob([JSON.stringify(ParmObj, null, 4)]);
        saveAs(blob, name + ".json");
    }
    addState(newState,name) {
        var len = this.state.activeCase.length;
        var newCaseList = this.state.activeCase;
        var newcaseStore = this.state.caseStore;
        if(newCaseList.indexOf(name) === -1) {
            newCaseList.push(name);
            newcaseStore.push(newState);
            this.setState({
                activeIndex: len,
                activeCase: Immutable(newCaseList),
                caseStore: Immutable(newcaseStore),
            });
        }else {
            var sure = window.confirm(name + " 已经存在，替换？");
            if(sure) {
                var index = newCaseList.indexOf(name);
                newcaseStore[index] = newState;
                this.setState({
                    activeIndex: index,
                    activeCase: Immutable(newCaseList),
                    caseStore: Immutable(newcaseStore),
                });
            }
        }
    }
    // 文件辅助删除findCase
    findCase (name,changeCase, value, arr, from) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          if (arr[i].name === name) {
              //  arr[i].request[changeCase] = value;
              if(changeCase === "url") {
                arr[i].request.url.raw = value;
              }else if (changeCase === "bodyList") {
                  arr[i].request.body.formdata = value;
              }else if (changeCase === "paramList") {
                  arr[i].request.url.query = value;
              }else if (changeCase === "headersList") {
                   arr[i].request.header = value;
              }else if (changeCase === "method") {
                  arr[i].request.method = value;
              }else if (changeCase === "delete") {
                  if (from === arr[i].name) {
                      arr[i] = {};
                  }else if(arr[i].item) {
                      fromArr = from.split("/");
                      fromArr.shift();
                      this.findCase(name, changeCase, value, arr[i].item, fromArr.join("/"));
                  }
              }
              break;
          }else if (arr[i].item) {
              var fromArr = from.split("/");
              fromArr.shift();
              var newArr = this.findCase(name, changeCase, value, arr[i].item, fromArr.join("/"));
              arr[i].item = newArr;
          }
      }
        return arr
    }
    changeHelp (k, value, tar, val, reVal) {
        var name = k.split("/")[0];
        var store = Immutable.asMutable(this.state.caseStore, {deep: true});
        var newList = store[name];
        newList[k][tar] = value;
        if (val) {
            newList[k][val] = reVal;
        }
        store[name] = newList;
        this.setState({
            caseStore: Immutable(store)
        })
    }
    changeMethod(k, value) {
      this.changeHelp(k, value, "method")
    }
    changeSelfVar (k, index) {
      this.changeHelp(k, index, "valSelect")
    }
    changeUrl(k, value) {
      this.changeHelp(k, value, "url");
    }
    changeShowTable(k, value) {
      this.changeHelp(k, value, "showTable");
    }
    changeResult (k, val) {
      this.changeHelp(k, val, "result");
    }
    changeShow (k, value) {
      this.changeHelp(k, value, "show");

    }
    changeAble(k, value) {
      // 更改able不会更改原始数组
        this.changeHelp(k, value, "disableList");
    }
    delCaseLine(k, type, list, disable) {
      this.changeHelp(k, list, type, "disableList", disable);

    }
    changeContent(k, type, value) {
      this.changeHelp(k, value, type);

    }
    changeAcName(name, from) {
        var caseStore = this.caseStoreFn(this.props.caseList);
      var newActiveCase = this.state.activeCase;
      var acSet = new Set(newActiveCase);
      // 增加case ，case会再次请求
      if (acSet.has(from)) {
          var index = newActiveCase.indexOf(from);
          this.setState({
              activeIndex: index,
              caseStore: Immutable(caseStore),
          })
      }else {
          acSet.add(from);
          var newActive = [...acSet];
          var newActiveIndex = newActive.length - 1;
          this.setState({
              activeCase: Immutable(newActive),
              activeIndex: newActiveIndex,
              caseStore: Immutable(caseStore),
          })
      }
    }
    storeChange (obj, newObj, prop) {
        if (obj.info) {
            // this.storeChange(obj.item, newObj, obj.info.name);
            this.storeChange(obj.item, newObj, prop);
        }else if (JSON.stringify(obj) !== "{}") {
            obj.map((ele)=> {
                if(ele.item) {
                    this.storeChange(ele.item, newObj, prop + "/" +ele.name);
                }else if (ele.request) {
                        var mode = ele.request.body.mode;
                        var body;
                        if (mode) {
                            body = ele.request.body[mode];
                        }else {
                            body = ele.request.body.formdata;
                        }
                        var header = ele.request.header;
                        var query = ele.request.url.query;
                        var path = ele.request.url.path;
                        var url = ele.request.url.raw;
                        ele.event = [{
                            "listen": "prerequest",
                            "script": {
                                "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                "exec": ele.event ? ele.event[0].script.exec : [],
                                "type": "text/javascript"
                            }
                        }, {
                            "listen": "test",
                            "script": {
                                "id": "53310d38-5289-4cde-8c1a-8cf317c7239a",
                                "exec": ele.event ? ele.event[1].script.exec : [],
                                "type": "text/javascript"
                            }
                        }];
                        // 增加pre test
                        // var testText = this.state.testText || {};
                        // testText[prop + "/" + ele.name] = ele.event[1].script.exec.join("") || "";
                        // var preText = this.state.preText || {};
                        // preText[prop + "/" + ele.name] = ele.event[0].script.exec.join("") || "";
                        // 导致多次渲染：
                        // this.setState({
                        //     testText: testText,
                        //     preText:preText
                        // });
                    // 增加变量


                        url = url.replace("{{url}}", "http://test-activity.changyou.com");
                        newObj[prop + "/" + ele.name] = {
                            bodyList : body || [],
                            disableList : {
                                header:[],
                                body: [],
                                param:[]
                            },
                            headersList : header || [],
                            method : ele.request.method,
                            paramList : query || [],
                            result : "",
                            showTable : "Headers",
                            show: "panel",
                            url : url,
                            valSelect: ele.request.valSelect || 0,
                            testText: ele.event[1].script.exec.join("") || "",
                            preText: ele.event[0].script.exec.join("") || ""
                        }
                }
            })
        }
    }
    // 辅助函数
    findshareFile (arr, path) {
        // arr => [],   path => 库/9-k
        var patharr = path.split("/");
        var arrlen = arr.length;
        var pathlen = patharr.length;
        for (var i = 0; i < arrlen; i++) {
            if (arr[i].name === patharr[0]) {
                if (pathlen === 1) {
                    return arr[i]
                }else {
                    return this.findshareFile(arr[i].item, path.replace(patharr[0] + "/", ""));
                }
            }
        }
    }
    findShare(arr, path) {
      var sitearr = path.split("/");
      var len = sitearr.length;
      if (arr[sitearr[len-1]]) {
          return {
              name: arr[sitearr[len-1]],
              item: arr[sitearr[len-1]].item
          }
      }else {
          return this.findshareFile(arr[sitearr[0]].item, path.replace(sitearr[0] + "/", ""))
      }
    }
    receiveShare (shareState, auth, per, path) {
        var body = shareState.request.body.formdata;
        var header = shareState.request.header;
        var query = shareState.request.url.query;
        var routes = shareState.request.url.path;
        var url = shareState.request.url.raw;
        url = url.replace("{{url}}", "http://test-activity.changyou.com");
        if (routes) {
            var pathStr = routes.join("/");
            url = url +"/" +pathStr;
        }
        if (query) {
            var queryStr ="?";
            for (var i = 0; i < query.length; i++) {
                var str = "";
                if (i === 0) {
                    str = query[i].key + "=" + query[i].value;
                }else {
                    str = "&" + query[i].key + "=" + query[i].value;
                }
                queryStr += str;
            }
            url = url + queryStr;
        }
        var newObj = {
            bodyList : body || [],
            disableList : {
                header:[],
                body: [],
                param:[]
            },
            headersList : header || [],
            method : shareState.request.method,
            paramList : query || [],
            result : "",
            showTable : "Headers",
            show: "panel",
            url : url,
            auth: auth
        };
        // 存入storeCase
        var caseObj = this.state.caseStore;
        if (caseObj.hasOwnProperty(per)) {
            caseObj[per][per + "/" + path + "/" + auth] = newObj
        }else {
            caseObj[per] = {};
            caseObj[per][per + "/" + path + "/" + auth] = newObj
        }
        this.changeAcName(per, per + "/" + path + "/" + auth);
        this.setState({
            caseStore: Immutable(caseObj)
        })
    }
    sharechange (caseList, shareTo) {
        // this.setState({
        //     caseList: caseList
        // });
        sureChangeTool(caseList, false, this.props.per);
    }
    changeAuth(val,checked) {
      // console.log(val, checked);
      //   console.log(this.state);
      //   this.props.changeAuth(val, checked);
      var auth = this.state.auth;
      var pathArr = this.state.pathArr;
      // var showFlag = this.props.showPeople;
        // var caseList = this.props.caseList;
        var share = this.props.share;
        var shareLen = share.length;
        var eyePerson,
            editPerson;
      if (checked) {
          // 分享
          //  "item":[{"r":[]},{"w":[]}] 自己
          for (var i = 0; i < shareLen; i++) {
              if (share[i].name === val) {
                  if (auth === "eye") {
                      var eyeAuth = share[i].item[0].r;
                      eyeAuth = [...new Set(eyeAuth.concat(pathArr))];
                      eyePerson = eyeAuth;
                      editPerson = share[i].item[1].w;
                      share[i].item[0] = {"r": eyeAuth};
                  }else {
                      // edit
                      var editAuth = share[i].item[1].w;
                      editAuth = [...new Set(editAuth.concat(pathArr))];
                      editPerson = editAuth;
                      eyePerson = share[i].item[0].r;
                      share[i].item[1] = {"w": editAuth};
                  }
              }
          }
      }else {
          // 取消分享
          // console.log(checked)
          for (i = 0; i < shareLen; i++) {
              if (share[i].name === val) {
                  if (auth === "eye") {
                      eyeAuth = share[i].item[0].r;
                      var nowAuth = eyeAuth.filter((ele, index)=> {
                          return pathArr.indexOf(ele) == -1
                      });
                      eyePerson = nowAuth;
                      editPerson = share[i].item[1].w;
                      share[i].item[0] = {"r": nowAuth};
                  }else {
                      // edit
                      editAuth = share[i].item[1].w;
                      nowAuth = editAuth.filter((ele, index)=> {
                          return pathArr.indexOf(ele) == -1
                      });
                      editPerson = nowAuth;
                      eyePerson = share[i].item[0].r;
                      share[i].item[1] = {"w": nowAuth};
                  }
              }
          }
      }
      // this.sharechange(caseList, val);
        // 改变shareTo的shared
        // axios({
        //     method: "post",
        //     url: "/sureShare",
        //     data: {
        //         host: this.props.per,
        //         r: eyePerson || [],
        //         w: editPerson || [],
        //         shareTo: val
        //     },
        //     contentType:"application/json",
        // }).then ((res)=> {
        //     return true
        // });
        // // 改变自己的share
    }
    caseStoreFn(arr) {
        var newObj = {};
        // 选出收到的分享
        var shared = this.props.shared;
        for (var i = 0; i< shared.length; i++) {
            newObj[shared[i].name] = this.state.caseStore[shared[i].name] || {}
        }
        // 别人分享过来的
            // var Arr = arr[prop];
            // var len = Arr.length;
            // for (var i = 0; i < len; i++) {
            //     var a = Arr[i].path.split("/");
            //     axios({
            //         method:"get",
            //         url: "/new",
            //         params: {
            //             person: a[0]
            //         },
            //         contentType:"application/json",
            //     }).then((res)=> {
            //         var path = Arr[i].path.replace(a[0] +"/", "");
            //         var shareitem = this.findShare(res.data, path);
            //         console.log(shareitem)
            // shareObj[a[0]] = {
            //     "info": {
            //         "_postman_id": "1cc76b57-abb3-44b6-870f-0504e56d56f0",
            //         "name": a[0],
            //         "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            //     },
            //     "item": shareitem
            // }
            // });
        //for 循环，重复 storeChange
        // console.log(arr)
        for(var prop in arr) {
            var obj = {};
            // storeChange里，设置了state
            // console.log(prop)
            if (prop !== "variable" && prop !== "shared" && prop !== "share" && prop !== "task_runner") {
                this.storeChange(arr[prop], obj, prop);
                // newObj[arr[prop].info.name] = obj
                newObj[prop] = obj;
            }
        }
        var newCase = this.state.caseStore.newCase || {};
      return {
          newCase: newCase,
          ...newObj
      };
    }
    refresh (arr) {
      var caseStore = this.caseStoreFn(arr);
      this.setState({
            caseStore: Immutable(caseStore),
        })
    }
    importCaseFn (item, arr, obj) {
      arr.shift();
      var len = item.length;
      for (var i = 0; i < len; i++) {
          if (item[i].name === arr[0]) {
              if (arr.length === 1) {
                  item[i].item = item[i].item.concat(obj);
              }else if (item[i].item) {
                  item[i].item = this.importCaseFn(item[i].item, arr, obj)
              }
              return item;
          }
      }
    }
    importCase (obj, from) {
        var caseList = this.props.caseList;
        if (!from) {
            var len = obj.length;
            for (var i = 0; i < len; i ++) {
                var name = obj[i].info.name;
                caseList[name] = obj[i];
            }
        }else {
            // 保存到根：
            var fromArr = from.split("/");

            if (fromArr.length === 1) {
                caseList[fromArr[0]].item = caseList[fromArr[0]].item.concat(obj);
            }else {
                caseList[fromArr[0]].item = this.importCaseFn(caseList[fromArr[0]].item, fromArr, obj);
            }
        }
        // 也更新caseStore
        this.refresh(caseList);
        this.props.importDirFn(caseList);

        var dataList = this.fixCaseList(caseList);
        // 改变store
        // 改变后台数据
        sureChangeTool(dataList, false, this.props.per);
    }
    fixCaseList (arr) {
      return {
          ...arr,
          variable: [...this.props.variable],
          shared: [...this.props.shared],
          share: [...this.props.share],
          task_runner: {
              ...this.props.task_runner
          }
      }
    }
    componentWillMount() {
        this.refresh(this.props.caseList);
    }

    render() {
        var taskPathArr = [];
        var caseStore = this.state.caseStore;
        for (var prop in caseStore) {
            if (prop !== "newCase") {
                for (var pro in caseStore[prop]) {
                    var join = this.props.caseList[prop].info.name;
                    pro = pro.replace(prop, join);
                    taskPathArr.push(this.props.per + "/" + pro) // 不同人
                }
            }
        }
        var sharedArr = this.props.shared;
        if (sharedArr) {
            sharedArr.map((ele, index)=> {
                ele.item.forEach((el, index)=> {
                    taskPathArr.push(ele.name + "/" + el.path)
                })
            });
        }
        if (!this.props.IPAddress) {
            return (<h3>nothing here...</h3>)
        } else {
                var acIndex = this.state.activeIndex;
                var caseListRender = this.state.activeCase.map((ele, index) => {
                var arr = ele.split("/");
                var prop = arr[0]; // newCase
                    var casedata = this.state.caseStore[prop][ele];
                    var caseRender = Immutable.asMutable(casedata, {deep: true});
                    return acIndex === index ? (
                    <Case changeSelfVar={this.changeSelfVar} mochaFlag={this.state.mochaFlag} changeResult={this.changeResult} TestChange={this.TestChange} changeShow={this.changeShow} PreChange={this.PreChange} stateFarm={this.stateFarm} caseSave={this.caseSave} savechange={this.whetherSave} changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={caseRender} key={index} k = {ele} caseName={ele} style={true}>
                    </Case>) : (<Case changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={this.state.caseStore[prop][ele]} key={index} k = {ele} caseName={ele}>
                </Case>)
            });
            return (
                <div className="App">
                    <div className="cover">
                        <div className="userid">{this.props.IPAddress}</div>
                        <Tool IPAddress={this.props.IPAddress} per={this.props.per} taskRunnerChange={this.taskRunnerChange} taskPathArr={taskPathArr} importCase={this.importCase} sharechange={this.sharechange} person={this.state.person} caseList={this.props.caseList} addState = {this.addCase}></Tool>
                        {this.props.shares.showPeople ? <ShareForm changeAuth={this.changeAuth} pathArr={this.state.pathArr} auth={this.state.auth}></ShareForm> : ""}

                        <Nav activeCase = {this.state.activeIndex} acCaseFn = {this.acCaseFn} addFn = {this.addFile} delFn = {this.delFn} caseList={this.state.activeCase}></Nav>
                        {this.state.saveFlag >= 0 ? (<WillSave saveflag={this.state.saveFlag} saveAsRoot={this.saveAsRoot} cancelSave={this.cancelSave} saveAs={this.saveAs} caseList={this.props.caseList}></WillSave>) : ""}
                        {this.state.sureFlag >= 0 ? (<IfSure saveFn={this.saveFn} cancelFn={this.cancelFn} loseFn={this.loseFn}></IfSure>) : ""}
                        <List per={this.props.per} receiveShare={this.receiveShare} exportDirFn={this.exportDirFn} refresh={this.refresh} delDirFn={this.delDirFn} renameDirFn={this.renameDirFn} deleteFn={this.deleteFn} renameFn={this.renameFn} exportStateFn={this.exportStateFn} acName={this.changeAcName} caseList={this.props.caseList}></List>
                        {caseListRender}
                    </div>
                </div>
            );
        }
    }
    }

export default App;
