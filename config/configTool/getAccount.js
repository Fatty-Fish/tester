const qs = require("qs");
const axios = require("axios");
const accountURL = "http://oauth.cyou-inc.com:8090/oauth/user/getAccount/";
function getAccount (data) {
    return new Promise(function (resolve, reject) {
        axios({
            method: "post",
            url: accountURL,
            data: qs.stringify(data)
        }).then(res=> {
            console.log(res.data);
            resolve(res.data)
        }).catch(err=> {
            reject(err)
        })
    })
}
module.exports = getAccount;