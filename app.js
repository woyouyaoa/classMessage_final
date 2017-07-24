var session = require ("express-session"),
    router = require ("./controller"),
    app = require("express")();
app.set('trust proxy', 1);
app.listen(4000);
app.set("view engine","ejs");
app.use(require("express").static("./public"));
app.use(require("express").static("./avatar"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.get("/",router.showIndex);//跳转到首页
app.get("/page",router.getPage);//首页加载留言
app.get("/findAvatar",router.findAvatar);//首页加载留言头像
app.get("/check",router.check);//查看留言详细信息
app.get("/register",router.showRegister);//跳转到注册页面
app.get("/findName",router.findName);//查询用户名是否存在
app.post("/doRegister",router.doRegister);//处理注册请求
app.post("/doLogin",router.doLogin);//处理登录请求
app.get("/add",router.doAdd);//添加留言
app.get("/myMessage",router.myMessage);//我的留言
app.get("/memos",router.memos);//我的留言
app.get("/list",router.showList);//全部成员
app.get("/avatar",router.showAvatar);//跳转到更改头像的选择页面
app.post("/avatar",router.doAvatar);//上传要更改的头像
app.get("/cut",router.showCut);//跳转到剪切头像页面
app.get("/doCut",router.doCut);//处理剪切头像结果
app.get("/personal",router.showPersonal);//跳转到个人设置中心
app.get("/exit",router.showExit);//退出请求
app.use(function(req,res){//路径错误处理
    res.render("404");
});








