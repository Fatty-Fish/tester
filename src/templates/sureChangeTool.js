import axios from "axios";
function sureChangeTool(arr, runner, person, tar, path, preText, testText) {
    axios({
        url: "/surechange",
        method: "post",
        data: {
            "newData": arr, // 新的caseList
            "runner": runner, // 记录任务
            "person": person, // 目标
            "tar": tar, // 修改权限， 分享时用到
            "path": path,// 修改的路径， 分享时用到
            "preText": preText,// 前置脚本
            "testText": testText // 后置脚本
        }
    }).then((res) => {
        if (res) {
            //
            return true
        }
    });
}
export default sureChangeTool;