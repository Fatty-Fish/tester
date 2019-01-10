import React, { Component } from 'react';
import $ from "jquery";


import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/IfSure.css"

class IfSure extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.loseFn = this.loseFn.bind(this);
        this.cancelFn = this.cancelFn.bind(this);
        this.saveFn = this.saveFn.bind(this);
    }
    loseFn () {
        this.props.loseFn();
    }
    cancelFn() {
        this.props.cancelFn();
    }
    saveFn () {
        this.props.saveFn();
    }
    render () {
        // console.log("IfSure")
        return(
            <div className="willsave">
                <div className="ifsure">
                    <div className="nav">
                        <p>需要保存吗？</p>
                        <i className="glyphicon glyphicon-remove-circle"></i>
                    </div>
                    <p className="desc">This tab has unsaved changes which will be lost if you choose to close it. Save these changes to avoid losing your work.</p>
                    <div className="btn-wrapper">
                        <button className="btn lose" onClick={this.loseFn}>不保存</button>
                        <button className="btn cancel" onClick={this.cancelFn}>取消</button>
                        <button className="btn save" onClick={this.saveFn}>保存</button>
                    </div>
                </div>
            </div>
        )

    }
}

export default IfSure;
