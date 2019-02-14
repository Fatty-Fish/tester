// 具体行动
import { combineReducers } from "redux";
import variable from "./variable";
import share from "./share"
import shared from "./shared"
import task_runner from "./task_runner"
import caseList from "./caseList"
import {shares, IPAddress, per} from "./common"

export default combineReducers({
    variable,
    share,
    shared,
    task_runner,
    caseList,
    IPAddress,
    per,
    shares
});