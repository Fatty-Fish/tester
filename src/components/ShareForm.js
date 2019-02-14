import React, { Component } from 'react';
import $ from "jquery";


import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/ShareForm.css"
import Immutable from "seamless-immutable";
import axios from "axios";

class ShareForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.van = this.van.bind(this);
        this.hidePeople = this.hidePeople.bind(this);
    }
    van (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        var checked = $(e.target).prop("checked");
        // console.log(val, checked); person true/false
        var shareobj = this.props.shares;
        var share = Immutable.asMutable(this.props.share, {deep: true});
        var pathArr = shareobj.pathArr;
        var showFlag = shareobj.showPeople;
        var auth = shareobj.auth;
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
        var caseList = {
            ...this.props.caseList,
            variable: this.props.variable,
            shared:this.props.shared,
            share:share,
            task_runner: this.props.task_runner
        };
        axios({
            method: "post",
            url: "/sureShare",
            data: {
                host: this.props.per,
                r: eyePerson || [],
                w: editPerson || [],
                shareTo: val
            },
            contentType:"application/json",
        }).then ((res)=> {
            return true
        });
        axios({
            url: "/surechange",
            method: "post",
            data: {
                "newData": caseList,
                "person": this.props.per
            }
        }).then((res)=> {
            this.props.changeAuth(share);
        })
    }
    hidePeople (e) {
        var tar = $(e.target).attr("class");
        if (tar=== "shareForm_wrapper") {
            this.props.hidePeople();
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {

    }

    componentWillMount() {

    }

    render () {
        var renderList=this.props.share;
        var auth = this.props.shares.auth;
        var pathArr=this.props.shares.pathArr;
        var peopleList = renderList.map((ele, index)=>{
            // ele.item[0].r   []
            var wrlen, len;
            if (auth === "eye") {
                wrlen = ele.item[0].r.length;
                len = new Set(ele.item[0].r.concat(pathArr)).size;
            }else {
                // edit
                wrlen = ele.item[1].w.length;
                len = new Set(ele.item[1].w.concat(pathArr)).size;
            }
            if (len === wrlen) {
                // 存在里面
                return <label key={index}>
                    <input type="checkbox" checked={true} onChange={this.van} value={ele.name || ""}/>{ele.name}
                </label>
            }else {

                return <label key={index}>
                    <input type="checkbox" checked={false} onChange={this.van} value={ele.name || ""}/>{ele.name}
                </label>
            }
        });
        // 获取到被更改权限的人，返回给tool，传给App
        return(
           <div className="shareForm_wrapper" onClick={this.hidePeople}>
               <div className="desc">{auth === "eye" ? "更改可读权限" : "更改可写权限"}</div>
               <div className="people_list">
                   <form className="people_check">
                       {peopleList}
                   </form>
               </div>
           </div>
        )

    }
}

export default ShareForm;
