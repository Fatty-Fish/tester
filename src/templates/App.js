import React, { Component } from 'react';
import {saveAs}  from "file-saver";
import $ from "jquery";
import '../css/App.css';
import Tool from "./Tool"
import List from "./List"
import Nav from "./Nav"
import Case from "./Case";
import WillSave from "./WillSave"
import IfSure from "./IfSure"

import axios from "axios";
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
    this.url = "";
};
// 匹配人名
const REG = /^[A-Za-z0-9\u2E80-\u9FFF]+$/;
class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      caseList: {},//props.store, // 原始json对象{info, item}
      caseStore: {}, // 抽离后存储为 casename：casecontent，匹配本组件的对象 {name:{}}
      activeCase: [], // 被点击排布在case里的case
      activeIndex: 0, // 被点击block显示在case里的对象,
        sureFlag: -1, // 有， 显示在activeCase中的index，
        saveFlag: -1
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
  }
    caseSave(acName) {
      // acName  newCase/0
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
        var caseStore = this.state.caseStore;
        delete caseStore.newCase[name];
        caseStore.newCase.length -= 1;
        this.changeActiveCase(index, "newCase");
        this.setState({
          sureFlag: -1,
          caseStore: caseStore
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
        var caseList = this.state.caseList;
        if (len === 1 && arr[0] === from) {
            // 根
            var ilen = caseList[from].item.length;
            for (var i = 0; i < ilen; i++) {
                if (caseList[from].item[i].name === name) {
                    var sure = window.confirm(name + "已经存在， 替换？");
                    if (sure) {
                        caseList[from].item[i] = obj.item[0];
                        if (!this.state.caseFlag) {
                            // nav 的删除操作
                            this.changeActiveCase(this.state.saveFlag, from);
                        }else {
                            // case的直接保存
                            var activeCase = this.state.activeCase;
                            activeCase[this.state.saveFlag] = from + "/" + name;
                            this.setState({
                                activeCase: activeCase,
                                activeIndex: this.state.saveFlag
                            })
                        }
                        var caseStore = this.state.caseStore;
                        delete caseStore.newCase[source[1]];
                        caseStore.newCase.length -= 1;
                        this.setState({
                            caseStore: caseStore,
                            saveFlag: -1
                        });
                        // caseStore
                        this.refresh(caseList);
                        axios({
                            url: "/surechange",
                            method: "post",
                            data: {
                                "newData": caseList,
                                "person": "person0"
                            }
                        }).then((res) => {
                            if (res) {
                                //
                            }
                        });
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
                var activeCase = this.state.activeCase;
                activeCase[this.state.saveFlag] = from + "/" + name;
                this.setState({
                    activeCase: activeCase,
                    activeIndex: this.state.saveFlag
                })
            }
            var caseStore = this.state.caseStore;
            delete caseStore.newCase[source[1]];
            caseStore.newCase.length -= 1;
            this.setState({
                caseStore: caseStore,
                saveFlag: -1
            });
            // caseStore
            this.refresh(caseList);
            axios({
                url: "/surechange",
                method: "post",
                data: {
                    "newData": caseList,
                    "person": "person0"
                }
            }).then((res) => {
                if (res) {
                    //
                }
            });
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
                    var activeCase = this.state.activeCase;
                    activeCase[this.state.saveFlag] = from + "/" + name;
                    this.setState({
                        activeCase: activeCase,
                        activeIndex: this.state.saveFlag
                    })
                }
                var caseStore = this.state.caseStore;
                delete caseStore.newCase[source[1]];
                caseStore.newCase.length -= 1;
                this.setState({
                    caseStore: caseStore,
                    saveFlag: -1
                });
                // caseStore
                this.refresh(caseList);
                axios({
                    url: "/surechange",
                    method: "post",
                    data: {
                        "newData": caseList,
                        "person": "person0"
                    }
                }).then((res) => {
                    if (res) {
                        //
                    }
                });
            }
        }
        // 更改state成功
    }
    addCase (obj) {
        // 导入文件：
        var caseList = this.state.caseList;
        var name = obj.info.name;
        if (caseList.hasOwnProperty(name)) {
            var replace = window.confirm(name + "文件已经存在，替换？");
            if (replace) {
                // 替换
                var newObj = {};
                this.storeChange(obj, newObj);
                var caseStore = this.state.caseStore;
                caseList[name] = obj;
                caseStore[name] = newObj;
                axios({
                    url: "/surechange",
                    method: "post",
                    data: {
                        "newData": caseList,
                        "person": "person0"
                    }
                }).then((res) => {
                    if (res) {
                        //
                    }
                })
                this.setState({
                    caseList: caseList,
                    caseStore :caseStore
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
            axios({
                url: "/surechange",
                method: "post",
                data: {
                    "newData": caseList,
                    "person": "person0"
                }
            }).then((res) => {
                if (res) {
                    //
                }
            })
            this.setState({
                caseList: caseList,
                caseStore :caseStore
            })
        }
    }
    addFile() {
        var acLen = this.state.activeCase.length;
        var newActiveCase = this.state.activeCase;
        var newCaseStore = this.state.caseStore;
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

        // var newCaseList = this.state.caseList;
        // newCaseList.item.push({
        //     name: "newCase",
        //     request: {
        //         body: {
        //             mode: "raw",
        //             raw: "",
        //             formdata: [{key: "", value: ""}]
        //         },
        //         header: [{key: "", value: ""}],
        //         method: "GET",
        //         url: {
        //             host: [],
        //             path: [],
        //             raw: ""
        //         }
        //     },
        //     response: []
        // });
        this.setState({
            activeCase: newActiveCase,
            activeIndex: acLen,
            caseStore: newCaseStore
        })
    }
    changeFarm (obj, name, from, path) {
      console.log(obj, from, path)
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
                            this.changeFarm(ele.item, name, from);
                        }
                    }else if (ele.request) {
                        var store = this.state.caseStore[name];
                        var trueNamearr = from.split("/");
                        var trueName = trueNamearr[trueNamearr.length - 1];
                        if(ele.name === trueName && ele.name === path) {
                            ele.request.body = {
                                formdata: store[from].bodyList
                            };
                        }
                        var body = ele.request.body.formdata;
                        if (body) {
                            ele.request.body.formdata = body.filter((ele, index)=> {
                                return ele.key && ele.value;
                            })
                        }
                        if(ele.name === trueName && ele.name === path) {
                            ele.request.header = store[from].headersList;
                        }
                        var header = ele.request.header;
                        if(header) {
                            ele.request.header = header.filter((ele, index)=> {
                                return ele.key && ele.value;
                            })
                        }
                        console.log(ele.name, trueName, path)
                        if(ele.name === trueName && ele.name === path) {
                            ele.request.method = store[from].method;
                        }
                        if(ele.name === trueName && ele.name === path) {
                            ele.request.url.query = store[from].paramList;
                        }
                        var query = ele.request.url.query;
                        if(query) {
                            ele.request.url.query = query.filter((ele, index)=> {
                                return ele.key && ele.value;
                            })
                        }
                        if (ele.name === trueName && ele.name === path) {
                            ele.request.url.raw = store[from].url;
                            ele.request.url.raw.replace("{{url}}", "http://test-activity.changyou.com");
                        }
                    }
                })
            }
        }
    whetherSave (name, from) {
            var forsure = window.confirm("是否保存对" + name + "的更改?");
            if(forsure) {
                var casefromList = this.state.caseList;
                this.changeFarm(casefromList[from], from, name);
                console.log(casefromList)
                axios({
                    url: "/surechange",
                    method: "post",
                    data: {
                        "newData": casefromList,
                        "person": "person0"
                    }
                }).then((res) => {
                    if (res) {
                        //
                    }
                })
            }
        }
    changeActiveCase (index, from) {
            var acIndex = this.state.activeIndex; //[]
            var len = this.state.activeCase.length;
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
                    var a = this.state.activeCase;
                    a.splice(index, 1);
                    this.setState({
                        activeCase: a,
                        activeIndex: k
                    });
                }else {
                    // 删除activeIndex后面
                    if (index > acIndex) {
                        // console.log("删除activeIndex后面");
                        this.state.activeCase.splice(index, 1);
                        this.setState({
                            activeCase: this.state.activeCase,
                        });
                    }else if (index < acIndex) {// 删除activeIndex前面
                        // console.log("删除activeIndex前面");
                        this.state.activeCase.splice(index, 1);
                        this.setState({
                            activeCase: this.state.activeCase,
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
                axios({
                    url: "/surechange",
                    method: "post",
                    data: {
                        "newData": stateobj,
                        "person": per,
                        "tar": auth,
                        "path": from
                    }
                }).then((res) => {
                    //ol
                });
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
              var index = acCase.indexOf(from);
              if(index >= 0) {
                  this.changeActiveCase(index, from);
              }
          }
      })
    }
    // 文件夹辅助删除
    deleteDirFn (arr, name, from) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i].name === name) {
                this.findName(arr[i].item, from);
                arr[i] = {};
            }else if (arr[i].item) {
                arr[i].item = this.deleteDirFn(arr[i].item, name, from)
            }
        }
        return arr;
    }
    // 删除文件夹
    delDirFn (name, from) {
        var forsure = window.confirm("是否真的删除" + (from + "/" + name) + "文件夹？");
        if(forsure) {
            var caseList = this.state.caseList;
            var fromArr = from.split("/");
            var caselist = caseList[fromArr[0]];
            var activelist = this.state.activeCase;
            var activeindex = this.state.activeIndex;
            if (caselist.info.name === name) {
                caseList[fromArr[0]] = {};
                activelist = activelist.filter((ele, index)=> {
                    // var arr = ele.split("/")[0];
                    return ele !== from
                });
                this.setState({
                    activeCase: activelist,
                    activeIndex: 0
                })
            } else {
                caseList[fromArr[0]].item = this.deleteDirFn(caselist.item, name, from + "/" + name);
            }
            axios({
                url: "/surechange",
                method: "post",
                data: {
                    "newData": caseList,
                    "person": "person0"
                }
            }).then((res) => {
                if (res) {
                    //
                }
            });
            this.setState({
                caseList: caseList
            })
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
            this.findCase(name, "delete", "", this.state.caseList[trFrom].item, fromArr.join("/"));
            var newCaseList = this.state.caseList;
            var newList = this.state.caseStore;
            var activeCase = this.state.activeCase;
            var index = activeCase.indexOf(from);
            delete newList[trFrom][from];
            //
            if (index >= 0) {
                this.changeActiveCase(index, from);
            }
            axios({
                url: "/surechange",
                method: "post",
                data: {
                    "newData": newCaseList,
                    "person": "person0"
                }
            }).then((res) => {
                if (res) {
                    //
                }
            });
            this.setState({
                caseStore: newList,
                caseList: newCaseList
            })
        }
    }
    renameCase (arr, oldName, newName, from) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          if(arr[i].name === oldName && arr[i].name === from) {
              var newArr = {
                  name: newName,
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
    // renameFn (name, newName, from) {
    //     var store = this.state.caseStore;
    //     var caseStore = store[from];
    //     var caseCont = caseStore[name];
    //     delete caseStore[name];
    //     caseStore[newName] = caseCont;
    //     store[from] = caseStore;
    //     // caseStore -- {from:
    //     // 占位
    //     this.changeFarm(this.state.caseList[from], "/", from);
    //     var caseList = this.state.caseList[from];
    //     var newCaseItem = this.renameCase(caseList.item, name, newName);
    //     var newCaseList = {
    //         info: {
    //             ...caseList.info
    //         },
    //         item: newCaseItem
    //     };
    //     var caselist = this.state.caseList;
    //     caselist[from] = newCaseList;
    //     axios({
    //         url: "/surechange",
    //         method: "post",
    //         data: {
    //             "newData": caselist,
    //             "person": "person0"
    //         }
    //     }).then((res) => {
    //         if (res) {
    //             //
    //         }
    //     });
    //     // activeCase 也被更改
    //     var activeCase = this.state.activeCase;
    //     var acIndex = this.state.activeIndex;
    //     activeCase[acIndex] = from + "/" +newName;
    //     this.setState({
    //         caseStore: store,
    //         caseList: caselist,
    //         activeCase: activeCase
    //     })
    // }
    renameFn (name, newName, from) {
      // console.log(name, newName, from)   quasnssssaaaszz quas s nssssaaaszz tl线上/库/quasnssssaaaszz
        var store = this.state.caseStore;
        var fromArr = from.split("/");
        var caseStore = store[fromArr[0]];
        var caseCont = caseStore[from];
        delete caseStore[from];
        fromArr[fromArr.length - 1] = newName;
        var newNameStr = fromArr.join("/");
        caseStore[newNameStr] = caseCont;
        store[fromArr[0]] = caseStore;
        // caseStore -- {from:
        // 占位
        this.changeFarm(this.state.caseList[fromArr[0]], "/", from);
        var caseList = this.state.caseList[fromArr[0]];
        var fromArr = from.split("/");
        var fromName = fromArr.shift();
        var newCaseItem = this.renameCase(caseList.item, name, newName, fromArr.join("/"));
        var newCaseList = {
            info: {
                ...caseList.info
            },
            item: newCaseItem
        };
        var caselist = this.state.caseList;
        caselist[fromName] = newCaseList;
        axios({
            url: "/surechange",
            method: "post",
            data: {
                "newData": caselist,
                "person": "person0"
            }
        }).then((res) => {
            if (res) {
                //
            }
        });
        // activeCase 也被更改
        var activeCase = this.state.activeCase;
        var acIndex = this.state.activeIndex;
        activeCase[acIndex] = newNameStr;
        this.setState({
            caseStore: store,
            caseList: caselist,
            activeCase: activeCase
        })
    }
    findDirName (old, now, arr, from) {
      var fromArr = from.split("/");
      var fromlen = fromArr.length;
      if (fromlen > 2) {
          var len = arr.length;
          for (var i = 0; i < len; i++) {
              if (arr[i].name === fromArr[1]) {
                  fromArr.shift();
                  arr[i].item = this.findDirName(old, now, arr[i].item, fromArr.join("/"));
              }
              // else if (arr[i].item) {
              //     arr[i].item = this.findDirName(old, now, arr[i].item);
              // }
          }
      }else if (fromlen === 2) {
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
      var arr = this.state.caseList[fromArr[0]];
      var newArr;
        if (arr.info.name === name) {
            // caseStore也更改
            // var caseStore = this.state.caseStore;
            // if (caseStore.hasOwnProperty(name)) {
            //     var storeCont = caseStore[name];
            //     delete caseStore[name];
            //    caseStore[newName] = storeCont;
            // }
          arr.info.name = newName;
          newArr = {
              info: {
                  ...arr.info
              },
              item: arr.item
          }
      }else {
          var newarr = this.findDirName(name, newName, arr.item, from + "/" + name);
          newArr = {
              info: {
                  ...arr.info
              },
              item: newarr
          }
      };
        var arrList = this.state.caseList;
        arrList[fromArr[0]] = newArr;
        axios({
            url: "/surechange",
            method: "post",
            data: {
                "newData": arrList,
                "person": "person0"
            }
        }).then((res) => {
            if (res) {
                //
            }
        });
        this.setState({
            caseList: arrList,
            // caseStore: caseStore
        })
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
        };
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
            headList: headersList,
            bodyList: bodyList,
            paramList: paramList // 不用
        }
    }
    exportCaseFileFn (name, from, changedName) {
      var fromArr = from.split("/");
        var rawState = this.state.caseStore[fromArr[0]][from] || {};
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
          obj = this.state.caseList[dirname];
      }else {
          var caselist = this.state.caseList[fromArr[0]];
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
                activeCase: newCaseList,
                caseStore: newcaseStore,
            });
        }else {
            var sure = window.confirm(name + " 已经存在，替换？");
            if(sure) {
                var index = newCaseList.indexOf(name);
                newcaseStore[index] = newState;
                this.setState({
                    activeIndex: index,
                    activeCase: newCaseList,
                    caseStore: newcaseStore,
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
                      var fromArr = from.split("/");
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
    changeMethod(k, value) {
        var name = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k].method = value;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    changeUrl(k, value) {
        var name = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k].url = value;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    changeShowTable(k, value) {
        var name = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k].showTable = value;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    changeAble(k, value) {
      // 更改able不会更改原始数组
        var name = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k].disableList = value;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    delCaseLine(k, type, list, disable) {
        var name = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k][type] = list;
        newList[k].disableList = disable;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    changeContent(k, type, value) {
        var name = k.split("/")[0];
        // var from = k.split("/")[0];
        var store = this.state.caseStore;
        var newList = store[name];
        newList[k][type] = value;
        store[name] = newList;
        this.setState({
            caseStore: store
        })
    }
    changeAcName(name, from, auth) {
      var newActiveCase = this.state.activeCase;
      var acSet = new Set(newActiveCase);
      if (acSet.has(from)) {
          var index = newActiveCase.indexOf(from);
          this.setState({
              activeIndex: index
          })
      }else {
          acSet.add(from);
          var newActive = [...acSet];
          var newActiveIndex = newActive.length - 1;
          this.setState({
              activeCase: newActive,
              activeIndex: newActiveIndex
          })
      }
    }
    storeChange (obj, newObj, prop) {
        if (obj.info) {
            this.storeChange(obj.item, newObj, obj.info.name);
        }else if (JSON.stringify(obj) !== "{}") {
            obj.map((ele)=> {
                if(ele.item) {
                    this.storeChange(ele.item, newObj, prop + "/" +ele.name);
                }else if (ele.request) {
                        var body = ele.request.body.formdata;
                        var header = ele.request.header;
                        var query = ele.request.url.query;
                        var path = ele.request.url.path;
                        var url = ele.request.url.raw;
                        url = url.replace("{{url}}", "http://test-activity.changyou.com");
                        if(path) {
                            url = url + "/" + path.join("/");
                        }
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
                            url : url,
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
            url : url,
            auth: auth
        }
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
            caseStore: caseObj
        })
    }
    refresh (arr) {
      var newObj = {};
      for(var prop in arr) {
          if(prop === "shared") {
              for (var i = 0; i < arr[prop].length; i++) {
                  newObj[arr[prop][i].name] = this.state.caseStore[arr[prop][i].name] || {}
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
          }
          if (prop !== "shared" && prop !== "share") {
              var obj = {};
              this.storeChange(arr[prop], obj, prop);
              newObj[arr[prop].info.name] = obj
          }
      }
      var newCase = this.state.caseStore.newCase || {};

      this.setState({
            caseList: arr,
            caseStore: {
                newCase: newCase,
                ...newObj
            },
        })
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
            this.refresh(JSON.parse(res.data));
        });
    }

    render() {
      console.log(this.state.caseList);
      console.log(this.state.caseStore);
        if (JSON.stringify(this.state.caseList) === "{}") {
            return (<h3>nothing here...</h3>)
        } else {
                var acIndex = this.state.activeIndex;
                var caseListRender = this.state.activeCase.map((ele, index) => {
                var arr = ele.split("/");
                var prop = arr[0]; // newCase
                    // var file;
                    // if (prop === "newCase") {
                    //     file = arr[1]
                    // }else {
                    //     file = ele
                    // }
                return acIndex === index ? (
                    <Case stateFarm={this.stateFarm} caseSave={this.caseSave} savechange={this.whetherSave} changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={this.state.caseStore[prop][ele]} key={index} k = {ele} caseName={ele} style={{display: "block"}}>
                    </Case>) : (<Case changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={this.state.caseStore[prop][ele]} key={index} k = {ele} caseName={ele} style={{display: "none"}}>
                </Case>)
            });
            return (
                <div className="App">
                    <div className="cover">
                        <Tool addState = {this.addCase}></Tool>
                        <Nav activeCase = {this.state.activeIndex} acCaseFn = {this.acCaseFn} addFn = {this.addFile} delFn = {this.delFn} caseList={this.state.activeCase}></Nav>
                        {this.state.saveFlag >= 0 ? (<WillSave cancelSave={this.cancelSave} saveAs={this.saveAs} caseList={this.state.caseList}></WillSave>) : ""}
                        {this.state.sureFlag >= 0 ? (<IfSure saveFn={this.saveFn} cancelFn={this.cancelFn} loseFn={this.loseFn}></IfSure>) : ""}
                        <List receiveShare={this.receiveShare} exportDirFn={this.exportDirFn} refresh={this.refresh} delDirFn={this.delDirFn} renameDirFn={this.renameDirFn} deleteFn={this.deleteFn} renameFn={this.renameFn} exportStateFn={this.exportStateFn} acName={this.changeAcName} caseList={this.state.caseList}></List>
                        {caseListRender}
                    </div>
                </div>
            );
        }
    }
    }

export default App;
