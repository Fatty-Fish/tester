import React, { Component } from 'react';
import $ from "jquery";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/List.css";
// 延伸jq 拖拽窗口函数
(function ($) {
    $.fn.extend({
        "myDrag": function (s) {
            var start = "";
            $(this).mousedown(function (e) {
                // 当前鼠标坐标
                var curX = e.clientX;
                var curwidth = parseInt($(this).parent().css("width")); // number
                var pthis = $(this).parent()[0];
                document.onmousemove = function (e) {
                    var moveX = e.clientX;
                    var dis = moveX - curX;
                    var width = curwidth + dis;
                    $(pthis).css({
                        "width": width >= 248 ? width + "px" : "248px"
                    })
                };
                document.onmouseup = function (e) {
                    document.onclick = function (event) {
                        if (event.target.nodeName.toLowerCase() === "html") {
                            var ulclass = $(pthis).parent().attr("class")// ul
                            if (ulclass === "shareUl") {
                                var ul  = $(pthis).parent().parent();
                                ul.css({display: "none"});
                                // ul.parent().parent().css({display: "none"});
                            }
                        }
                    };
                    document.onmousemove = null;
                };
            });
            return $(this)
        }
    })
})($);


// $(".list").myDrag("hhh");

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
        this.shareEye = this.shareEye.bind(this);
        this.shareEdit = this.shareEdit.bind(this);
        // this.leaveShare = this.leaveShare.bind(this);
    }
    // leaveShare (e) {
    //     var pclass = $(e.target).parent().attr("class");
    //     if (pclass === "shareUl") {
    //         var ppdiv = $(e.target).parent().parent();
    //         ppdiv.find(".shareUl").css({display: "none"});
    //         ppdiv.parent().css({display: "none"})
    //     }
    // }
    shareEye (e) {
        e.stopPropagation();
        var oUl = $(e.target).parent().parent().parent();
        // 点击文件夹
        if ($(e.target).parent().parent()[0].nodeName.toLowerCase() === "div") {
            if ($(e.target).css("color") === "rgb(168, 168, 168)") {
                // 变为白色
                // console.log()
                oUl.find(".glyphicon-eye-open").css({color: "white"});
                var ulArr = Array.prototype.slice.call(oUl.parent().children().find(".glyphicon-eye-open"), 0)
                var arr = ulArr.filter((ele, index)=>{
                    if (index > 0) {
                        return $(ele).css("color") === "rgb(168, 168, 168)"
                    }
                });
                if (arr.length === 0) {
                    oUl.parent().find(".glyphicon-eye-open").css({color: "white"});
                }
                var liArr = Array.prototype.slice.call(oUl.find("li"), 0);
                var itemArr = [];
                liArr.forEach((ele, index)=> {
                    itemArr.push($(ele).attr("from"));
                });
                itemArr.push($(e.target).parent().parent().attr("from"));
                this.props.shareEye(itemArr , this.props.person);
            }else {
                // 变为灰色
                oUl.find(".glyphicon-eye-open").css({color: "#a8a8a8"});
                 if (oUl.parent().children("ul").length === 1) {
                     oUl.parent().children("div").find(".glyphicon-eye-open").css({color: "#a8a8a8"})
                 }
                var disliArr = Array.prototype.slice.call(oUl.find("li"), 0);
                var disitemArr = [];
                disliArr.forEach((ele, index)=> {
                    disitemArr.push($(ele).attr("from"));
                });
                disitemArr.push($(e.target).parent().parent().attr("from"));
                this.props.shareEye(disitemArr , this.props.person, "dis");
            };
        }
        // 点击文件
        if ($(e.target).parent().parent()[0].nodeName.toLowerCase() === "li") {
            var eyeArr,EyeArr, grayEye;
            if ($(e.target).css("color") === "rgb(168, 168, 168)") {
                $(e.target).css({color: "white"});
                eyeArr = $(e.target).parent().parent().parent().find(".glyphicon-eye-open");
                EyeArr = Array.prototype.slice.call(eyeArr, 0);
                grayEye = EyeArr.filter((ele, index)=> {
                    if (index > 0) {
                        return $(ele).css("color") === "rgb(168, 168, 168)"
                    }
                });
                if (grayEye.length > 0) {
                    this.props.shareEye($(e.target).parent().parent().attr("from"), this.props.person)

                }else {
                    $(e.target).parent().parent().parent().find(".glyphicon-eye-open").css({color: "white"});
                    var fileliArr = Array.prototype.slice.call($(e.target).parent().parent().parent().find("li"));
                    var fileItemArr = [];
                    fileliArr.forEach((ele, index)=> {
                        fileItemArr.push($(ele).attr("from"));
                    });
                    this.props.shareEye(fileItemArr, this.props.person)
                }
            }else {
                $(e.target).css({color: "#a8a8a8"});
                $(e.target).parent().parent().parent().children(":first").find(".glyphicon-eye-open").css({color: "#a8a8a8"});
                this.props.shareEye($(e.target).parent().parent().attr("from"), this.props.person, "dis")
            }
        }
    }
    shareEdit (e) {
        e.stopPropagation();
        if ($(e.target).parent().parent()[0].nodeName.toLowerCase() === "div") {
            if ($(e.target).css("color") === "rgb(168, 168, 168)") {
                $(e.target).parent().parent().parent().find(".glyphicon-pencil").css({color: "white"});
                var liArr = Array.prototype.slice.call($(e.target).parent().parent().parent().find("li"), 0);
                var itemArr = [];
                liArr.forEach((ele, index)=> {
                    itemArr.push($(ele).attr("from"));
                });
                itemArr.push($(e.target).parent().parent().attr("from"));
                this.props.shareEdit(itemArr , this.props.person);
            }else {
                $(e.target).parent().parent().parent().find(".glyphicon-pencil").css({color: "#a8a8a8"});
                var disliArr = Array.prototype.slice.call($(e.target).parent().parent().parent().find("li"), 0);
                var disitemArr = [];
                disliArr.forEach((ele, index)=> {
                    disitemArr.push($(ele).attr("from"));
                });
                disitemArr.push($(e.target).parent().parent().attr("from"));
                this.props.shareEdit(disitemArr , this.props.person, "dis");
            };
        }
        // 点击文件
        if ($(e.target).parent().parent()[0].nodeName.toLowerCase() === "li") {
            var eyeArr,EyeArr, grayEye;
            if ($(e.target).css("color") === "rgb(168, 168, 168)") {
                $(e.target).css({color: "white"});
                eyeArr = $(e.target).parent().parent().parent().find(".glyphicon-pencil");
                EyeArr = Array.prototype.slice.call(eyeArr, 0);
                grayEye = EyeArr.filter((ele, index)=> {
                    if (index > 0) {
                        return $(ele).css("color") === "rgb(168, 168, 168)"
                    }
                });
                if (grayEye.length > 0) {
                    this.props.shareEdit($(e.target).parent().parent().attr("from"), this.props.person)

                }else {
                    $(e.target).parent().parent().parent().find(".glyphicon-pencil").css({color: "white"});
                    var fileliArr = Array.prototype.slice.call($(e.target).parent().parent().parent().find("li"));
                    var fileItemArr = [];
                    fileliArr.forEach((ele, index)=> {
                        fileItemArr.push($(ele).attr("from"));
                    });
                    this.props.shareEdit(fileItemArr, this.props.person)
                }
            }else {
                $(e.target).css({color: "#a8a8a8"});
                $(e.target).parent().parent().parent().children(":first").find(".glyphicon-pencil").css({color: "#a8a8a8"});
                this.props.shareEdit($(e.target).parent().parent().attr("from"), this.props.person, "dis")
            }
        }
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
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
            this.props.deleteFn(name, from);
        }
    }
    renameFn (e) {
        e.preventDefault();
        e.stopPropagation();
        var fromSave = this.props.fromSave;
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
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
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
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
            var fromShare = this.props.fromShare;
            if (!fromSave && !fromShare) {
                this.props.exportStateFn(name, from);
            }
        }
    }
    deleteDirFn(e) {
        var name = $(e.target).parent().find("span").text();
        var from = $(e.target).parent().attr("from");
        var fromSave = this.props.fromSave;
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
            this.props.delDirFn(name, from);
        }
    }
    renameDir (e) {
        e.preventDefault();
        var fromSave = this.props.fromSave;
        var fromShare = this.props.fromShare;
        if (e.ctrlKey && !fromSave && !fromShare) {
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
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
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
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
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
    renderListFn(list, name, arr, arw) {
        if (list.info) {
            var r = this.props.rarr ? this.props.rarr.indexOf(name)>= 0 ? true : false : "";
            var w = this.props.warr ? this.props.warr.indexOf(name)>= 0 ? true : false : "";
            var temp = this.renderListFn(list.item, list.info.name, r, w);
            return (<ul key={name}>
                <div onClick={this.showChildren} from={name} className="glyphicon glyphicon-triangle-right"><span onClick={this.renameDir} className="content">{list.info.name}</span><input
                    type="text" className="dirInput" onChange={this.inputDirName} onBlur={this.inputDirBlur} value={list.info.name}/><i className="glyphicon glyphicon-trash" onClick={this.deleteDirFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportDirFn}></i>
                    {this.props.fromSave ? <i className="glyphicon glyphicon-saved" onClick={this.activeDir}></i> : ""}{this.props.fromShare ? (<div className="dirShare"><i className="glyphicon glyphicon-eye-open" style={{color: r||w ? "white" : "#a8a8a8"}} from={name} onClick={this.shareEye}></i><i className="glyphicon glyphicon-pencil" style={{color: w ? "white" : "#a8a8a8"}} from={name} onClick={this.shareEdit}></i></div>) : ""}</div>
                {temp}
            </ul>)
        } else if (list.length >= 0){
            var tem = list.map((ele, index)=> {
                if(ele.item) {
                    var ulr = this.props.rarr ? this.props.rarr.indexOf(name + "/" + ele.name)>= 0 ? true : false : "";
                    var ulw = this.props.warr ? this.props.warr.indexOf(name + "/" + ele.name)>= 0 ? true : false : "";
                    var te = this.renderListFn(ele.item, name + "/" + ele.name, arr||ulr, arw||ulw);
                    // temp
                    return (<ul key={name + "/" + ele.name}>
                        <div onClick={this.showChildren} from={name + "/" + ele.name} className="glyphicon glyphicon-triangle-right"><span onClick={this.renameDir} className="content">{ele.name}</span><input
                            type="text" className="dirInput" onChange={this.inputDirName} onBlur={this.inputDirBlur} value={ele.name}/><i className="glyphicon glyphicon-trash" onClick={this.deleteDirFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportDirFn}></i>
                            {this.props.fromSave ? <i className="glyphicon glyphicon-saved" onClick={this.activeDir}></i> : ""}{this.props.fromShare ? (<div className="dirShare"><i className="glyphicon glyphicon-eye-open" style={{color: arr || ulr || ulw ? "white" : "#a8a8a8"}} from={name + "/" + ele.name} onClick={this.shareEye}></i><i className="glyphicon glyphicon-pencil" style={{color: arw || ulw ? "white" : "#a8a8a8"}} from={name + "/" + ele.name} onClick={this.shareEdit}></i></div>) : ""}</div>
                        {te}
                    </ul>)
                }else if (ele.request) {
                    // te
                    var r = this.props.rarr ? this.props.rarr.indexOf(name + "/" + ele.name) >= 0 ? true : false : "";
                    var w = this.props.rarr ? this.props.warr.indexOf(name + "/" + ele.name) >= 0 ? true : false : "";
                    return (<li onClick={this.clickLi} from={name + "/" + ele.name} unique={ele.name} key={name + "/" + ele.name} className="outer"><span className="content" onDoubleClick={this.renameFn}>{ele.name}</span><input
                        type="text" className="renameInput" onChange={this.inputName} onBlur={this.inputBlur} value={ele.name}/> <i className="glyphicon glyphicon-trash" onClick={this.deleteFn}></i> <i className="glyphicon glyphicon-download-alt" onClick={this.exportFn}></i>{this.props.fromShare ? (<div><i className="glyphicon glyphicon-eye-open" style={{color:  arr || r||w ? "white" : "#a8a8a8"}} from={name + "/" + ele.name} onClick={this.shareEye}></i><i className="glyphicon glyphicon-pencil" style={{color: arw || w ? "white" : "#a8a8a8"}} from={name + "/" + ele.name} onClick={this.shareEdit}></i></div>) : ""}</li>)
                }
            });
            return tem
        }else {
            return ""
        }
    }
    clickLi(e) {
        // 每次点击li，请求服务器最新数据
        var fromSave = this.props.fromSave;
        var fromShare = this.props.fromShare;
        if (!fromSave && !fromShare) {
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
        if (! this.props.fromShare) {
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
    componentDidMount() {
        $(".resize").myDrag("hhh");
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
                <p className="resize"></p>
            </div>
        )
    }
}

export default List;
