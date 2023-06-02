//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose"); 
var _ = require("lodash"); //use for lower case in this project

const homeStartingContent =
 "Die Ruinenstadt ist immer noch schön Ich warte lange Zeit auf deine Rückkehr In der Hand ein Vergissmeinnicht Regentropfen sind meine Tränen Wind ist mein Atem und meine Erzählung Zweige und Blätter sind meine Hände10 Denn mein Körper ist in Wurzeln gehüllt wenn die Jahreszeit des Tauens kommt, werde ich wach und singe ein Lied das Vergissmeinnicht, das du mir gegeben hast ist hier";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//step1 mongoose
mongoose.connect("mongodb+srv://nawaphat:test1@cluster0.lqtc72z.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = { //step2 mongoose Create Schema
  title: String,
  content:String
};

const Post = mongoose.model("Post",postSchema);  //step3 create a new mongoose model using the schema to define your posts collection.

app.get("/", function (req, res) { // วนกลับมาจาก step 5
  Post.find({},function(eer,posts){ //step6 mongoose หาทุกcontentแล้วส่งไปโพสในหน้าHome.ejs
    res.render("home",{
      startingContent:homeStartingContent,
      posts : posts  //posts ที่ได้จาก step 4 and 5 (เป็น Post ที่มีข้อมูลเพิ่ม)
      //ทุกข้อมูลจะมี id อยู่แล้ว ทำให้ตรง Readmore ใช้ lodash ._id ได้ เพื่อหา id ไปlink กับ step 8
    })
  })
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post ({  //step 4 mongoose  create a new post document using your mongoose model.
    title: req.body.postTitle,  //บันทึก input ที่ได้จาก/compose ในตัวแปล post
    content: req.body.postBody,
  });
  post.save(function(err){ //step 5 mongoose save เพื่อ push ข้อมูลที่ได้มา(post) ไปที่ array Post //mongoose จะมี id ติดมาด้วย
    if(!err){ //ถ้า push สำเร็จให้วนกลับไปที่ "/"
      res.redirect("/"); 
    }
  });
  
});

//first step of dynamic website
app.get("/posts/:postID", function (req, res) { //step 7 mongoose ทำให้ใช้ post.id ในการหาpostได้ /posts/post.id เอา linkนี้ไปใช้ตรง Readmore
  const requestedPostId = req.params.postID;    
  Post.findOne({_id: requestedPostId}, function(err, post){ //หา Post ที่มี id ตรงกัน
    res.render("post", { //ถ้า id ตรงกัน ส่งข้อมูลด้านล่าง
      title: post.title,
      content: post.content
    });
 
  });
 
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
