
function clearArr (varContent, newArr) {
    // 替换变量
    // 找出enable
    varContent = varContent.filter((ele, index) => {
        return ele.enable || ele.enabled
    });
    var varContents = {};
    varContent.forEach((ele, index)=> {
        varContents["{{" + ele.key + "}}"] =  ele.value
    });
    // 不希望{{}}被改变
    var newObj = [];
    newArr.forEach((ele, index)=> {
        if (varContents.hasOwnProperty(ele.value)) {
            newObj.push({key: ele.key, value: varContents[ele.value]});
        }
    });
    return newObj
}

module.exports = clearArr;