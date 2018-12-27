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
        this.lightTask = this.lightTask.bind(this);
        this.saveAsRoot = this.saveAsRoot.bind(this);
        this.cancelSave = this.cancelSave.bind(this);
        this.showShareUl = this.showShareUl.bind(this);
        // this.saveImport = this.saveImport.bind(this);
        // this.closeInput = this.closeInput.bind(this);
        // this.inputFn = this.inputFn.bind(this);
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
    showShareList () {
        this.setState({
            share: true
        })
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
        var a = this.props.sharechange(sharearr, shareTo);
        //改变shareto的shared
        if (a) {
            axios({
                method: "post",
                url: "/sureShare",
                data: {
                    host: this.props.person,
                    r: eyePerson,
                    w: editPerson,
                    shareTo: shareTo
                },
                contentType:"application/json",
            }).then ((res)=> {
                return true
            });
        }
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
    lightTask (e) {
        // i
        $(e.target).css({color: "white"});
        var path = $(e.target).attr("task");
        axios({
            method: "post",
            url: "/lightTask",
            data: {
                path: path,
                person: "person0"
            }
        }).then((res)=>{
            var task_runner = this.state.task_runner;
            task_runner[path] = res.data;
            console.log(res.data);
            this.props.taskRunnerChange(task_runner);

            // this.setState({
            //     task_runner: task_runner
            // })
            // $(e.target).next("div").css({display: "block"})
            return true
        })
    }
    componentWillMount() {
        var obj = {};
        this.props.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        this.setState({
            ...obj,
            task_runner: this.props.caseList.task_runner,
            taskPathArr: this.props.taskPathArr
        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        var obj = {};
        // share out
        nextProps.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        this.setState({
            ...obj,
            task_runner: this.props.caseList.task_runner,
            taskPathArr: this.props.taskPathArr
        })
    }
    render () {
        var task_runner = this.state.task_runner;
        var shareFlag = this.state.share;
        var shareList = this.props.caseList.share;
        var shareArr = shareList.map((ele, index)=> {
            var rarr = ele.item[0].r;
            var warr = ele.item[1].w;
            return (<div key={index}>
                <div className="shareDiv" onClick={this.showShareUl}>{ele.name}</div>
                <ul className="shareUl"><div className="sureShare" affix={ele.name} onClick={this.sureShare}>确定</div>
                    <List rarr={rarr} warr={warr} shareEdit={this.shareEdit} shareEye={this.shareEye} person={ele.name} fromShare="fromShare" caseList={this.props.caseList}></List></ul>
            </div>)
        });
        var taskPathArr = this.state.taskPathArr;
        var pathList = taskPathArr.map((ele, index)=> {
            return <li key={ele}>{ele} <i task={ele} className="glyphicon glyphicon-cutlery" onClick={this.lightTask}></i>
                <div className="liTask" task={ele} style={{display: task_runner[ele] ? "block" : "none"}}>
                    {"http://10.12.28.36:3002/task/" + task_runner[ele]}
            </div></li>
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
                            {pathList}
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
