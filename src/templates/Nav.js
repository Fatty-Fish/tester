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
        this.props.delFn(index);
    }
    acCaseFn (e) {
        if (e.target.nodeName.toLowerCase() === "div") {
            // 防止i冒泡上来的事件
            this.props.acCaseFn($(e.target).index());
        }
    }
    render () {
        var activeCase = this.props.activeCase;
        var caseListCol = this.props.caseList.map((ele, index)=> {
            return index === activeCase ? (<div className="col-md-2 active" key={index} onClick={this.acCaseFn}>
                <span className="name">{ele}</span>
                <i className="glyphicon glyphicon-remove" onClick={this.deleteFn}></i>
            </div>) : (<div className="col-md-2" key={index} onClick={this.acCaseFn}>
                <span className="name">{ele}</span>
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
