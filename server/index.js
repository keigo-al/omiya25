const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/posts",(req,res)=>{
  console.log(req.body);
  res.status(200).json({
    message: "success",
    received: req.body,
    id: Date.now(),
  });
});


app.listen(PORT,()=>{
  console.log("now running");
});
