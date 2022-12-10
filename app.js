require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const https = require("https");
const request=require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
     const fname=req.body.fname;
     const sname=req.body.sname;
     const email=req.body.email;

     const data={
          members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fname,
                LNAME:sname
            }
          }
           
          ]
     };
     const jsonData=JSON.stringify(data);
     
     url="https://us14.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;
     const options={
        method:"POST",
        auth:"Kanishka:"+process.env.API_KEY
     };

     const request=https.request(url, options, function(response){
        console.log(response.statusCode);
        if(response.statusCode === 200) 
        res.sendFile(__dirname+"/success.html");
        else res.sendFile(__dirname+"/failure.html");

        response.on("data", function(data){
            //console.log(JSON.parse(data));
        });
     });
     request.write(jsonData);
     request.end();
     

    //  res.send("Hello");
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server listening to port 3000");
});

