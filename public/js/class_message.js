$(function(){
    $.ajax({
        url:"/judgeLogin",
        success:function(data){
            var complied = _.template($("#loginModel").html());
            $("#status").html("");
            $("#avatar").html("");
            if(data.login=="1"){
                var complied1 = _.template($("#avatarModel").html());
                $("#status").append($(complied({"src1":"#","src2":"#","data1":data.data1,"data2":"退出"})));
                $("#avatar").append($(complied1({"src":data.src})));
            }else{
                $("#status").append($(complied({"src1":"login","src2":"register","data1":"登录","data2":"注册"})));
            }
        }
    });

    $("#name").on("blur",function(){
        if($("#name").val()!=""){
            $.ajax({
                url:"/findName",
                data:{"name":$("#name").val()},
                success:function(data){
                    $("#name_span").html("");
                    if(data.length==0){
                        $("#name_span").html("该用户名可以注册");
                    }else{
                        console.log("a");
                        $("#name_span").html("该用户名已经被注册");
                    }
                }
            });
        }
    });
    $("#doRegister").on("click",function(){
        console.log($("#name_span").html());
        if($("#name_span").html()=="该用户名可以注册"){
            $.ajax({
                url:"/doRegister",
                type:"post",
                data:{
                    "name":$("#name").val(),
                    "pwd":$("#pwd").val()
                },
                success:function(){
                    window.location ="/login";
                }
            })
        }
    });








})