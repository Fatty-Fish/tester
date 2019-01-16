import React, { Component } from 'react';
import $ from "jquery";


import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/ShareForm.css"

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
        this.props.changeAuth(val,checked)
    }
    hidePeople (e) {
        var tar = $(e.target).attr("class");
        if (tar=== "shareForm_wrapper") {
            this.props.hidePeople();
        }
    }

    render () {
        var renderList=this.props.shareList;
        // console.log(renderList)
        var auth = this.props.auth;
        var pathArr=this.props.pathArr;
        // console.log(auth, pathArr)
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
