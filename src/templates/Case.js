import React, { Component } from 'react';
import $ from "jquery";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "../css/Case.css"

class Case extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.caseRender
        };
        this.submitProxy = this.submitProxy.bind(this);
        this.changeMethod = this.changeMethod.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.jumpToHeaders = this.jumpToHeaders.bind(this);
        this.jumpToBody = this.jumpToBody.bind(this);
        this.jumpToParam = this.jumpToParam.bind(this);
        this.addLine = this.addLine.bind(this);
        this.addHeaders = this.addHeaders.bind(this);
        this.addBody = this.addBody.bind(this);
        this.addParam = this.addParam.bind(this);
        this.delLine = this.delLine.bind(this);
        this.disableFn = this.disableFn.bind(this);
        this.changeKey = this.changeKey.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.clearRequest = this.clearRequest.bind(this);
    };
    clearRequest(arr, disArr) {
        //排disabled
        var Arr = arr.filter((ele, index)=> {
            return disArr.indexOf(index) < 0
        })
        // disArr.forEach((ele)=> {
        //     arr.splice(ele, 1);
        // }); 会修改整个state不好
        //排空
        var newArr = Arr.filter((ele)=> {
            return ele.key && ele.value;
        });
        var obj = {};
        newArr.forEach((ele)=> {
            obj[ele.key] = ele.value;
        })
        return obj;
    }
    submitProxy () {
        var method = this.props.caseRender.method;
        var url = this.props.caseRender.url;
        var headerlist = this.props.caseRender.headersList;
        var paramlist = this.props.caseRender.paramList;
        var bodylist = this.props.caseRender.bodyList;
        var head = this.clearRequest(headerlist, this.props.caseRender.disableList.header);
        var param = this.clearRequest(paramlist,this.props.caseRender.disableList.param);
        var body = this.clearRequest(bodylist, this.props.caseRender.disableList.body);
        this.setState({
            result: "Waiting...."
        });
        axios({
            method: "post",
            url: "/",
            contentType:"application/json",
            timeout: 3000,
            data: {
                "method": method,
                "url": url,
                "headers": head,
                "body": body,
                "param": param
            }
        }).then((res)=> {
            console.log(JSON.stringify(res.data, null, 4))
            this.setState({
                result: JSON.stringify(res.data, null, 4)
            });
            // 提供下载。。
        }).catch((error)=> {
            this.setState({
                result: JSON.stringify(error.data, null, 4)
            });
        })
    }
    changeMethod (e) {
        // this.setState({
        //     method: e.target.value
        // });
        this.props.changeMethod(this.props.k, e.target.value)
    }
    changeUrl (e) {
        var url = e.target.value;
        if (url.indexOf("?") >= 0) {
                var reg = /(\w+):\/\/([^/:]+)?([^# ]*)/;
                var path = url.match(reg)[3];
                var query = [];
                if (path.indexOf("&")) {// 如果需要增加param line
                    var paramarr = path.split("?")[1].split("&");
                    paramarr.forEach((ele)=> {
                        var param = ele.split("=");
                        if (param.length === 1) {
                            query.push({
                                "key": param[0],
                                "value": ""
                            })
                        }else {
                            query.push({
                                "key": param[0],
                                "value": param[1]
                            })
                        }
                    })
                    // query
                }else {
                    // 不需要增加line
                    var queryArr = path.split("?")[1];
                    for (var i = 0; i< queryArr.length; i++) {
                        var queryItem = queryArr[i].split("=");
                        var queryTemp = {
                            "key": queryItem[0],
                            "value": queryItem[1]
                        };
                        query.push(queryTemp);
                    }
                }
            // 保证param最后一位是空
            query.push({
                "key": "",
                "value" : ""
            })
            // this.setState({
            //     paramList: query
            // })
            this.props.changeContent(this.props.k, "paramList", query);

        }
        // console.log(url);
        // this.setState({
        //     url: url
        // });
        this.props.changeUrl(this.props.k, url)
    }
    jumpToHeaders (e) {
        // e.preventDefault();
        // $(".nav-tabs").find(".active").removeClass("active");
        // $(e.target).parent().addClass("active");
        // this.setState({
        //     showTable: "Headers"
        // })
        this.props.changeShowTable(this.props.k, "Headers")
    }
    jumpToBody (e) {
        // e.preventDefault();
        // $(".nav-tabs").find(".active").removeClass("active");
        // $(e.target).parent().addClass("active");
        // this.setState({
        //     showTable: "Body"
        // })
        this.props.changeShowTable(this.props.k, "Body")

    }
    jumpToParam (e) {
        // e.preventDefault();
        // $(".nav-tabs").find(".active").removeClass("active");
        // $(e.target).parent().addClass("active");
        // this.setState({
        //     showTable: "Param"
        // })
        this.props.changeShowTable(this.props.k, "Param")

    }
    addLine (e) {
        var type = e.target ? $(e.target).parent().parent().attr("class") : e;
        if (type === "header") {
            var headersList = this.props.caseRender.headersList;
            headersList.push({key: "", value: ""});
            // this.setState({
            //     headersList: headersList
            // });
            this.props.changeContent(this.props.k, "headersList", headersList);
            return;
        }else if (type === "body") {
            var bodyList = this.props.caseRender.bodyList;
            bodyList.push({key: "", value: ""});
            // this.setState({
            //     bodyList: bodyList
            // });
            this.props.changeContent(this.props.k, "bodyList", bodyList);
            return;
        }else if (type === "param") {
            var paramList = this.props.caseRender.paramList;
            paramList.push({key: "", value: ""});
            // this.setState({
            //     paramList: paramList
            // });
            this.props.changeContent(this.props.k, "paramList", paramList);
            return;
        }
    }
    addHeaders (e) {
        var headersList = this.props.caseRender.headersList;
        headersList.push({key: "", value: ""});
        // this.setState({
        //     headersList: headersList,
        // });
        this.addLine("header");
    }
    addBody (e) {
        var bodyList = this.props.caseRender.bodyList;
        bodyList.push({key: "", value: ""});
        // this.setState({
        //     bodyList: bodyList
        // });
        this.addLine("body");
    }
    addParam (e) {
        var paramList = this.props.caseRender.paramList;
        paramList.push({key: "", value: ""});
        // this.setState({
        //     paramList: paramList
        // });
        this.addLine("param");
    }
    disableFn(e) {
        var type,
            index,
            flag;
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
            flag = "i";
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
            flag = "td";
        }
        if (this.state.disableList[type].indexOf(index) >= 0) { //变为able
            var num = this.state.disableList[type].indexOf(index);
            this.state.disableList[type].splice(num, 1);
            flag === "i" ? $(e.target).parent().css({color: "#fdfdfd", background: "#767676"}) : $(e.target).css({color: "#fdfdfd", background: "#767676"})
        }else {//变为disable
            this.state.disableList[type].push(index);
            flag === "i" ? $(e.target).parent().css({color: "#fff", background: "#d4d4d4"}) :  $(e.target).css({color: "#fff", background: "#d4d4d4"});
        }
        // type = param 需要修改url
        // this.setState({
        //     disableList: this.state.disableList
        // })
        this.props.changeAble(this.props.k, this.state.disableList)
    }
    delLine (e) {
        var type,
            index;
        if (e.target.nodeName.toLowerCase() === "i") {
            type = $(e.target).parent().parent().attr("class");
            index = $(e.target).parent().parent().index();
        }else if (e.target.nodeName.toLowerCase() === "td") {
            type = $(e.target).parent().attr("class");
            index = $(e.target).parent().index();
        }
        if (type === "header") {
            var headersList = this.props.caseRender.headersList;
            var disHeader = this.props.caseRender.disableList.header;
            headersList.splice(index, 1);
            //如果减去的是dis的，则消除dis
            var num = disHeader.indexOf(index);
            if (num >=0) {
                disHeader.splice(num, 1);
            }
            var disablelist = this.props.caseRender.disableList;
            disablelist.header = disHeader;
            // this.setState({
            //     headersList: headersList,
            //     disableList: disablelist
            // });
            this.props.delCaseLine(this.props.k,"headersList", headersList, disablelist);
            return;
        }else if (type === "body") {
            var BodyList = this.props.caseRender.bodyList;
            var disBody = this.props.caseRender.disableList.body;
            BodyList.splice(index, 1);
            num = disBody.indexOf(index);
            if(num >= 0) {
                disBody.splice(num, 1);
            }
            disablelist = this.props.caseRender.disableList;
            disablelist.body = disBody;
            // this.setState({
            //     bodyList: BodyList,
            //     disableList: disablelist
            // });
            this.props.delCaseLine(this.props.k,"bodyList", BodyList, disablelist);
            return;
        }else if (type === "param") {
            var ParamList = this.props.caseRender.paramList;
            var disParam = this.props.caseRender.disableList.param;
            ParamList.splice(index, 1);
            num = disParam.indexOf(index);
            if (num >= 0) {
                disParam.splice(num, 1);
            }
            disablelist = this.props.caseRender.disableList;
            disablelist.param = disParam;
            // this.setState({
            //     paramList: ParamList,
            //     disableList: disablelist
            // });
            this.props.delCaseLine(this.props.k,"paramList", ParamList, disablelist);
            return;
        }
    }
    changeFn (e, name) {
        var type = $(e.target).parent().parent().attr("class");
        var index = $(e.target).parent().parent().index();
        var val = e.target.value;
        if (type === "header") {
            var headerList = this.props.caseRender.headersList;
            headerList[index][name] = val;
            // this.setState({
            //     headersList: headerList
            // });
            this.props.changeContent(this.props.k, "headersList", headerList);
            return;
        }else if (type === "body") {
            var bodyList = this.props.caseRender.bodyList;
            bodyList[index][name] = val;
            // this.setState({
            //     bodyList: bodyList
            // });
            this.props.changeContent(this.props.k, "bodyList", bodyList);
            return
        }else if (type === "param") {
            var paramList = this.props.caseRender.paramList;
            paramList[index][name] = val;
            // this.setState({
            //     paramList: paramList
            // });
            this.props.changeContent(this.props.k, "paramList", paramList);
            return;
        }
    }
    changeKey (e) {
        this.changeFn(e, "key");
    }
    changeValue (e) {
        this.changeFn(e, "value");
    }
    componentDidUpdate () {
        // 把case组件里最新的state更新到父级APP组件的state里（为了保证父组件export时，是最新的method，URL，header等，且case组件能自由监听变化method，URL。。。）
        // var key = this.props.k;
        // var newState = this.state;
        // this.props.stateFn(newState, key);

        // 提取Case后不需要了
    }
    render () {
        var seen = this.props.style;
        var method = this.props.caseRender.method;
        var url = this.props.caseRender.url;
        var raw = url.split("?")[0];
        // 先排出disable
        var disparamList = this.props.caseRender.disableList.param;
        var paramsList = this.props.caseRender.paramList.filter((ele, index)=> {
            return disparamList.indexOf(index) < 0;
        });
        paramsList = paramsList.filter((ele)=> {
                return ele.key && ele.value
            });
        var len = paramsList.length;
        if (len === 0) {
            url = raw;
        }else {
            var paramStr = "";
            paramsList.forEach((ele, index)=> {
                if (index === 0) {
                    paramStr = "?" + ele.key + "=" + ele.value;
                }else {
                    paramStr += "&" + ele.key + "=" + ele.value
                }
            });
            url = raw + paramStr;
        }
        var headersShow = this.props.caseRender.showTable === "Headers" ? true : false;
        var bodyShow = this.props.caseRender.showTable === "Body" ? true : false;
        var paramShow = this.props.caseRender.showTable === "Param" ? true : false;
        var headerFlag = this.props.caseRender.headersList.length;
        var disHeader = this.props.caseRender.disableList.header;
        var HeadersList = this.props.caseRender.headersList.map((ele, index)=> {
            if (index === headerFlag - 1) {
                return (<tr className="header" key={index}>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i
                        className="glyphicon glyphicon-ok"></i></td>
                    <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                               value={ele.key}/></td>
                    <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                               value={ele.value}/></td>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i
                        className="glyphicon glyphicon-minus"></i></td>
                </tr>)
            } else {
                if (disHeader.indexOf(index) >= 0) {
                    return (<tr className="header" key={index}>
                        <td className="btn" style={{
                            width: "100%",
                            height: "34px",
                            color: "#fff",
                            background: "#d4d4d4",
                            lineHeight: "34px"
                        }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    return (<tr className="header" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                }
            }
        });


        var bodyFlag = this.props.caseRender.bodyList.length;
        var disBody = this.props.caseRender.disableList.body;
        var BodyList = this.props.caseRender.bodyList.map((ele, index)=> {
            if (index === bodyFlag - 1) {
                return (<tr className="body" key={index}>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-ok"></i></td>
                    <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                               value={ele.key}/></td>
                    <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                               value={ele.value}/></td>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-minus"></i></td>
                </tr>)
            } else {
                if (disBody.indexOf(index) >= 0) {
                    return (<tr className="body" key={index}>
                        <td className="btn" style={{
                            width: "100%",
                            height: "34px",
                            color: "#fff",
                            background: "#d4d4d4",
                            lineHeight: "34px"
                        }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    return (<tr className="body" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                }
            }
        });
        var paramFlag = this.props.caseRender.paramList.length;
        var disParam = this.props.caseRender.disableList.param;
        var ParamList = this.props.caseRender.paramList.map((ele, index)=> {
            if (index === paramFlag - 1) {
                return (<tr className="param" key={index}>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-ok"></i></td>
                    <td><input className="form-control" name={ele.key} type="text" onChange={this.addLine}
                               value={ele.key}/></td>
                    <td><input className="form-control" name={ele.value} type="text" onChange={this.addLine}
                               value={ele.value}/></td>
                    <td className="btn" style={{width: "100%", height: "34px", color: "#767676", lineHeight: "34px"}}><i className="glyphicon glyphicon-minus"></i></td>
                </tr>)
            } else {
                if (disParam.indexOf(index) >= 0) {
                    return (<tr className="param" key={index}>
                        <td className="btn" style={{
                            width: "100%",
                            height: "34px",
                            color: "#fff",
                            background: "#d4d4d4",
                            lineHeight: "34px"
                        }} onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                } else {
                    return (<tr className="param" key={index}>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.disableFn}><i className="glyphicon glyphicon-ok"></i></td>
                        <td><input className="form-control" name={ele.key} type="text" onChange={this.changeKey}
                                   value={ele.key}/></td>
                        <td><input className="form-control" name={ele.value} type="text" onChange={this.changeValue}
                                   value={ele.value}/></td>
                        <td className="btn" style={{width: "100%", height: "34px", lineHeight: "34px"}}
                            onClick={this.delLine}><i className="glyphicon glyphicon-minus"></i></td>
                    </tr>)
                }
            }
        });
        return (
            <div className="case" style={seen}>
                <div className="top">
                    <div className="method">
                        <select className="form-control" value={method} onChange={this.changeMethod}>
                            <option value="get">GET</option>
                            <option value="post">POST</option>
                            <option value="put">PUT</option>
                            <option value="patch">PATCH</option>
                            <option value="delete">DELETE</option>
                        </select>
                    </div>
                    <div className="url">
                        <input type="text" name = "url" value={url} onChange={this.changeUrl}/>
                    </div>
                    <button className="btn submit" onClick={this.submitProxy}>提交</button>
                </div>
                <div className="content">
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={headersShow ? "active" : ""}><a href="#" onClick={this.jumpToHeaders}>Headers</a></li>
                        <li role="presentation" className={bodyShow　? "active" : ""}><a href="#" onClick={this.jumpToBody}>Body</a></li>
                        <li role="presentation" className={paramShow　? "active" : ""}><a href="#" onClick={this.jumpToParam}>Param</a></li>
                    </ul>
                    <table className="table table-bordered table-hover" style={{display: headersShow ? "table" : "none"}}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>key</th>
                                <th>value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="header">
                        {HeadersList}
                        </tbody>
                    </table>




                    <table className="table table-bordered table-hover" style={{display: bodyShow ? "table" : "none"}}>
                        <thead>
                        <tr>
                            <th></th>
                            <th>key</th>
                            <th>value</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="body">
                        {BodyList}
                        </tbody>
                    </table>



                    <table className="table table-bordered table-hover" style={{display: paramShow ? "table" : "none"}}>
                        <thead>
                        <tr>
                            <th></th>
                            <th>key</th>
                            <th>value</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="param">
                        {ParamList}
                        </tbody>
                    </table>
                </div>




                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Response for {this.props.caseName}</h3>
                    </div>
                    <div className="panel-body" style={{textAlign: "justify"}}>
                        <pre>
                            <code>
                                {this.state.result ? this.state.result : "Click Send Button to Test This URL"}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        )
    }
}

export default Case;
