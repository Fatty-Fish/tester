import React, { Component } from 'react';
import $ from "jquery";
import List from "./List"

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/WillSave.css"

class WillSave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initName: "newCase"
        };
        this.requestName = this.requestName.bind(this);
        this.activeDir = this.activeDir.bind(this);
        this.cancelSave = this.cancelSave.bind(this);
        this.saveAs = this.saveAs.bind(this);
    }
    activeDir (str, from) {
        this.setState({
            str: str,
            from: from
        })
    }
    requestName (e) {
        var str = e.target.value;
        this.setState({
            initName: str
        })
    }
    cancelSave () {
        this.props.cancelSave();
    }
    saveAs () {
        if (this.state.str) {
            var name = this.state.initName;
            var str = this.state.str;
            var from = this.state.from;
            this.props.saveAs(str, from, name);
        }
    }
    render () {
        if (this.state.str) {
            var arr = this.state.str.split("/");
            arr.splice(0,1 );
            var newarr = arr.reverse();
            var newStr = newarr.join("/");
        }
        return(
            <div className="willsave">
                <div className="save-wrapper">
                    <i className="glyphicon glyphicon-remove-circle" onClick={this.cancelSave}></i>
                    <div className="name">
                        <span className="name-desc">Request name:</span>
                        <input type="text" className="name-input" value={this.state.initName} onChange={this.requestName}/>
                    </div>
                    <div className="folder">
                        <span className="folder-desc">Choose a folder to save to:</span>
                        <List activeDir={this.activeDir} fromSave="fromSave" caseList={this.props.caseList}></List>
                    </div>
                    <div className="button">
                        <button className="btn" onClick={this.cancelSave}>取消</button>
                        <button className="btn" onClick={this.saveAs}>{"储存到" + (newStr ? newStr : "哪里？")}</button>
                    </div>
                </div>
            </div>
        )

    }
}

export default WillSave;
