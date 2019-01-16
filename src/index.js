import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './templates/App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
// 初始化请求json文件储存
axios({
    method:"get",
    url: "/ip"
}).then((res)=> {
    // console.log(res.data)
    console.log(res.data.IPAddress);
    ReactDOM.render(<App IPAddress={res.data.IPAddress} per={res.data.person}/>, document.getElementById('root'));
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
