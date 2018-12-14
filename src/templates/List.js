import React, { Component } from 'react';
import $ from "jquery";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/List.css";

class List extends Component {
    constructor (props) {
        super(props);
        this.renderListFn = this.renderListFn.bind(this);
        this.showChildren = this.showChildren.bind(this);
        this.clickLi = this.clickLi.bind(this);


        this.deleteFn = this.deleteFn.bind(this);
        this.renameFn = this.renameFn.bind(this);
        this.inputName = this.inputName.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        // this.acCaseFn = this.acCaseFn.bind(this);
        this.exportFn = this.exportFn.bind(this);

        this.renameDir = this.renameDir.bind(this);
        this.inputDirName = this.inputDirName.bind(this);
        this.deleteDirFn = this.deleteDirFn.bind(this);
        this.exportDirFn = this.exportDirFn.bind(this);
        this.activeDir = this.activeDir.bind(this);
        this.findPath = this.findPath.bind(this);
        this.renderShareFn = this.renderShareFn.bind(this);
        this.showShare = this.showShare.bind(this);
    }
    findPath (oDiv, str) {
        var unique = oDiv.find(".content").text();
        str += "/" + unique;
        if (oDiv.parent().parent()[0].nodeName.toLowerCase() === "ul") {
            str = this.findPath($(oDiv.parent().parent().find("div")[0]), str);
        }
        return str
    }
    activeDir(e) {
        var oDiv = $(e.target).parent();
        var str = "";
        str = this.findPath(oDiv, str);
        var from = oDiv.attr("from");
        $(".save-wrapper .list").find(".activeDir").removeClass("activeDir");
        oDiv.find(".glyphicon-saved").addClass("activeDir");
        this.props.activeDir(str, from)
    }
    deleteFn (e) {
        var name = $(e.target).parent().attr("unique");
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            this.props.deleteFn(name, from);
        }
    }
    renameFn (e) {
        e.preventDefault();
        e.stopPropagation();
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            var parent = $(e.target).parent(); // li
            var renameInput = parent.find(".renameInput");
            var span = parent.find(".content");
            span.css({"visibility": "hidden"});
            renameInput.css({"visibility": "visible"});
            this.props.acName(parent.attr("unique"), parent.attr("from"));
        }
    }
    inputName (e) {
        e.preventDefault();
        e.stopPropagation();
        var val = e.target.value;
        var name = $(e.target).parent().attr("unique");
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            this.props.renameFn(name, val, from);
        }
    }
    inputBlur (e) {
        e.preventDefault();
        e.stopPropagation();
        var span = $(e.target).prev();
        span.text(e.target.value);
        span.css({"visibility": "visible"});
        $(e.target).css({"visibility": "hidden"});
    }
    exportFn (e) {
        e.preventDefault();
        e.stopPropagation();
        if(e.target.className === "glyphicon glyphicon-download-alt") {
            var name = $(e.target).parent().attr("unique");
            var from = $(e.target).parent().attr("from");
            var fromSave = this.props.fromSave;
            if (!fromSave) {
                this.props.exportStateFn(name, from);
            }
        }
    }
    deleteDirFn(e) {
        var name = $(e.target).parent().find("span").text();
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            this.props.delDirFn(name, from);
        }
    }
    renameDir (e) {
        e.preventDefault();
        var fromSave = this.props.fromSave;
        if (e.ctrlKey && !fromSave) {
            var parent = $(e.target).parent(); // div
            var dirInput = parent.find(".dirInput");
            var span = parent.find(".content");
            span.css({"visibility": "hidden"});
            dirInput.css({"visibility": "visible"});
        }
    }
    inputDirName (e) {
        e.preventDefault();
        e.stopPropagation();
        var val = e.target.value;
        var name = $(e.target).prev().text();
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            this.props.renameDirFn(name, val, from);
        }
    }

    inputDirBlur (e) {
        e.preventDefault();
        e.stopPropagation();
        var span = $(e.target).prev();
        span.text(e.target.value);
        span.css({"visibility": "visible"});
        $(e.target).css({"visibility": "hidden"});
    }
    // acCaseFn (e) {// 没用
    //     if ($(e.target).hasClass("outer")) {
    //         // 防止li和i冒泡上来的事件***
    //         this.props.acCaseFn($(e.target).index());
    //     }
    // }
    exportDirFn (e) {
        e.preventDefault();
        e.stopPropagation();
        var name = $(e.target).parent().find("span").text();
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            this.props.exportDirFn(name, from);
        }
    }
    showChildren (e) {
        e.preventDefault();
        e.stopPropagation();
            if (e.target.nodeName.toLowerCase() === "div") {
                if($(e.target).attr("class") === "glyphicon glyphicon-triangle-right") {
                    $(e.target).removeClass("glyphicon glyphicon-triangle-right").addClass("glyphicon glyphicon-triangle-bottom");
                    $(e.target).parent().children(":not(div)").css({display: "block"});
                }else {
                    $(e.target).removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-right");
                    $(e.target).parent().children(":not(div)").css({display: "none"});
                }
            }else if (e.target.className === "content") {
                if($(e.target).parent().attr("class") === "glyphicon glyphicon-triangle-right") {
                    $(e.target).parent().removeClass("glyphicon glyphicon-triangle-right").addClass("glyphicon glyphicon-triangle-bottom");
                    $(e.target).parent().parent().children(":not(div)").css({display: "block"});
                }else {
                    $(e.target).parent().removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-right");
                    $(e.target).parent().parent().children(":not(div)").css({display: "none"});
                }
            }
    }
    renderListFn(list, name) {
        if (list.info) {
            var temp = this.renderListFn(list.item, list.info.name);
            return (<ul key={name}>
                <div onClick={this.showChildren} from={name} className="glyphicon glyphicon-triangle-right"><span onClick={this.renameDir} className="content">{list.info.name}</span><input
                    type="text" className="dirInput" onChange={this.inputDirName} onBlur={this.inputDirBlur} value={list.info.name}/><i className="glyphicon glyphicon-trash" onClick={this.deleteDirFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportDirFn}></i>
                    {this.props.fromSave ? <i className="glyphicon glyphicon-saved" onClick={this.activeDir}></i> : ""}</div>
                {temp}
            </ul>)
        } else {
            var tem = list.map((ele, index)=> {
                if(ele.item) {
                    var te = this.renderListFn(ele.item, name + "/" + ele.name);
                    // temp
                    return (<ul key={index}>
                        <div onClick={this.showChildren} from={name} className="glyphicon glyphicon-triangle-right"><span onClick={this.renameDir} className="content">{ele.name}</span><input
                            type="text" className="dirInput" onChange={this.inputDirName} onBlur={this.inputDirBlur} value={ele.name}/><i className="glyphicon glyphicon-trash" onClick={this.deleteDirFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportDirFn}></i>
                            {this.props.fromSave ? <i className="glyphicon glyphicon-saved" onClick={this.activeDir}></i> : ""}</div>
                        {te}
                    </ul>)
                }else if (ele.request) {
                    // te

                    return (<li onClick={this.clickLi} from={name + "/" + ele.name} unique={ele.name} key={index} className="outer"><span className="content" onDoubleClick={this.renameFn}>{ele.name}</span><input
                        type="text" className="renameInput" onChange={this.inputName} onBlur={this.inputBlur} value={ele.name}/> <i className="glyphicon glyphicon-trash" onClick={this.deleteFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportFn}></i></li>)
                }
            });
            return tem
        }
    }
    clickLi(e) {
        // 每次点击li，请求服务器最新数据
        var fromSave = this.props.fromSave;
        if (!fromSave) {
            axios({
                method: "get",
                url: "/new",
                params: {
                    person: "person0"
                },
                contentType:"application/json",
            }).then((res)=> {
                this.props.refresh(JSON.parse(res.data));
            });
            console.log(888)
            if (e.target.className === "outer") {
                this.props.acName($(e.target).attr("unique"), $(e.target).attr("from"));
            }else if (e.target.className === "content") {
                this.props.acName($(e.target).parent().attr("unique"), $(e.target).parent().attr("from"));
            }
        }
    }
    showShare (e) {
        e.preventDefault();
        e.stopPropagation();
        var per = $(e.target).parent().find(".content").text();
        var path = $(e.target).text();
        var auth = $(e.target).attr("auth");
        axios({
            method: "get",
            url: "/new",
            params: {
                person: per,
                path: path
            },
            contentType:"application/json",
        }).then((res)=> {
            // 传回给APP 带上auth
            this.props.receiveShare(res.data, auth, per, path);
        });
    }
    renderShareFn (shared, share) {
        var shareList =  shared.map((ele, index)=> {
            var itemlist = ele.item.map((prop, num)=> {
                return (<li onClick={this.showShare} className="outer" key={num} auth={prop.auth}>{prop.path}</li>)
            });
            return (<ul key={index}>
                <div onClick={this.showChildren} className="glyphicon glyphicon-triangle-right"><span className="content">{ele.name}</span>
                </div>
                {itemlist}
            </ul>)
        });
        return (<ul key="fenxiang">
                <div onClick={this.showChildren} className="glyphicon glyphicon-triangle-right"><span className="content">收到的分享</span>
                </div>
            {shareList}
        </ul>)
    }
    render (){
        var list = this.props.caseList;
        var caseList = [];
        for (var prop in list){
            if (prop !== "share" && prop !== "shared") {
                caseList.push(this.renderListFn(list[prop], prop));
            }else if (prop === "shared") {
                caseList.push(this.renderShareFn(list[prop], prop));
            }
        }
        return (
            <div className="list">
                {caseList}
            </div>
        )
    }
}

export default List;
