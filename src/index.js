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
// 初始化请求json文件储存

async function init (options) {
    const data1 = await axios(options);
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
}
init({method:"get",
    url: "/ip"}).then((res)=>{
        var caseList = {};
        // 取出caseList
        for (var prop in res) {
            if (prop !== "common" && prop !== "share" && prop !== "shared" && prop !== "task_runner" && prop !== "variable") {
                caseList[prop] = res[prop];
            }
        }
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
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
