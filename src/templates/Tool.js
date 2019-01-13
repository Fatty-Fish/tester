import React, { Component } from 'react';
import $ from "jquery";
import List from "./List";
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
        // this.lightTask = this.lightTask.bind(this);
        this.saveAsRoot = this.saveAsRoot.bind(this);
        this.cancelSave = this.cancelSave.bind(this);
        this.showShareUl = this.showShareUl.bind(this);
        this.newTask = this.newTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.taskPlay = this.taskPlay.bind(this);
        this.showTaskList = this.showTaskList.bind(this);
        this.checkAPI = this.checkAPI.bind(this);
    }
    // inputFn() {
    //     $("#input-id").fileinput({
    //         showUpload: false,
    //         showCaption:false,
    //         showRemove: false,
    //         showClose: false,
    //         previewFileType: "json",
    //         dropZoneEnabled: true,
    //         browseClass: "btn btn-block"
    //     });
    //     this.setState({
    //         flag: true
    //     });
    //     var that = this;
    //     $('#input-id').on('fileclear', function(event) {
    //         console.log("cleared the file")
    //     });
    //     $('#input-id').on('fileloaded', function (event, file, previewId, index, reader) {
    //             var name, bodyList,headerList,method,url,paramList;
    //             var {item} = JSON.parse(reader.result);
    //             var obj = item[0];
    //             var query = obj.request.url.query;
    //             name = obj.name;
    //             bodyList= obj.request.body.formdata;
    //             headerList = obj.request.header;
    //             method = obj.request.method;
    //             url = "http://" + obj.request.url.raw;
    //             paramList = query ? query : [];
    //             that.addCaseState(name, bodyList,headerList,method,url,paramList);
    //         }
    //     );
        // $("#input-id").on("fileloaded", function () {
        //     $("#input-id").trigger("fileuploaded")
        // })
    // }
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
        // var a = this.props.sharechange(sharearr, shareTo);
        this.props.sharechange(sharearr, shareTo);
        //改变shareto的shared
        // if (a) {
        console.log(this.props.per)
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
        // }
    }
    shareEye (from, person, dis) {
        var fromArr = [].concat(from);
        if (dis) {
            // 取消分享
            var statefromArr = this.state[person];
            for (var i = 0; i < fromArr.length; i++) {
                var index = statefromArr.indexOf(fromArr[i]);
                if (index >= 0) {
                    statefromArr.splice(index, 1);
                }
            }
            this.setState({
                [person]: statefromArr
            })
        }else {
            if (this.state[person]) {
                var foreFromArr = this.state[person];
                var newFromArr = [...new Set(foreFromArr.concat(fromArr))];
            }
            this.setState({
                [person]: newFromArr || fromArr
            })
        }
    }
    shareEdit (from, person, dis) {
        var fromArr = [].concat(from);
        if (dis) {
            // 取消分享
            var statefromArr = this.state[person + "edit"];
            for (var i = 0; i < fromArr.length; i++) {
                var index = statefromArr.indexOf(fromArr[i]);
                if (index >= 0) {
                    statefromArr.splice(index, 1);
                }
            }
            this.setState({
                [person + "edit"]: statefromArr
            })
        }else {
            if (this.state[person + "edit"]) {
                var foreFromArr = this.state[person +"edit"];
                var newFromArr = [...new Set(foreFromArr.concat(fromArr))];
            }
            this.setState({
                [person + "edit"]: newFromArr || fromArr
            })
        }
    }
    reader () {
        var Files = document.getElementById("myFile").files;
        var trueFiles = Array.prototype.slice.call(Files);
        var importObj = [];
        trueFiles.forEach((trueFile, index)=> {
            if(trueFile && trueFile.type === "application/json") {
                var fr=new FileReader();
                // var that = this;
                fr.readAsText(trueFile);
                fr.onload=function(){
                    var obj = JSON.parse(this.result);
                    importObj.push(obj)
                    // if(obj) {
                    //     obj = obj.item[0];
                    //     var name, bodyList,headerList,method,url,paramList,query;
                    //     name = obj.name;
                    //     if(name) {
                    //         query = obj.request.url.query;
                    //         bodyList= obj.request.body.formdata || [{key: "", value: ""}];
                    //         headerList = obj.request.header || [{key: "", value: ""}];
                    //         method = obj.request.method || "GET";
                    //         url = obj.request.url.raw ? "http://" + obj.request.url.raw : "";
                    //         paramList = query ? query : [{key: "", value: ""}];
                    //     }
                    //     that.addCaseState(name, bodyList,headerList,method,url,paramList);
                    // }
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
    // saveImport (obj) {
    //
    //     // this.props.addState(obj);
    // }
    saveAs (str, from, name) {
        var caseArr = this.state.importObj;
        var caseObjArr = [];
        caseArr.forEach((ele, index)=> {
            caseObjArr.push({
                name: ele.info.name ,
                item: ele.item
            })
        });
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
        // var rootObj = {
        //     info: {
        //         "_postman_id": "aa2e99c6-aa0f-4bcc-9d6a-2a0e3ce86e05",
        //         "name": name,
        //         "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        //     },
        //     item: [{
        //         name: name,
        //         item: this.state.importObj.item
        //     }]
        // }
    }
    // lightTask (e) {
    //     // i
    //     $(e.target).css({color: "white"});
    //     var path = $(e.target).attr("task");
    //     axios({
    //         method: "post",
    //         url: "/lightTask",
    //         data: {
    //             path: path,
    //             person: this.props.per
    //         }
    //     }).then((res)=>{
    //         var task_runner = this.state.task_runner;
    //         task_runner[path] = res.data;
    //         this.props.taskRunnerChange(task_runner);
    //
    //         // this.setState({
    //         //     task_runner: task_runner
    //         // })
    //         // $(e.target).next("div").css({display: "block"})
    //         return true
    //     })
    // }
    taskPlay (e) {
        var flag = $(e.target).css("color");
        if (flag === "rgb(0, 0, 0)") {
            // 不可点击，执行任务中

        }else {
            var uuid = $(e.target).parent().prev().text();
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
                }else {
                    alert("参数错误，去保存配置再试试" + JSON.stringify(res.data,null, 4))
                }
                $(tar).css({color: "white"});
            })
        }
    }


    newTask (e) {
        // 新建任务
        //发送请求，生成独特的UUID
        // 同样的任务名称会覆盖
        var taskName = window.prompt("新任务的名称：", "");
        var taskN = this.state.taskName || [];
        if (taskName) {
            taskN.push(taskName);
        }else {
            return;
        }
        // console.log(this.props.per)
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
                path: []
            };
            this.props.taskRunnerChange(runner);
            var width = $(".path-list").width();
            var height = $(".path-list").height();
            console.log(height)
            // var pwidth = width + 160 * 3;
            // $(".pathPanel").css({"max-width": pwidth +"px"})
            this.setState({
                // taskName: taskN,
                width: width,
                height: height
            })
            // console.log(res.data)
        });

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
        this.props.taskRunnerChange(task_runner);
    }
    showTaskList (e) {
        var width = $(".path-list").width();
        var height = $(".path-list").height();
        if (this.state.width) {
            this.setState({
                height: null,
                width:null
            })
        }else {
            // var pwidth = width + 169 * 3;
            // $(".pathPanel").css({"max-width": pwidth +"px"});
            this.setState({
                height: height,
                width: width
            })
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
            // console.log(task_runner)
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
    componentWillMount() {
        var obj = {};
        this.props.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        var task_runner = this.props.caseList.task_runner;
        var taskName = [];
        for (var prop in task_runner) {
            taskName.push(prop);
        }
        var width = $(".path-list").width();
        var height = $(".path-list").height();
        // var pwidth = width + 160 * 3;
        // $(".pathPanel").css({"max-width": pwidth +"px"})

        this.setState({
            ...obj,
            task_runner: task_runner,
            taskPathArr: this.props.taskPathArr,
            taskName: taskName,
            width: width,
            height: height
        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        var obj = {};
        // share out
        nextProps.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        var task_runner = nextProps.caseList.task_runner;
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
        var task_runner = this.state.task_runner;
        // var shareFlag = this.state.share;
        var shareList = this.props.caseList.share;
        // console.log(shareList)
        var shareArr = shareList.map((ele, index)=> {
            var rarr = ele.item[0].r;
            var warr = ele.item[1].w;
            return (<div key={index}>
                <div className="shareDiv" onClick={this.showShareUl}>{ele.name}</div>
                <ul className="shareUl"><div className="sureShare" affix={ele.name} onClick={this.sureShare}>确定</div>
                    <List per={this.props.per} rarr={rarr} warr={warr} shareEdit={this.shareEdit} shareEye={this.shareEye} person={ele.name} fromShare="fromShare" caseList={this.props.caseList}></List></ul>
            </div>)
        });

        var taskN = this.state.taskName; // []
        var taskArr = "";
        var width = this.state.width;
        var height = this.state.height;
        var taskPathArr = this.state.taskPathArr;
        if (width) {
            taskArr = taskN.map((ele, index)=> {
                var checkedAPI = task_runner[ele];
                var uuid = checkedAPI.taskUuid;
                var checkedPathArr = checkedAPI.path;
                var checklist = taskPathArr.map((ele, index) => {
                    if (checkedPathArr.indexOf(ele) === -1) {
                        // 不存在 未勾选
                        return (<li key={index} className={ele}><i className="glyphicon glyphicon-ok-sign"></i></li>);
                    }else {
                        return (<li key={index} className={ele}><i className="glyphicon glyphicon-ok-sign" style={{color: "white"}}></i></li>);
                    }
                });
                // console.log(width + index * 125 + "px")
                return (<ul key={ele} className={"task-item item" + index} style={{marginLeft: width + index * 168 + "px", marginTop: -height + 30 + "px"}}>
                    <ul className="task-name">
                        <li className="uuidName">{uuid}</li>
                        <li className={ele}><span className="taskname-span">{ele}</span><i style={{color: "white"}} className="glyphicon glyphicon-remove-sign" onClick={this.removeTask}></i><i style={{color: "white"}} className="glyphicon glyphicon-play" onClick={this.taskPlay}></i></li>
                    </ul>
                    <ul className="check-list" onClick={this.checkAPI}>
                        {checklist}
                    </ul>
                </ul>)
            });
        }
        var pathList = taskPathArr.map((ele, index)=> {
            return <li key={index}>{ele}</li>
            // return <li key={ele}>{ele} <i task={ele} className="glyphicon glyphicon-ok-sign" onClick={this.lightTask}></i>
                {/*<div className="liTask" task={ele} style={{display: task_runner[ele] ? "block" : "none"}}>*/}
                    {/*{"http://10.12.28.36:3002/task/" + task_runner[ele]}*/}
            {/*</div>*/}
                // </li>
        });
        return(
            <div className="wrapper">
                <div className="tool">
                    <div className="btn shareBtn" onClick={this.showShareList}>分享
                        <div className="sharePanel" style={{display: this.state.share ? "block" : "none"}}>
                            {shareArr}
                        </div>
                    </div>
                    <div className="btn taskBtn" >
                        任务
                        <div className="pathPanel">
                            <ul className="new-task">
                                {/*新建列表*/}
                                <ul className="path-list">
                                    <ul className="task-nav">
                                        <li onClick={this.newTask}>新建</li>
                                        <li onClick={this.showTaskList}>查看任务列表</li>
                                    </ul>
                                    <ul className="task-list">
                                        {pathList}
                                    </ul>
                                </ul>
                                {taskArr}
                            </ul>
                        </div>
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
