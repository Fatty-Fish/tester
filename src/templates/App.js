import React, { Component } from 'react';
import {saveAs}  from "file-saver";
import '../css/App.css';
import Tool from "./Tool"
import List from "./List"
import Nav from "./Nav"
import Case from "./Case"
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
}
class App extends Component {
  constructor (props) {
      super(props);
      var stateobj = JSON.parse(props.state);
      this.state = stateobj;
      this.addCase = this.addCase.bind(this);
      this.delFn = this.delFn.bind(this);
      this.renameFn = this.renameFn.bind(this);
      this.acCaseFn = this.acCaseFn.bind(this);
      this.stateFn = this.stateFn.bind(this);
      this.exportStateFn = this.exportStateFn.bind(this);
      this.addState = this.addState.bind(this);
      // 提取Casejs 到APPjs中监听
      this.changeMethod = this.changeMethod.bind(this);
      this.changeUrl = this.changeUrl.bind(this);
      this.changeShowTable=  this.changeShowTable.bind(this);
      this.changeLine = this.changeLine.bind(this);
      this.changeAble = this.changeAble.bind(this);
      this.delCaseLine = this.delCaseLine.bind(this);
      this.changeContent = this.changeContent.bind(this);
  }
  addCase () {
      var len = this.state.caseList.length;
      var newcaseList = this.state.caseStateList;
      newcaseList.push(new CASE_TEMP());
      var newlist = this.state.caseList;
      newlist.push("newCase");
      this.setState({
          caseList: newlist,
          activeCase: len,
          caseStateList : newcaseList
      })
  }
  delFn (index) {
      var acIndex = this.state.activeCase;
      var len = this.state.caseList.length;
      if (len === 1) { // case只有一个
          console.log("case只有一个");
          // var stateList = this.state.caseStateList;
          // stateList.splice(index, 1);
          // stateList.push(CASE_TEMP);
          this.setState({
              caseList: ["newCase"],
              activeCase: index,
              caseStateList: [new CASE_TEMP()],
          });

      }else {
          if (index === acIndex) {// 删除是activeCase
              console.log("删除是activeCase");
              var k;
              if(acIndex === 0) {
                  k = index;
              }else {
                  k = index -1;
              }
              var a = this.state.caseList;
              a.splice(index, 1);
              var b = this.state.caseStateList;
              b.splice(index, 1);
              this.setState({
                  caseList: a,
                  activeCase: k,
                  caseStateList: b
              });
          }else {
              // 删除activeCase后面
              if (index > acIndex) {
                  console.log("删除activeCase后面");
                  this.state.caseList.splice(index, 1);
                  this.state.caseStateList.splice(index, 1);
                  this.setState({
                      caseList: this.state.caseList,
                      caseStateList: this.state.caseStateList
                  });
              }else if (index < acIndex) {// 删除activeCase前面
                  console.log("删除activeCase前面");
                  this.state.caseList.splice(index, 1);
                  this.state.caseStateList.splice(index, 1);
                  this.setState({
                      caseList: this.state.caseList,
                      activeCase: acIndex - 1,
                      caseStateList: this.state.caseStateList
                  });
              }
          }
      }
      // return false;
  }
  renameFn (index, newName) {
      var CaseList = this.state.caseList;
      CaseList[index] = newName;
      this.setState({
          caseList: CaseList
      })
  }
  acCaseFn (index) {
        this.setState({
            activeCase: index
        });
    }
  stateFn (caseState, index) {
      // 不用setState，因为会造成死循环渲染1case组件里正常渲染2父组件state更新整体渲染导致case再次渲染
      // this.state.caseStateList[index] = caseState;

  }
  stateFarm (obj) {
      // 先排除disable
      var disBody = obj.disableList.body;
      var body = obj.bodyList;
      var header = obj.headersList;
      var param = obj.paramList
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
  exportStateFn(index) {
        var rawState = this.state.caseStateList[index] || {};
        var fileName = this.state.caseList[index];
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
      var ParmObj = {
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
      // 导出
      var blob = new Blob([JSON.stringify(ParmObj, null, 4)]);
      saveAs(blob, fileName + ".json");
  }
  addState(newState,name) {
      var len = this.state.caseList.length;
      var newCaseList = this.state.caseList;
      var newCaseStateList = this.state.caseStateList;
      if(newCaseList.indexOf(name) === -1) {
          newCaseList.push(name);
          newCaseStateList.push(newState);
          this.setState({
              activeCase: len,
              caseList: newCaseList,
              caseStateList: newCaseStateList,
          });
      }else {
          var sure = window.confirm(name + " 已经存在，替换？");
          if(sure) {
              var index = newCaseList.indexOf(name);
              newCaseStateList[index] = newState;
              this.setState({
                  activeCase: index,
                  caseList: newCaseList,
                  caseStateList: newCaseStateList,
              });
          }
      }
    }
    changeMethod(index, value) {
      var newList = this.state.caseStateList;
      newList[index].method = value;
      this.setState({
          caseStateList: newList
      })
    }
    changeUrl(index, value) {
        var newList = this.state.caseStateList;
        newList[index].url = value;
        this.setState({
            caseStateList: newList
        })
    }
    changeShowTable(index, value) {
        var newList = this.state.caseStateList;
        newList[index].showTable = value;
        this.setState({
            caseStateList: newList
        })
    }
    changeLine(index, type, value) {
        var newList = this.state.caseStateList;
        newList[index][type] = value;
        this.setState({
            caseStateList: newList
        })
    }
    changeAble(index, value) {
        var newList = this.state.caseStateList;
        newList[index].disableList = value;
        this.setState({
            caseStateList: newList
        })
    }
    delCaseLine(index, type, list, disable) {
        var newList = this.state.caseStateList;
        newList[index][type] = list;
        newList[index].disableList = disable;
        this.setState({
            caseStateList: newList
        })
    }
    changeContent(index, type, value) {
        var newList = this.state.caseStateList;
        newList[index][type] = value;
        this.setState({
            caseStateList: newList
        })
    }
  render() {
      window.localStorage.setItem('state', JSON.stringify(this.state));
      var acIndex = this.state.activeCase;
      var caseRenderList = this.state.caseStateList;
      var caseListRender = this.state.caseList.map((ele, index)=> {
          if (index === acIndex) {
              return (<Case changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeLine={this.changeLine} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={caseRenderList[index]} k={index} caseName={ele} key={index} style={{display: "block"}}></Case>)
          }else {
              return (<Case changeContent={this.changeContent} delCaseLine={this.delCaseLine} changeAble={this.changeAble} changeLine={this.changeLine} changeShowTable={this.changeShowTable} changeUrl={this.changeUrl} changeMethod={this.changeMethod} caseRender={caseRenderList[index]} k={index} caseName={ele} key={index} style={{display: "none"}}></Case>)
          }
      });
    return (
      <div className="App">
          <Tool addState={this.addState}></Tool>
          <Nav activeCase = {this.state.activeCase} acCaseFn = {this.acCaseFn} addFn = {this.addCase} delFn = {this.delFn} caseList={this.state.caseList}></Nav>
          <List activeCase = {this.state.activeCase} acCaseFn = {this.acCaseFn} caseList={this.state.caseList} delFn = {this.delFn} renameFn = {this.renameFn} exportStateFn={this.exportStateFn}></List>
          {caseListRender}
      </div>
    );
  }
}

export default App;
