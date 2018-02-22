var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();
// App Config
mongoose.connect("mongodb://localhost/blogpost_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); // should be after body parser
app.use(methodOverride("_method"))

//title,image,body,created, Mongoose model
var blogSchema = mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created:{type:Date,default:Date.now}
});

var blog = mongoose.model("Blog",blogSchema);



//Restfull Routes

app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
    
});
//NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   blog.create(req.body.blog,function(err,newBlog){
      if(err){
          res.redirect("/blogs/new");
          
      } else{
          
          res.redirect("/blogs");
      }
   }); 
});

app.get("/blogs/:id",function(req, res) {
   blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.render("show",{blog:foundBlog});
      }
   });
});

//EDIT route
app.get("/blogs/:id/edit",function(req, res) {
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("blogs");
        }else{
            res.render("edit",{blog:foundBlog}); 
        }
    })
});
//UPDATE RoUTE

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // parameters : 1st id to search for, new data and callback
   blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }
   }); 
});
// DELETE Route
app.delete("/blogs/:id",function(req,res){
   blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   }); 
});
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Start Blogging"); 
});