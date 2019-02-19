import React, { Component } from 'react';
import List from "../containers/list.container";

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
        if (! this.props.fromTool) {
            this.props.cancelSave();
        }else {
            this.props.cancelTool()
        }
    }
    saveAs () {
        var name = this.state.initName;
        var str = this.state.str;
        var from = this.state.from;
        // console.log(this.state.str)
        if (str) {
            this.props.saveAs(str, from, name);
        }else {
            // save to root
            // console.log(this.state)
            this.props.saveAsRoot(from, name, this.props.saveflag);
        }
    }
    render () {
        // console.log("WillSave")
        if (this.state.str) {
            var arr = this.state.str.split("/");
            arr.splice(0,1 );
            var newarr = arr.reverse();
            var newStr = newarr.join("/");
        }
        return(
            <div className="willsave">
                <div className="save-wrapper">
                    {this.props.fromTool ? "" : (<i className="glyphicon glyphicon-remove-circle" onClick={this.cancelSave}></i>)}
                    <div className="name" style={{visibility: this.props.fromTool ? "hidden" : "visible"}}>
                        <span className="name-desc">Request name:</span>
                        <input type="text" className="name-input" value={this.state.initName} onChange={this.requestName}/>
                    </div>
                    <div className="folder">
                        <span className="folder-desc">Choose a folder to save to:</span>
                        <List per={this.props.per} activeDir={this.activeDir} fromSave="fromSave" ></List>
                    </div>
                    <div className="button">
                        <button className="btn" onClick={this.cancelSave}>取消</button>
                        <button className="btn" onClick={this.saveAs}>{"储存到" + (newStr ? newStr : "根？")}</button>
                    </div>
                </div>
            </div>
        )

    }
}

export default WillSave;
