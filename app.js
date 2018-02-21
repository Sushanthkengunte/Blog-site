var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();
// App Config
mongoose.connect("mongodb://localhost/blogpost_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//title,image,body,created, Mongoose model
var blogSchema = mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created:{type:Date,default:Date.now}
});

var blog = mongoose.model("Blog",blogSchema);

// blog.create({
//   title:"Testing",
//   image:"https://images.unsplash.com/photo-1421098518790-5a14be02b243?ixlib=rb-0.3.5&s=b91c47d2c38da2083120c248e5899a6d&auto=format&fit=crop&w=1789&q=80",
//   body:"This is the body"
// });

//Restfull Routes

app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
    
});


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Start Blogging"); 
});