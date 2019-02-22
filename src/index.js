import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './containers/app.container';
import * as serviceWorker from './serviceWorker';
import axios from "axios";
// 统一的登陆接口
const oauthURL = "http://xxx.com:8088/oauth/oauth.html";
const serverURL = window.location.href;
const hostname = window.location.hostname;
const host = window.location.host;
async function init (options) {
    const data1 = await axios(options);
    // return data1.data
    // return (data1.data)
    if (data1.data.person) {
        let option = {
            method: "get",
            url: "/new",
            params: {
                person: data1.data.person
            },
            contentType: "application/json",
        };
        const data2 = await axios(option);
        return {
            ...data2.data,
            common: {
                IPAddress: data1.data.IPAddress,
                per: data1.data.person
            }
        }
    }else {
        document.cookie = "num=1; expires=10";
        // console.log(window.location.host, 1)
        window.location.href = oauthURL + "?redirectUrl=http://" + host + "/myLogin";

        // window.location.href = oauthURL + "?redirectUrl=http://10.12.28.36:3000/myLogin";
    }
}
var num = document.cookie;
if (num) {
    // redirect ip
    document.cookie = "num=1;domain=" + hostname + ";expires=" + new Date(0).toUTCString();
    init({method:"get",
        url: serverURL,
        contentType: "text/html; charset=UTF-8"
    }).then((res)=>{
        var caseList = {};
        // 取出caseList
        for (var prop in res) {
            if (prop !== "common" && prop !== "share" && prop !== "shared" && prop !== "task_runner" && prop !== "variable") {
                caseList[prop] = res[prop];
            }
        }
        console.log(res.share)
        var initialState = {
            caseList: caseList,
            share: res.share,
            shared: res.shared,
            task_runner: res.task_runner,
            variable: res.variable,
            ...res.common
        };
        const store = createStore(rootReducer,initialState, applyMiddleware(thunk));
        ReactDOM.render(<Provider store={store}>
            <App />
        </Provider>, document.getElementById('root'));
    });
}else {
    document.cookie = "num=1; expires=10";
    window.location.href = oauthURL + "?redirectUrl=http://" + host + "/myLogin";
    // window.location.href = oauthURL + "?redirectUrl=http://10.12.28.36:3000/myLogin";
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
