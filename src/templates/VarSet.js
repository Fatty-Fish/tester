import React, { Component } from 'react';
import $ from "jquery";
import {saveAs}  from "file-saver";

import axios from "axios";

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput/js/fileinput.min';
import "../css/VarSet.css"

class VarSet extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.enterVar = this.enterVar.bind(this);
        this.cancelForward = this.cancelForward.bind(this);
        this.shareVar = this.shareVar.bind(this);
        this.downloadVar = this.downloadVar.bind(this);
        this.removeVar = this.removeVar.bind(this);
        this.ImportBtn = this.ImportBtn.bind(this);
        this.reader = this.reader.bind(this);
        this.changeVarName = this.changeVarName.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        this.inputName = this.inputName.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        this.findVar = this.findVar.bind(this);
        this.findVarIndex = this.findVarIndex.bind(this);
        this.updateVar = this.updateVar.bind(this);
        this.disableVar = this.disableVar.bind(this);
        this.putVar = this.putVar.bind(this);
        this.addVarLine = this.addVarLine.bind(this);
        this.minVarLine = this.minVarLine.bind(this);
        this.changeVarKey = this.changeVarKey.bind(this);
        this.changeVarValue = this.changeVarValue.bind(this);
        this.addVar = this.addVar.bind(this);
        this.sureAdd = this.sureAdd.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.addVarName = this.addVarName.bind(this);
        this.disableaddVar = this.disableaddVar.bind(this);
        this.changeaddVarKey = this.changeaddVarKey.bind(this);
        this.changeaddVarValue = this.changeaddVarValue.bind(this);
        this.minaddVarLine = this.minaddVarLine.bind(this);
        this.addnewLine = this.addnewLine.bind(this);
        this.saveVar = this.saveVar.bind(this);
        this.saveThisSingle = this.saveThisSingle.bind(this);
    }
    saveThisSingle (e) {
        e.stopPropagation();
        var variable = this.findVar(this.state.varName);
        var index = this.findVarIndex(this.state.varName);
        console.log(this.props.varList);
        console.log(variable);
        console.log(index);
        axios({
            url: "/changeSingleSelfVar",
            method: "post",
            data: {
                variable: variable,
                self: "person0",
                index: index
            }
        }).then((res)=> {
            //
        })
    }
    saveVar (e) {
        e.stopPropagation();
        axios({
            url: "/changeSelfVar",
            method: "post",
            data: {
                varList: this.props.varList,
                self: "person0"
            }
        }).then((res)=> {
            //
        })
    }
    changeVarKey (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        // values index
        var index = $(e.target).parent().parent().attr("var");
        var name = this.state.varName;
        var newVar = this.findVar(name);
        newVar.values[index].key = val;
        this.putVar(newVar, name);
    }
    changeVarValue (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        // values index
        var index = $(e.target).parent().parent().attr("var");
        var name = this.state.varName;
        var newVar = this.findVar(name);
        newVar.values[index].value = val;
        this.putVar(newVar, name);
    }
    cancelForward (e) {
        e.stopPropagation();
        var from = $(e.target).attr("posi");
        if (from === "table") {
            this.setState({
                tableShow: false
                }
            )
        }else {
            this.props.varSetHide();
        }
    }
    enterVar (e) {
        if(e.target.nodeName.toLowerCase() === "li") {
            var varName = $(e.target).attr("varname");
            this.setState({
                tableShow: true,
                varName: varName
            })
        }
    }
    findVar(varNm) {
        var varList = this.props.varList;
        var len = varList.length;
        var variable;
        for (var i = 0; i < len; i++) {
            if (varList[i].name === varNm) {
                variable = varList[i];
                return variable;
            }
        }
    }
    shareVar (e) {
        var varNm = $(e.target).parent().attr("varName");
        var variable = this.findVar(varNm);
        variable.name = "person0-" + variable.name;
        axios({
            url: "/changeOthersVar",
            method: "post",
            data: {
                person: "person1", // 伪: 需要所有person列表选择一个，
                variable: variable
            },

        }).then((res)=> {
            //
        })
    }
    downloadVar (e) {
        var varNm = $(e.target).parent().attr("varName");
        var obj = this.findVar(varNm);
        var blob = new Blob([JSON.stringify(obj, null, 4)]);
        saveAs(blob, "person0-" + varNm + ".json");
    }
    removeVar (e) {
        var varNm = $(e.target).parent().attr("varName");
        this.props.removeVar(this.findVarIndex(varNm));
    }
    ImportBtn (e) {
        $("#varFile").click()
    }
    changeVarName (e) {
        console.log(this.state)
        e.stopPropagation();
        $(e.target).parent().find("input").css({display: "inline-block"});
        $(e.target).css({display: "none"});
        var foreName = $(e.target).parent().attr("varName");
        var index = this.findVarIndex(foreName);
        this.setState({
            changeIndex: index
        })
    }
    findVarIndex(varNm) {
        var varList = this.props.varList;
        var len = varList.length;
        for (var i = 0; i < len; i++) {
            if (varList[i].name === varNm) {
                return i;
            }
        }
    }

    inputName (e) {
        var nowName = $(e.target).val();
        var index = this.state.changeIndex;
        var varList = this.props.varList;
        varList[index].name = nowName;
        this.props.changeVarName(varList);
    }
    inputBlur (e) {
        $(e.target).css({display: "none"});
        // $(e.target).parent().find(".varname").text($(e.target).val());
        $(e.target).parent().find(".varname").css({display: "inline-block"});
    }
    reader () {
        var Files = document.getElementById("varFile").files;
        var trueFiles = Array.prototype.slice.call(Files);
        trueFiles.forEach((files, index)=> {
            if (files && files.type === "application/json") {
                var fr = new FileReader();
                var that = this;
                fr.readAsText(files);
                fr.onload = function () {
                    var newVar = JSON.parse(this.result);
                    that.props.importVar(newVar);
                };
                document.getElementById("varFile").value = "";
            }else {
                alert("请选择.json文件！")
            }
        })
    }
    updateVar(e) {
        e.stopPropagation();
        // update

    }
    disableVar (e) {
        e.stopPropagation();
        var index = $(e.target).parent().parent().attr("var");
        var name = this.state.varName;
        var newVar = this.findVar(name);
        var color = $(e.target).css("color");
        if (color === "rgb(255, 255, 255)") {
            // dis
            newVar.values[index].enabled = false;
        }else {
            newVar.values[index].enabled = true;
        }
        console.log(newVar);
        this.putVar(newVar, name);
    }
    disableaddVar (e) {
        e.stopPropagation();
        var index = $(e.target).parent().parent().attr("var");
        var newVar = this.state.variable;
        var color = $(e.target).css("color");
        if (color === "rgb(255, 255, 255)") {
            // dis
            newVar.values[index].enabled = false;
        }else {
            newVar.values[index].enabled = true;
        }
        this.setState({
            variable: newVar
        })
    }
    changeaddVarKey (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        // values index
        var index = $(e.target).parent().parent().attr("var");
        var newVar = this.state.variable;
        newVar.values[index].key = val;
        this.setState({
            variable: newVar
        })
    }
    changeaddVarValue (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        // values index
        var index = $(e.target).parent().parent().attr("var");
        var newVar = this.state.variable;
        newVar.values[index].value = val;
        this.setState({
            variable: newVar
        })
    }
    minaddVarLine (e) {
        var index = $(e.target).parent().parent().attr("var");
        var newVar = this.state.variable;
        newVar.values.splice(index, 1);
        this.setState({
            variable: newVar
        })
    }
    putVar(newVar, name) {
        var varList = this.props.varList;
        var len = varList.length;
        for (var i = 0; i < len; i++) {
            if (varList[i].name === name) {
                varList[i] = newVar;
                this.props.disableVar(varList);
                break;
            }
        }
    }
    addVarLine (e) {
        // button add
        var varNm = this.state.varName;
        var newVar = this.findVar(varNm);
        newVar.values.push({key: "", value: "", enabled: true});
        this.putVar(newVar, varNm);
    }
    addnewLine(e) {
        // newline
        var newVar = this.state.variable;
        newVar.values.push({key: "", value: "", enabled: true});
        this.setState({
            variable: newVar
        })
    }
    minVarLine (e) {
        // i min
        var index = $(e.target).parent().parent().attr("var");
        var name = this.state.varName;
        var newVar = this.findVar(name);
        newVar.values.splice(index, 1);
        this.putVar(newVar, name);
    }
    addVar(e) {
        e.stopPropagation();
        this.setState({
            variable: {
                name: "",
                values: [{key: "", value: "", enabled: true}],
                from: "self-added"
            }
        });
        // console.log(this.state)
    }
    sureAdd(e) {
        e.stopPropagation();
        var varList = this.props.varList;
        varList.push(this.state.variable);
        this.props.disableVar(varList);
        this.setState({
            variable: ""
        })
    }
    cancelAdd (e) {
        e.stopPropagation();
        this.setState({
            variable: ""
        })
    }
    addVarName (e) {
        e.stopPropagation();
        var val = $(e.target).val();
        var variable = this.state.variable;
        variable.name = val;
        this.setState({
            variable: variable
        })
    }
    render () {
        var varSet = this.props.varList;
        var len = varSet.length;
        if (this.state.varName) {
            var setName = this.state.varName;
            var varTr;
            for (var i = 0; i < len; i++) {
                if (varSet[i].name === setName) {
                    varTr = varSet[i].values;
                    break;
                }
            }
            var varTrCont = varTr.map((ele, index)=> {
                return (<tr key={index} var={index}>
                    <td className="btn"><i className="glyphicon glyphicon-ok" style={{color: ele.enabled ? "white" : "#767676"}} onClick={this.disableVar}></i></td>
                    <td><input className="form-control" type="text" onChange={this.changeVarKey} value={ele.key}/></td>
                    <td><input className="form-control" type="text" onChange={this.changeVarValue} value={ele.value}/></td>
                    <td className="btn"><i className="glyphicon glyphicon-minus" style={{color: ele.enabled ? "white" : "#767676"}} onClick={this.minVarLine}></i></td>
                </tr>)
            })
        }
        var varsetoutRender = varSet.map((ele, index)=> {
            return (<li className="outVar" varname={ele.name} onClick={this.enterVar} key={index}><span className="varfrom">{"from " + ele.from}</span><span className="varname" onDoubleClick={this.changeVarName}>{ele.name}</span><input
                type="text" style={{display: "none"}} value={ele.name} onBlur={this.inputBlur} onChange={this.inputName}/><i className="glyphicon glyphicon-share" onClick={this.shareVar}></i><i className="glyphicon glyphicon-save-file" onClick={this.downloadVar}></i><i className="glyphicon glyphicon-remove" onClick={this.removeVar}></i></li>)
        });
        var newVariable = this.state.variable;
        if (newVariable) {
            console.log(newVariable.values)
            newVariable = newVariable.values.map((ele, index) => {
                return (<tr key={index} var={index}>
                    <td className="btn"><i className="glyphicon glyphicon-ok"
                                           style={{color: ele.enabled ? "white" : "#767676"}}
                                           onClick={this.disableaddVar}></i></td>
                    <td><input className="form-control" type="text" onChange={this.changeaddVarKey} value={ele.key}/></td>
                    <td><input className="form-control" type="text" onChange={this.changeaddVarValue} value={ele.value}/>
                    </td>
                    <td className="btn"><i className="glyphicon glyphicon-minus"
                                           style={{color: ele.enabled ? "white" : "#767676"}}
                                           onClick={this.minaddVarLine}></i></td>
                </tr>)
            });
        }
        return (
            <div className="outerWrapper">
                <div className="varWrapper">
                    <div className="headul">
                        { !this.state.tableShow ? (<p>选择你的环境变量</p>) : (<p>在这里更改你的变量</p>)}
                    </div>
                    { !this.state.tableShow ? (<ul className="outvarUl">
                        {varsetoutRender}
                    </ul>) : ""}

                    {this.state.tableShow ? (<table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th></th>
                            <th>VARIABLE</th>
                            <th>VALUE</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {varTrCont}
                        </tbody>
                    </table>) : ""}
                    {this.state.variable ? (<div className="addvar">
                        <div className="addVarName">
                            <label htmlFor="varInput">请输入新增环境名称</label><input id="varInput" type="text" onChange={this.addVarName}/>
                        </div>
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th></th>
                                <th>VARIABLE</th>
                                <th>VALUE</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {newVariable}
                            </tbody>
                        </table>
                        <button className="btn" onClick={this.addnewLine}>newLine</button>
                        <button className="btn" onClick={this.sureAdd}>Sure</button>
                        <button className="btn" onClick={this.cancelAdd}>Cancel</button>
                    </div>) : ""}
                    <div className="btn-wrap" style={{display: this.state.variable ? "none" : "block"}}>
                        {this.state.tableShow ? "" : (<button className="varBtn btn" onClick={this.saveVar}>保存全部</button>)}
                        {this.state.tableShow ? "" : (<button className="varBtn btn" onClick={this.addVar}>新增环境</button>)}
                        {this.state.tableShow ? (<button className="varBtn btn" onClick={this.saveThisSingle}>保存这个</button>) : ""}
                        {this.state.tableShow ? (<button className="varBtn btn" onClick={this.addVarLine}>再来一行</button>) : ""}
                        {/*{this.state.tableShow ? (<button className="varBtn btn" onClick={this.updateVar}>保存</button>) : ""}*/}
                        {this.state.tableShow ? "" : (<div className="varBtn">
                            <button className="btn" id="chooseVar" onClick={this.ImportBtn}>导入新的</button>
                            <input style={{display:"none"}} type="file" accept=".json" multiple id="varFile" onChange={this.reader}/>
                        </div>)}
                        <button className="varBtn btn" posi={this.state.tableShow ? "table" : "varset"} onClick={this.cancelForward}>返回</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default VarSet;
