const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


let posts = [];


app.post("/api/posts",(req,res)=>{
  const newPost = {
    id: Date.now(),
    ...req.body // ← ここがポイント！
  };


  posts.unshift(newPost); // 新しい投稿を先頭に追加
  console.log("新しい投稿:", newPost);
  res.status(200).json(newPost);

});

app.get("/api/posts",(req,res) =>{
  res.status(200).json(posts);
})


app.listen(PORT,()=>{
  console.log("now running");
});
