var formidable = require ("formidable"),
    path = require ("path"),
    sd = require ("silly-datetime"),
    fs = require ("fs"),
    gm = require ("gm"),
    db = require ("../model/db.js"),
    ObjectID = require('mongodb').ObjectID,
    md5 = require ("../model/md5.js");
exports.showIndex = function(req,res,next){
    db.getAllCount("word",function(count){ //res.render("index",{"count":count});
        if (req.session.login != "1"){
            var login = false;
        }else{
            var login = true;
        }
        db.find("user", {"name": req.session.username}, function (err, result) {
            res.render("index", {"login": login,"count":count, "username": req.session.username,"active": "shouye","avatar":result,"check":false});
            return;
        });
    });
};
exports.showExit  = function(req,res,next){
    req.session.login = "2";
    db.getAllCount("word",function(count){
        res.render("index", {"login":  false,"count":count,"active": "shouye","check":false});return;
    });
};
exports.showRegister = function(req,res,next){
    if(req.session.login =="1"){
        res.render("index",{"login":true,"username": req.session.username,"active":"shouye","check":false});return;
    }
    res.render("register",{"login":false,"active":"register"});return;
};
exports.showPersonal= function(req,res,next){
    if(req.session.login!="1"){
        res.render("avatar",{"login":false});
        return;
    }
    res.render("personal",{"login": true, "username": req.session.username,"active": "personal"});
    return;
};
exports.getPage=function(req,res){
    var page = parseInt(req.query.page);
    db.find("word",{},{"pageSize":6,"page":page,"sort":{"time":-1}},function(err,result){
        if(err){console.log("查询失败");return;}
        res.send(result);
    });
}
exports.findAvatar=function(req,res){
    var name = req.query.name;
    db.find("user",{"name":name},function(err,result){
        if(err){console.log("查询失败");return;}
        res.send(result);
    });
}
exports.findName = function(req,res,next){
    db.find("user",{"name":req.query.name},function(err,result){
        if(err){return;}
        res.send(result);return;
    });
};
exports.doRegister = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var name = fields.name,pwd = md5(fields.pwd);
        db.find("user",{"name":name},function(err,result){
            if(err){return;}
            if(result.length==0){
                db.insertOne("user",{"name":name,"pwd":pwd,"src":"image/4.jpg"},function(err,result){
                    if(err){return;}
                    res.end();
                });
            }
        });
    });
};
exports.doLogin =function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var name = fields.name,pwd = md5(fields.pwd);
        db.find("user",{"name":name},function(err,result){
            if(err){return;}
            if(result.length==0){
                res.send("-2");return;
            }else{
                if(result[0].pwd==pwd){
                    req.session.login = "1";
                    req.session.username = name;
                    res.send("1");return;
                }else{
                    res.send("-1");return;
                }
            }
        });
    });
};
exports.doAdd=function(req,res){
    if(req.session.login !="1"){
        res.render("avatar",{"login":false});return;
    }
    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var name = req.session.username, word = req.query.word,time = time;
    db.insertOne("word",{"name":name,"word":word,"time":time},function(err,result){
        if(err){ return;}
        res.redirect("/");
    });
};
exports.myMessage=function(req,res){
    if (req.session.login == "1") {
        db.find("user", {"name": req.session.username}, function (err, result) {
            if(err){return;}
            var avatar=result[0].src;
            db.find("word", {"name": req.session.username}, function (err, result) {
                res.render("myMessage", {"login": true,"username": req.session.username,"result": result,"active": "myMessage","avatar":avatar});return;
            });
        });
    } else {
        res.render("avatar",{"login":false});return;
    }
};
exports.memos=function(req,res){
    if (req.session.login == "1") {
        db.find("user", {"name": req.session.username}, function (err, result) {
            if(err){return;}
            var avatar=result[0].src;
            //db.find("word", {"name": req.session.username}, function (err, result) {
                res.render("memos", {"login": true,"username": req.session.username,"active": "memos","avatar":avatar});return;
            //});
        });
    } else {
        res.render("avatar",{"login":false});return;
    }
};
exports.showList=function(req,res){
    if (req.session.login == "1") {
        db.find("user", {}, function (err, result) {
            res.render("list", {"login": true,"username": req.session.username,"result": result,"active": "list"});return;
        });
    } else {
        res.render("avatar",{"login":false});return;
    }
};
exports.showAvatar = function(req,res,next){
    if(req.session.login!="1"){
        res.render("avatar",{"login":false});
        return;
    }
    res.render("avatar", {"login": true, "username": req.session.username|| "wl","active": "setAvatar"});
    return;
};
exports.doAvatar = function(req,res,next){
    if(req.session.login!="1"){
        res.render("avatar",{"login":false}); return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var newpath = "./avatar/" + req.session.username + ".jpg";
        fs.rename(files.avatar.path, newpath, function (err) {
            if (err) {return;}
            req.session.avatar = req.session.username + ".jpg";
            res.redirect("/cut");
        });
    });
};
exports.showCut = function(req,res,next){
    if(req.session.login!="1"){
        res.render("avatar",{"login":false}); return;
    }
    res.render("cut", {"login":true, "username": req.session.username|| "wl","active": "setAvatar","avatar": req.session.avatar});
    return;
};
exports.doCut = function(req,res,next){
    if(req.session.login!="1"){
        res.render("avatar",{"login":false}); return;
    }
    var w = req.query.w, h = req.query.h,l = req.query.l,t = req.query.t;
    gm("./avatar/"+req.session.avatar).crop(w,h,l,t).resize(100,100,"!").write("./avatar/"+req.session.avatar,function(err){
        if(err){return;}
        db.updateMany("user", {"name": req.session.username}, {$set: {"src": req.session.avatar}}, function (err, result) {
            res.end();return;
        });
    })
};
exports.check=function(req,res,next){
    if(req.session.login == "1"){
        var login = true;
    }else{
        var login = false;
    }
    db.find("word", {"_id":ObjectID(req.query.id)}, function (err, result) {
        if(err){return;}var result_word = result;
        db.find("user", {"name": result_word[0].name}, function (err, result) {
            res.render("index", {"login": login,"username": req.session.username,"result_word": result_word,"active": "shouye","avatar":result[0].src,"check":true});
            return;
        });
    });
    //db.find("user", {"name": req.query.name}, function (err, result) {
    //    if(err){return;}
    //    var avatar=result[0].src;
    //    db.find("word", {"name": req.query.name}, function (err, result) {
    //        res.render("index", {"login": login,"username": req.session.username,"result": result,"active": "shouye","avatar":avatar,"check":true});return;
    //    });
    //});
};





