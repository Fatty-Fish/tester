import React, { Component } from 'react';
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/Nav.css"

class Nav extends Component {
    constructor(props) {
        super(props);
        this.deleteFn = this.deleteFn.bind(this);
        this.acCaseFn = this.acCaseFn.bind(this);
    }
    deleteFn (e) {
        var index = $(e.target).parent().index();
        var from = $(e.target).parent().attr("title");
        this.props.delFn(index, from);
    }
    acCaseFn (e) {
        if (e.target.nodeName.toLowerCase() === "div") {
            // 防止i冒泡上来的事件
            this.props.acCaseFn($(e.target).index(), $(e.target).attr("title"));
        }
    }
    render () {
        // console.log("Nav")
        var activeCase = this.props.activeCase;
        var caseList = this.props.caseList;
        // console.log(caseList, activeCase)
        var caseListCol = caseList.map((ele, index)=> {
            var arr = ele.split("/");
            var len = arr.length;
            var prop, file;
             if (arr[0] === "newCase") {
                 prop = arr[0];
                 file = arr[0];
             }else if (arr[len - 1] === "r" || arr[len - 1] === "w") {
                 prop = arr.join("/");
                 arr.splice(len - 1, 1);
                 file = arr.join("/");
             }else {
                 prop = arr[0];
                 file = arr[len - 1];
             }
                return index === activeCase ? (<div className="col-md-2 active" title={prop} key={index} onClick={this.acCaseFn}>
                    <span className="name">{file}</span>
                    <i className="glyphicon glyphicon-remove" onClick={this.deleteFn}></i>
                </div>) : (<div className="col-md-2" title={prop} key={index} onClick={this.acCaseFn}>
                    <span className="name">{file}</span>
                    <i className="glyphicon glyphicon-remove" onClick={this.deleteFn}></i>
                </div>)
        });
        return (
            <div className="row">
                {caseListCol}
                <div className="add" onClick={this.props.addFn}>
                    <i className="glyphicon glyphicon-plus"></i>
                </div>
            </div>
        )
    }
}

export default Nav;
