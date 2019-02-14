function findDirName (old, now, arr, from) {
    var fromArr = from.split("/");
    var fromlen = fromArr.length;
    if (fromlen > 3) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i].name === fromArr[1]) {
                fromArr.shift();
                arr[i].item = findDirName(old, now, arr[i].item, fromArr.join("/"));
            }
        }
    }else if (fromlen === 3) {
        len = arr.length;
        for (i = 0; i < len; i++) {
            if (arr[i].name === fromArr[1]) {
                arr[i].name = now;
            }
        }
    }
    return arr
}
export const  renameDirFn = (name, newName, from)=> {
    var fromArr = from.split("/");
    var arr = this.props.caseList[fromArr[0]];
    var arrList = this.props.caseList;
    var newArr;
    if (arr.info.name === name) {
        arr.info.name = newName;
        newArr = {
            info: {
                ...arr.info
            },
            item: arr.item
        };
        arrList[fromArr[0]] = newArr;
    }else {
        var newarr = findDirName(name, newName, arr.item, from + "/" + name);
        newArr = {
            info: {
                ...arr.info
            },
            item: newarr
        };
        arrList[fromArr[0]] = newArr;
    }
    return arrList;
};
