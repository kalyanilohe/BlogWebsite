//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Daily Journal Corporation is an American publishing company and technology company headquartered in Los Angeles, California. The company has offices in Corona, Oakland, Riverside, Sacramento, San Diego, San Francisco, San Jose, and Santa Ana in California, and in Denver, Colo.; Logan, Utah; and Phoenix, Arizona.The Daily Journal Corporation has been publicly traded since 1987 on the NASDAQ under DJCO. Its chairman is Charles T. Munger, who is also vice chairman of Berkshire Hathaway.[2][3][4] J.P. Guerin is vice-chairman of the Daily Journal Corporation. Gerald L. Salzman is chief executive officer and president.";
const aboutContent = "The original newspaper, The Daily Court Journal (Los Angeles), began publication in 1888. Charles T. Munger purchased the paper in 1977 and through a series of acquisitions and organic growth built it into a group of newspapers and websites that provide information on the legal industry, real estate and general business. The company now publishes 10 newspapers in California and Arizona. Its largest publications are the Los Angeles Daily Journal and the San Francisco Daily Journal. The Daily Journal newspapers have won numerous awards for its journalism, with the Los Angeles Press Club in 2003 noting that the Los Angeles Daily Journal was the most award-winning newspaper in Los Angeles with the sole exception of the Los Angeles Times.[5]";
const contactContent = "Main: 815-937-3300 Delivery Issues: 815-937-3322 or email circulation@daily-journal.com Send the newsroom a tip or press release: newsroom@daily-journal.com Send obituaries to: 1-815-937-3367 or email rsimpson@daily-journal.com";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
