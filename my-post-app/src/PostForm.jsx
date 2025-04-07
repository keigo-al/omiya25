import React, {useState} from "react";
import Sketch from "react-p5";

function PostForm(){
  const [text,setText]             = useState("");
  const [posts, setPosts]          = useState([]);
  const [drawingLog,setDrawingLog] = useState([]);

  let isDrawing = false;

  const setup = (p5, canvasParentRef) =>{
    p5.createCanvas(400,300).parent(canvasParentRef);
    p5.background(255);
    window.p5Instance = p5;
  };

  const draw = (p5) => {
    if (p5.mouseIsPressed && p5.mouseY < 300){
      if (!isDrawing) isDrawing = true;
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.line(p5.pmouseX,p5.pmouseY,p5.mouseX,p5.mouseY);

      setDrawingLog((prev)=>[
        ...prev,
        {x: p5.mouseX,y: p5.mouseY,time: p5.millis()},
      ]);
    }else{
      isDrawing = false;
    }
  };


const handleSubmit = (e) => {
  e.preventDefault();

  const canvas = document.querySelector("canvas");
  const imageData = canvas.toDataURL("image/png");

  const newPost = {
    id: Date.now(),
    text,
      image: imageData,
      log: drawingLog,
    };

    setPosts([newPost,...posts]);
    setText("");
    setDrawingLog([]);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

  };


  return (
    <div className = "p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/*テキスト入力欄*/}
        <textarea
          className="w-full p-2 border rounded"
          placeholder="write something"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/*お絵描きキャンバス*/ }
        <Sketch setup={setup} draw = {draw}/>

        {/*投稿ボタン */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type="submit"
        >
          投稿
        </button>

      </form>


      {/*投稿一覧*/}
      <div className="mt-6 space-y-2">
        {posts.map((post)=>(
          <div key = {post.id} className="p-3 border rounded bg-gray-50">
            <p>{post.text}</p>
            <img src={post.image} alt = "drawing"/>
          </div>
        ))}
      </div>
    </div>



  );
}

export default PostForm;