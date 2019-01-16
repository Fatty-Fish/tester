function queryPath (arr, data) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
        if (data[i].name === arr[0]) {
            if (arr.length !== 1) {
                // var forth = arr[0];
                arr.shift();
                return queryPath(arr, data[i].item);
            }else {
                // len === 1
                return data[i]
            }
        }
    }
}

function findPath (arr, data) {
    var state = JSON.parse(data);
    var len = arr.length;
    if (len === 1) {
        return data[arr[0]]
    }else {
        var forth = arr[0];
        arr.shift();
        // console.log(forth)
        // console.log(state[forth])
        if (state[forth] === undefined) return false;
        return queryPath(arr, state[forth].item);
    }
}




module.exports = findPath;