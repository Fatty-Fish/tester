import React, { Component } from 'react';
import $ from "jquery";
import List from "../containers/list.container";
import axios from "axios";

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput/js/fileinput.min';
import "../css/Tool.css"
import WillSave from "./WillSave";
class Tool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            share: false,
            ulFlag: false
        };
        this.addCaseState = this.addCaseState.bind(this);
        this.reader= this.reader.bind(this);
        this.showShareList = this.showShareList.bind(this);
        this.shareEye = this.shareEye.bind(this);
        this.sureShare = this.sureShare.bind(this);
        this.shareEdit = this.shareEdit.bind(this);
        this.saveAs = this.saveAs.bind(this);
        this.saveAsRoot = this.saveAsRoot.bind(this);
        this.cancelSave = this.cancelSave.bind(this);
        this.showShareUl = this.showShareUl.bind(this);
        this.newTask = this.newTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.taskPlay = this.taskPlay.bind(this);
        this.checkAPI = this.checkAPI.bind(this);
        this.showPeople = this.showPeople.bind(this);
        this.changeAuth = this.changeAuth.bind(this);
        this.showTask = this.showTask.bind(this);
        this.addTaskItem = this.addTaskItem.bind(this);
        this.checkTask = this.checkTask.bind(this);
        this.hideTask = this.hideTask.bind(this);
    }

    addCaseState (name, bodyList,headerList,method,url,paramList) {
        this.props.addState({
            bodyList: bodyList.length === 0 ? [{key: "", value: ""}] : bodyList,
            disableList: {
                header: [],
                body: [],
                param: []
            },
            headersList: headerList.length === 0 ? [{key: "", value: ""}] : headerList,
            method: method,
            paramList: paramList.length === 0 ? [{key: "", value: ""}] : paramList,
            result: "",
            showTable: "Headers",
            url: url
        },name);
        this.setState({
            flag: false
        })
    }
    import() {
        $("#myFile").click()
    }
    showShareUl (e) {
        if (this.state.ulFlag) {
            $(e.target).parent().find(".shareUl").css({display: "block"})
            this.setState({
                ulFlag: false
            })
        }else {
            $(e.target).parent().find(".shareUl").css({display: "block"})
            this.setState({
                ulFlag: true
            })
        }
    }
    showShareList (e) {
        if ($(e.target).attr("class")==="btn shareBtn") {
            var flag = this.state.share;
            // console.log(99)
            this.setState({
                share: !flag
            })
        }
    }
    sureShare (e) {
        e.stopPropagation();
        var shareTo = $(e.target).attr("affix");
        var eyePerson = this.state[$(e.target).attr("affix")];
        var editPerson = this.state[$(e.target).attr("affix") + "edit"];
        var eyeArr = eyePerson.length;
        for (var i = 0; i < eyeArr; i++) {
            if (editPerson.indexOf(eyePerson[i]) >= 0) {
                eyePerson.splice(i, 1);
            }
        }
        //改变自己的share
        var sharearr = [];
        sharearr.push({"r": eyePerson});
        sharearr.push({"w": editPerson});
        this.props.sharechange(sharearr, shareTo);
        //改变shareto的shared
        axios({
            method: "post",
            url: "/sureShare",
            data: {
                host: this.props.per,
                r: eyePerson,
                w: editPerson,
                shareTo: shareTo
            },
            contentType:"application/json",
        }).then ((res)=> {
            return true
        });
    }
    changeAuth(val,checked) {
        this.setState({
            valchecked: val
        })
    }
    shareEye (from, auth) {
        var flag = this.props.shares.showPeople;
        this.props.ifEnable(!flag, auth, from);
    }
    shareEdit (from, auth) {
        var flag = this.props.shares.showPeople;
        this.props.ifEnable(!flag, auth, from);

    }
    reader () {
        var Files = document.getElementById("myFile").files;
        var trueFiles = Array.prototype.slice.call(Files);
        var importObj = [];
        trueFiles.forEach((trueFile, index)=> {
            if(trueFile && trueFile.type === "application/json") {
                var fr=new FileReader();
                fr.readAsText(trueFile);
                fr.onload=function(){
                    var obj = JSON.parse(this.result);
                    importObj.push(obj)
                };
            }else {
                alert("file type not match")

            }
        });
        this.setState({
            saveFrame: true,
            importObj: importObj
        });
        document.getElementById("myFile").value = "";
    }
    saveAs (str, from, name) {
        var caseArr = this.state.importObj;
        var caseObjArr = [];
        caseArr.forEach((ele, index)=> {
            caseObjArr.push({
                name: ele.info.name ,
                item: ele.item
            })
        });
        // console.log(this.props)
        this.props.importCase(caseObjArr, from);
        this.setState({
            saveFrame: false
        })
    }
    cancelSave () {
        this.setState({
            saveFrame: false
        })
    }
    saveAsRoot (from, name) {
        this.props.importCase(this.state.importObj);
        this.setState({
            saveFrame: false
        });
    }
    taskPlay (e) {
        var flag = $(e.target).css("color");

        // console.log(uuid)
        if (flag === "rgb(0, 0, 0)") {
            var uuid = $(e.target).parent().next().text();
            $(e.target).css({color: "#cbcbcb"});
            var tar = e.target;
            // console.log(uuid);
            // 生成UUID，对应path，执行path
            axios({
                method: "post",
                url: "http://localhost:3002/task/" + uuid,
            }).then((res)=> {
                // console.log(res.data)
                if (res.data.state) {
                    // 测试全部通过
                    alert("测试全部通过")
                }else if (res.data.testURL) {
                    // 测试有失败
                    var hrefA = "http://" + this.props.IPAddress + ":3002/" + res.data.testURL;
                    alert("有部分测试未通过，通过链接：" + hrefA + " 查看详细报告")
                }else if (res.data) {
                    alert("参数错误，去保存配置再试试" + JSON.stringify(res.data,null, 4))
                }else {
                    alert("该任务已经失效了。")
                }
                $(tar).css({color: "black"});
            })
        }
    }
    showPeople(pathArr, auth) {
        var flag = this.props.shares.showPeople;
        this.props.ifEnable(!flag, auth, pathArr);
    }
    addTaskItem(e) {
        var itemName, addedItem, index;
        if (e.target.nodeName.toLowerCase() === "i") {
            itemName = $(e.target).parent().attr("title");
            if ($(e.target).css("color") === "rgb(0, 0, 0)") {
                //new add
                addedItem = this.state.addedItem || [];
                addedItem.push(itemName);
                this.setState({
                    addedItem: addedItem
                });
                $(e.target).css({"color": "white"});
            }else {
                // remove item
                addedItem = this.state.addedItem || [];
                index = addedItem.indexOf(itemName);
                addedItem.splice(index, 1);
                $(e.target).css({color: "black"})
            }
            this.setState({
                addedItem: addedItem
            })
        }
        if (e.target.nodeName.toLowerCase() === "li") {
            itemName = $(e.target).attr("title");
            var elementI = $(e.target).find("i");
            if (elementI.css("color") === "rgb(0, 0, 0)") {
                //new add
                addedItem = this.state.addedItem || [];
                addedItem.push(itemName);
                this.setState({
                    addedItem: addedItem
                });
                elementI.css({"color": "white"});
            }else {
                // remove item
                addedItem = this.state.addedItem || [];
                index = addedItem.indexOf(itemName);
                addedItem.splice(index, 1);
                elementI.css({color: "black"})
            }
            this.setState({
                addedItem: addedItem
            })
        }
    }
    newTask (e) {
        // 新建任务
        //发送请求，生成独特的UUID
        // 同样的任务名称
        var addedItem = this.state.addedItem;
        if (addedItem) {
            var taskName = window.prompt("新任务的名称：", "");
            var taskN = this.state.taskName || [];
            if (taskN.indexOf(taskName) === -1 && taskName) {
                // 有名字且没有重复
                taskN.push(taskName);
            } else {
                alert("重新取个名字吧");
                return;
            }
            axios({
                method: "post",
                url: "/createUuid",
                data: {
                    taskName: taskName,
                    person: this.props.per, // person待确定
                }
            }).then((res)=> {
                var runner = this.state.task_runner;
                runner[taskName] = {
                    taskUuid:res.data,
                    path: addedItem
                };
                this.setState({
                    addedItem: ""
                });
                $(".task-list").find(".title").find("i").css({color: "black"});
                this.props.taskRunnerChange(runner);
            });
        }
    }
    removeTask (e) {
        var remvname = $(e.target).parent().attr("class");
        var tasknames = this.state.taskName;
        var len = tasknames.length;
        for (var i = 0; i< len; i++) {
            if (tasknames[i] === remvname){
                tasknames.splice(i, 1);
                break;
            }
        }
        var task_runner = this.state.task_runner;
        delete task_runner[remvname];
        this.setState({
            taskContent: [],
            taskUid: "",
            taskContFlag: false
        });
        this.props.taskRunnerChange(task_runner);
    }
    showTask(e) {
        var tar = $(e.target).attr("class");
        var arrLen = this.state.taskPathArr.length;
        if (tar === "btn taskBtn") {
            // flag
            if (arrLen) {
                var taskFlag = this.state.taskFlag;
                this.setState({
                    taskFlag: !taskFlag
                })
            }else {
                alert("还没有接口可以建立任务。")
            }
        }
    }
    checkAPI (e) {
        var taskName = $(e.target).parent().parent().parent().find(".taskname-span").text();
        var path = $(e.target).parent().attr("class");
        var color = $(e.target).css("color");
        var task_runner = this.state.task_runner;
        // console.log(color) // rgb(203, 203, 203)
        if (color === "rgb(203, 203, 203)") {
            // 激活
            // state ， json
            task_runner[taskName].path.push(path);
            $(e.target).css({"color": "white"});
            this.props.taskRunnerChange(task_runner);
        }else {
            //
            var index = task_runner[taskName].path.indexOf(taskName);
            task_runner[taskName].path.splice(index, 1);
            $(e.target).css({"color": "rgb(203, 203, 203)"});
            this.props.taskRunnerChange(task_runner);
        }
    }
    checkTask (e) {
        var flag = this.state.taskContFlag;
        if (flag) {
            this.setState({
                taskContent: [],
                taskUid: "",
                taskContFlag: false
            })
        }else {
            // show
            var title = $(e.target).attr("title");
            var task_runner = this.state.task_runner;
            var tarTask = task_runner[title];
            var uuid = tarTask.taskUuid;
            this.setState({
                taskContent: tarTask.path,
                taskUid: uuid,
                taskContFlag: true
            })
        }
    }
    hideTask(e) {
        if ($(e.target).attr("class") === "pathPanel") {
            this.setState({
                taskFlag: false,
                addedItem:""
            })
        }
    }
    componentWillMount() {
        var obj = {};
        this.props.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        var task_runner = this.props.task_runner;
        var taskName = [];
        for (var prop in task_runner) {
            taskName.push(prop);
        }
        this.setState({
            ...obj,
            task_runner: task_runner,
            taskPathArr: this.props.taskPathArr,
            taskName: taskName,
            taskFlag:false
        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        var obj = {};
        // share out
        nextProps.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        var task_runner = nextProps.task_runner;
        var taskName = [];
        for (var prop in task_runner) {
            taskName.push(prop);
        }
        this.setState({
            ...obj,
            task_runner: task_runner,
            taskPathArr: nextProps.taskPathArr,
            taskName: taskName
        })
    }
    render () {
        // console.log("Tool")
        // console.log(this.state.taskPathArr)
        var task_runner = this.props.task_runner;
        var taskN = this.state.taskName; // []
        var taskPathArr = this.state.taskPathArr;
        var taskArr = taskN.map((ele, index)=> {
            var checkedAPI = task_runner[ele];
            var uuid = checkedAPI.taskUuid;
            return <ul className="task-name" key={ele}>
                       <li className={ele}><span className="taskname-span">{ele}</span><i style={{color: "black"}} className="glyphicon glyphicon-remove-sign" onClick={this.removeTask}></i><i style={{color: "black"}} className="glyphicon glyphicon-play" onClick={this.taskPlay}></i></li>
                <li className="uuidName" title={ele} onClick={this.checkTask}>{uuid}</li>
            </ul>
        });
        var pathList = taskPathArr.map((ele, index)=> {
            var eleArr = ele.split("/");
            eleArr.splice(0, 1);
            // console.log(eleArr)
            var api = eleArr.join("/");
            return <li title={ele} className="title" key={index} onClick={this.addTaskItem}><i className="glyphicon glyphicon-ok-sign"></i>{api}</li>
        });
        var taskcontentArr = this.state.taskContent || [];
        var taskContent = taskcontentArr.map((ele, index)=> {
            return <li key={index}>{ele}</li>
        });
        return(
            <div className="wrapper">
                <div className="tool">
                    <div className="btn shareBtn" onClick={this.showShareList}>分享
                        <div className="sharePanel" style={{display: this.state.share ? "block" : "none"}}>
                            <List showPeople={this.showPeople} per={this.props.per} shareEdit={this.shareEdit} shareEye={this.shareEye} fromShare="fromShare" ></List>
                        </div>
                    </div>
                    <div className="btn taskBtn" onClick={this.showTask}>
                        任务
                        {this.state.taskFlag ? <div className="pathPanel" onClick={this.hideTask}>
                            <ul className="new-task">
                                <ul className="path-list">
                                        <li className="apilistName">接口列表</li>
                                        <ul className="task-list">
                                            {pathList}
                                        </ul>
                                        <li className="newTask" onClick={this.newTask}>新建任务</li>
                                </ul>
                                <ul className="taskName">{taskArr}</ul>
                                {this.state.taskContFlag ? <ul className="taskContent">
                                    <li className="taskUid">{this.state.taskUid}</li>
                                    {taskContent}
                                </ul> :""}
                            </ul>
                        </div> :""}
                    </div>
                    <button className="btn" id="chooseFile" onClick={this.import}>导入</button>
                    <input style={{display:"none"}} type="file" accept=".json" multiple id="myFile" onChange={this.reader}/>
                </div>
                {this.state.saveFrame ? (<WillSave cancelTool={this.cancelSave} saveAsRoot={this.saveAsRoot} fromTool="fromTool" saveAs={this.saveAs} caseList={this.props.caseList}></WillSave>) : ""}
            </div>
        )

    }
}

export default Tool;
