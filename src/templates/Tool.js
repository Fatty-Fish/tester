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
            share: false
        };
        this.addCaseState = this.addCaseState.bind(this);
        this.reader= this.reader.bind(this);
        this.showShareList = this.showShareList.bind(this);
        this.shareEye = this.shareEye.bind(this);
        this.sureShare = this.sureShare.bind(this);
        this.shareEdit = this.shareEdit.bind(this);
        this.saveAs = this.saveAs.bind(this);
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
        this.props.sharechange(sharearr, shareTo);
        //改变shareto的shared
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

        });
    }
    shareEye (from, person, dis) {
        var fromArr = [].concat(from);
        if (dis) {
            // 取消分享
            var statefromArr = this.state[person];
            console.log(this.state)
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
        console.log(person)
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
        trueFiles.forEach((trueFile, index)=> {
            if(trueFile && trueFile.type === "application/json") {
                var fr=new FileReader();
                var that = this;
                fr.readAsText(trueFile);
                fr.onload=function(){
                    var obj = JSON.parse(this.result);
                    that.setState({
                        saveFrame: true,
                        importObj: obj
                    });

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
                document.getElementById("myFile").value = "";
            }else {
                alert("file type not match")

            }
        })
    }
    // saveImport (obj) {
    //
    //     // this.props.addState(obj);
    // }
    saveAs (str, from, name) {
        var caseObj = {
            name: name,
            item: this.state.importObj.item
        };
        this.props.importCase(caseObj, from);
        this.setState({
            saveFrame: false
        })
    }
    componentWillMount() {
        var obj = {};
        this.props.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        this.setState({
            ...obj
        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        var obj = {};
        nextProps.caseList.share.map((ele, index)=> {
            obj[ele.name] = ele.item[0].r || [];
            obj[ele.name + "edit"] = ele.item[1].w || [];
        });
        this.setState({
            ...obj
        })
    }
    render () {
        var shareFlag = this.state.share;
        var shareList = this.props.caseList.share;
        var shareArr = shareList.map((ele, index)=> {
            var rarr = ele.item[0].r;
            var warr = ele.item[1].w;
            return (<div key={index}>
                <div className="shareDiv">{ele.name}</div>
                <ul className="shareUl"><div className="sureShare" affix={ele.name} onClick={this.sureShare}>确定</div>
                    <List rarr={rarr} warr={warr} shareEdit={this.shareEdit} shareEye={this.shareEye} person={ele.name} fromShare="fromShare" caseList={this.props.caseList}></List></ul>
            </div>)
        });
        return(
            <div className="wrapper">
                <div className="tool">
                    <div className="btn shareBtn" onClick={this.showShareList}>分享
                        <div className="sharePanel">
                            {shareArr}
                        </div>
                    </div>
                    <button className="btn" id="chooseFile" onClick={this.import}>导入</button>
                    <input style={{display:"none"}} type="file" accept=".json" multiple id="myFile" onChange={this.reader}/>
                </div>
                {this.state.saveFrame ? (<WillSave fromTool="fromTool" saveAs={this.saveAs} caseList={this.props.caseList}></WillSave>) : ""}
            </div>
        )

    }
}

export default Tool;
