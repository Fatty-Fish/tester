
var logger = require('core-logger').logger;

/*
* src 正确内容，源内容
* des 执行结果
* */
let compare = function (src, des) {
    if(!checkEmpty(src, des, '')){
        return;
    }
    else if(src instanceof Object)
        compareObject(src, des, '');
    else if(Array.isArray(src))
        compareArray(src, des, '');
    else{
        src.should.be.equal(des);
    }
};

let compareObject = function (src, des, parentName) {
    for(let item in src){
        let parent = parentName.concat('\.', item);
        if(checkEmpty(src[item], des[item], parent)) continue;
        // try{
            if(Array.isArray(src[item])){   
                compareArray(src[item], des[item], parent);
            }else if(src[item] instanceof Object){     
                compareObject(src[item], des[item], parent);
            }else{
                if(ignoreField(item)) continue;
                src[item].should.be.equal(des[item]);
            }
        // }catch (e){
        //     logger.error('%s\.%s 比较错误: %s', parentName, item, e);
        // }
    }
};
let compareArray = function (src, des, parentName) {
    let i = 0;
    for(let item of src){
        if(!checkEmpty(item, des[i++], parentName)) continue;
        // try{
            if(Array.isArray(item)){
                compareArray(item, des[i], parentName);
            }else if(item instanceof Object){
                compareObject(item, des[i], parentName);
            }else{
                item.should.be.equal(des[i]);
            }
        // }catch (e){
        //     logger.error('%s\.%s 比较错误: %s', parentName, item, e);
        // }
    }

    src.size.should.be.equal(des.size);
};
/*
 * 返回是否继续检查
 * false 停止
 * true 继续检查
 * */

let checkEmpty = function (src, des, parentName) {
    let nullSrc = undefined == src || src == null || src == '';
    let nullDes = undefined == des || des == null || des == '';
    if(nullSrc || nullDes){
        if(nullSrc != nullDes)
            logger.error('%s 比较错误: %s', parentName, '一个为空，另一个非空');
        return false;
    }
    //
    let objSrc = src instanceof Object;
    let objDes = src instanceof Object;
    if(objSrc != objDes){
        logger.error('%s 比较错误: %s', parentName, '一个为对象，另一个非对象');
        return false;
    }
    let arraySrc = Array.isArray(src);
    let arrayDes = Array.isArray(des);
    if(arraySrc != arrayDes){
        logger.error('%s 比较错误: %s', parentName, '一个为数组，另一个非数组');
        return false;
    }

    return true;
};

let ignoreField = function (fieldName) {
    let str = fieldName.toLowerCase();
    return str.endsWith('id') || str.endsWith('time');
};

module.exports = compare;