function replaceReg (str,varContent, len, index) {
    if (varContent[index].enabled || varContent[index].enable) {
        var re = new RegExp("{{" + varContent[index].key + "}}", "igm");
        var tar = varContent[index].value;
        str = str.replace(re, tar);
        if (len !== 1) {
            str = replaceReg(str, varContent, len - 1, index + 1);
            return str;
        }else {
            return str;
        }
    }
}

module.exports = replaceReg;