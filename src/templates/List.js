import React, { Component } from 'react';
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/List.css";

class List extends Component {
    constructor (props) {
        super(props);
        this.showWindow = this.showWindow.bind(this);
        this.deleteFn = this.deleteFn.bind(this);
        this.renameFn = this.renameFn.bind(this);
        this.inputName = this.inputName.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        this.acCaseFn = this.acCaseFn.bind(this);
        this.hideMoreWindow = this.hideMoreWindow.bind(this);
        this.exportFn = this.exportFn.bind(this);
    }
    showWindow (e) {
        var moreWindow = $(e.target).next();
        $(moreWindow).css({"visibility": "visible"});
        return false;
    }
    deleteFn (e) {
        $(e.target).parent().css({"visibility": "hidden"});
        var index = $(e.target).parent().parent().index();
        this.props.delFn(index);
    }
    renameFn (e) {
        $(e.target).parent().css({"visibility": "hidden"});
        var parent = $(e.target).parent().parent();
        var renameInput = parent.find(".renameInput");
        var span = parent.find(".name");
        span.css({"visibility": "hidden"});
        renameInput.css({"visibility": "visible"});
        this.props.acCaseFn($(e.target).parent().parent().index());
    }
    inputName (e) {
        var val = e.target.value;
        var index = $(e.target).parent().index();
        this.props.renameFn(index, val);
    }
    inputBlur (e) {
        var span = $(e.target).prev();
        span.text(e.target.value);
        span.css({"visibility": "visible"});
        $(e.target).css({"visibility": "hidden"});
    }
    acCaseFn (e) {
        if ($(e.target).hasClass("outer")) {
            // 防止li和i冒泡上来的事件***
            this.props.acCaseFn($(e.target).index());
        }
    }
    hideMoreWindow (e) {
        if (e.target.nodeName.toLowerCase() === "ul") {
            // 防止冒泡上来的事件
            $(".more-window").css({"visibility": "hidden"});
        }
    }
    exportFn (e) {
        var index = $(e.target).parent().parent().index();
        this.props.exportStateFn(index);
        $(e.target).parent().css({"visibility": "hidden"});
    }
    render () {
        var activeCase = this.props.activeCase;
        var caseListLi = this.props.caseList.map((ele, index)=> {
            return index === activeCase ? (<li className="outer active" key={index} onClick={this.acCaseFn} style={{zIndex: 90}}>
                <span className="name">{ele}</span>
                <input type="text" className="renameInput" onChange={this.inputName} onBlur={this.inputBlur} value={ele}/>
                <i className="glyphicon glyphicon-align-justify" onClick={this.showWindow}></i>
                <ul className="more-window" style={{zIndex:999}} onMouseLeave={this.hideMoreWindow}>
                    <li className="del" onClick={this.deleteFn}>delete</li>
                    <li className="export" onClick={this.exportFn}>export</li>
                    <li className="rename" onClick={this.renameFn}>rename</li>
                </ul>
            </li>) : (<li className="outer" key={index} onClick={this.acCaseFn}>
                <span className="name">{ele}</span>
                <input type="text" className="renameInput" onChange={this.inputName} onBlur={this.inputBlur} value={ele}/>
                <i className="glyphicon glyphicon-align-justify" onClick={this.showWindow}></i>
                <ul className="more-window" onMouseLeave={this.hideMoreWindow}>
                    <li className="del" onClick={this.deleteFn}>delete</li>
                    <li className="export" onClick={this.exportFn}>export</li>
                    <li className="rename" onClick={this.renameFn}>rename</li>
                </ul>
            </li>)
        });
        return (
            <div className="list">
                <ul className="list-unstyled">
                    {caseListLi}
                 </ul>
            </div>
        )
    }
}

export default List;
