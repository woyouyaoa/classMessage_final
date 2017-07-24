//DAO层的封装，封装了根数据库相关的常用操作
var MongoClient = require('mongodb').MongoClient;
var settings = require ("../settings.js");
function _connectDB(callback){
    MongoClient.connect(settings.dburl,function(err,db){
       callback(db);
    });
}
//定义插入方法
exports.insertOne=function(collectionName,json,callback){
    _connectDB(function(db){
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(err,result);
            db.close();
        });
    });
}
//修改
exports.updateMany=function(collectionName,json1,json2,callback){
    _connectDB(function(db){
        db.collection(collectionName).updateMany(json1,json2,{multiple:"true"},function(err,result){
            callback(err,result);
            db.close();
        })
    })
}
exports.deleteOne=function(collectionName,json,callback){
    _connectDB(function(db){
        db.collection(collectionName).deleteOne(json,function(err,result){
            callback(err,result);
            db.close();
        })
    })
}
//删除
exports.deleteMany=function(collectionName,json,callback){
    _connectDB(function(db){
        db.collection(collectionName).delectMany(json,function(err,result){
            callback(err,result);
            db.close();
        })
    })
}
//查询
//db.student.find({"age":30}).skip(pageSize*(page-1)).limit(pageSize).sort();
exports.find=function(collectionName,json,c,d){
    //先判断用户传入几个参数
    //如果是三个，集合名称，查询参数，回调函数
    //如果是四个，集合名称，查询参数，分页配置，查询第几页
    if(arguments.length==3){
        var callback = c;
        var skipnum = 0;
        var limitnum = 0;
        var sort = {};
    }else if(arguments.length==4){
        var callback = d;
        var args = c;//{"pageSize":3,"page":3}
        var skipnum = args.pageSize*(args.page-1)||0;
        var limitnum = args.pageSize||0;
        var sort = args.sort||{};
    }
    _connectDB(function(db){
        var all = db.collection(collectionName).find(json).skip(skipnum).limit(limitnum).sort(sort);
        all.toArray(function(err,docs){
            if(err){
                callback(err,null);
                db.close();
            }
            all=docs;
            callback(null,all);
            db.close();
        })
    })
}
//查询总记录数
exports.getAllCount=function(collectionName,callback){
    _connectDB(function(db){
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            db.close();
        });
    })
}
