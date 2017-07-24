//MD5多层加密工具
var crypto = require ("crypto");
function _MD5(plainCode){
    var hash = crypto.createHash("md5").update(plainCode).digest("base64");
    return hash;
};
module.exports=function(plainCode){
    return _MD5(_MD5(plainCode).substr(3,10)+_MD5("sweets"));
}