import React, { Component } from 'react';
import $ from "jquery";

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput/js/fileinput.min';
import "../css/Tool.css"

class Tool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
        };
        this.addCaseState = this.addCaseState.bind(this);
        this.reader= this.reader.bind(this);
        // this.closeInput = this.closeInput.bind(this);
        // this.inputFn = this.inputFn.bind(this);
    }
    // inputFn() {
    //     $("#input-id").fileinput({
    //         showUpload: false,
    //         showCaption:false,
    //         showRemove: false,
    //         showClose: false,
    //         previewFileType: "json",
    //         dropZoneEnabled: true,
    //         browseClass: "btn btn-block"
    //     });
    //     this.setState({
    //         flag: true
    //     });
    //     var that = this;
    //     $('#input-id').on('fileclear', function(event) {
    //         console.log("cleared the file")
    //     });
    //     $('#input-id').on('fileloaded', function (event, file, previewId, index, reader) {
    //             var name, bodyList,headerList,method,url,paramList;
    //             var {item} = JSON.parse(reader.result);
    //             var obj = item[0];
    //             var query = obj.request.url.query;
    //             name = obj.name;
    //             bodyList= obj.request.body.formdata;
    //             headerList = obj.request.header;
    //             method = obj.request.method;
    //             url = "http://" + obj.request.url.raw;
    //             paramList = query ? query : [];
    //             that.addCaseState(name, bodyList,headerList,method,url,paramList);
    //         }
    //     );
        // $("#input-id").on("fileloaded", function () {
        //     $("#input-id").trigger("fileuploaded")
        // })
    // }
    addCaseState (name, bodyList,headerList,method,url,paramList) {
        this.props.addState({
            bodyList: bodyList.length === 0 ? [{key: "", value: ""}] : bodyList,
            disableList: {
                header: [],
                body: [],
                param: []
            },
            headersList: headerList.length === 0 ? [{key: "", value: ""}] : headerList,
            method: method,
            paramList: paramList.length === 0 ? [{key: "", value: ""}] : paramList,
            result: "",
            showTable: "Headers",
            url: url
        },name);
        this.setState({
            flag: false
        })
    }
    componentWillMount() {
    }
    import() {
        $("#myFile").click()
    }
    reader () {
        var trueFile=document.getElementById("myFile").files[0];
        if(trueFile || trueFile.type === "application/json") {
            var fr=new FileReader();
            var that = this
;            fr.readAsText(trueFile);
            fr.onload=function(){
                var obj = JSON.parse(this.result);
                obj = obj.item[0];
                var name, bodyList,headerList,method,url,paramList;
                            var query = obj.request.url.query;
                            name = obj.name;
                            bodyList= obj.request.body.formdata;
                            headerList = obj.request.header;
                            method = obj.request.method;
                            url = "http://" + obj.request.url.raw;
                            paramList = query ? query : [];
                            that.addCaseState(name, bodyList,headerList,method,url,paramList);
            }
            document.getElementById("myFile").value = "";
        }else {
            // alert("file type not match")

        }
    }
    render () {
        return(
            <div className="wrapper">
                <div className="tool">
                    <button className="btn" id="choosefile" onClick={this.import}>导入文件</button>
                    <input style={{display:"none"}} type="file" accept=".json" multiple id="myFile" onChange={this.reader}/>
                </div>
            </div>
        )

    }
}

export default Tool;
