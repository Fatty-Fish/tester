import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './templates/App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
import $ from "jquery";
// import mocha from "mocha";
// 初始化请求json文件储存
axios({
    method:"get",
    url: "/ip"
}).then((res)=> {
    // console.log(res.data)
    console.log(res.data.IPAddress);
    ReactDOM.render(<App IPAddress={res.data.IPAddress} per={res.data.person}/>, document.getElementById('root'));
});

// axios({
//     method: "get",
//     url: "/person0",
//     contentType:"application/json",
// }).then((res)=> {
//     var storage;
//     var newObj = {};
//     // const manageCase = function (obj) {
//     //     if (obj.info) {
//     //         manageCase(obj.item);
//     //     }else if(!obj.item && !obj.info){
//     //         obj.map((ele, index)=> {
//     //             if(ele.item) {
//     //                 manageCase(ele.item);
//     //             }else {
//     //                 var body = ele.request.body.formdata;
//     //                 var header = ele.request.header;
//     //                 var query = ele.request.url.query;
//     //                 var url = ele.request.url.raw;
//     //                 url = url.replace("{{url}}", "http://test-activity.changyou.com");
//     //                 newObj[ele.name] = {
//     //                     bodyList : body || [],
//     //                     disableList : {
//     //                         header:[],
//     //                         body: [],
//     //                         param:[]
//     //                     },
//     //                     headersList : header || [],
//     //                     method : ele.request.method,
//     //                     paramList : query || [],
//     //                     result : "",
//     //                     showTable : "Headers",
//     //                     url : url,
//     //                 }
//     //             }
//     //         })
//     //     }
//     // }
//     storage = res.data;
//     console.log(storage);
//     // manageCase(storage);
//     ReactDOM.render(<App store={storage}/>, document.getElementById('root'));
// }).catch((res)=> {
//     // err
// });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
