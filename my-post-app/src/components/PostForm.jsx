import React, {useState} from "react";
import Sketch from "react-p5";
import { sendPostToServer } from "../api/postApi";

function PostForm(){
  const [text,setText]             = useState(""); //userのコメントの管理
  const [posts, setPosts]          = useState([]); //投稿された内容の配列
  const [drawingLog,setDrawingLog] = useState([]); //書いた線を点として記録，すべて点として記録されている，線で別れてない
  const [color,setColor] = useState("#000000");

  let isDrawing = false; //書いているのかどうかの判断


  //ここよくわからん，後からよく理解する
  const setup = (p5, canvasParentRef) =>{
    p5.createCanvas(400,300).parent(canvasParentRef);
    p5.background(255);
    window.p5Instance = p5;
  };

  const draw = (p5) => {
    if (p5.mouseIsPressed && p5.mouseY < 300){// マウス押す&&範囲内
      if (!isDrawing) isDrawing = true;
      p5.stroke(color);//色
      p5.strokeWeight(2);//太さ
      p5.line(p5.pmouseX,p5.pmouseY,p5.mouseX,p5.mouseY);//pmouse:ひとつ前の位置，mouse:今の位置

      setDrawingLog((prev)=>[
        ...prev,
        {x: p5.mouseX,y: p5.mouseY,time: p5.millis()},
      ]);//点の追加，時間ごとに
    }else{
      isDrawing = false;
    }
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    const canvas = document.querySelector("canvas");//HTML中の<canvas>要素の取得
    const imageData = canvas.toDataURL("image/png");//画像データとして保存

    const newPost = {
      id: Date.now(),
      text,
      image: imageData,
      log: drawingLog,
      color,
    };

    try{
      const response = await sendPostToServer(newPost);
      console.log("サーバの返答：",response);
      setPosts([response,...posts]);
    }catch(error){
      console.error("送信エラー：",error)
    }


    setText("");
    setDrawingLog([]);

    //画面を白くする処理
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);//キャンバスを一ピクセルずつ塗りつぶす

  };


  return (
    <div className = "p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
     {/*テキスト入力欄*/}
       {  /* 
        <textarea
          className="w-full p-2 border rounded"
          placeholder="write something"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      */}
      {/*色選択ツール*/ }
      <div className = "flex gap-2 mb-2">
        {
          ["#000000","#ff0000","#0000ff","#00cc00"].map((c) => (
            <button
              key = {c}
              onClick={() => setColor(c)}
              className="w-6 h-6 rounded-full border-2"
              style={{backgroundColor:c}}
              />
          ))
        }
      </div>
      <label className = "block">
        線の色:
        <input type = "color" value = {color} onChange = {(e) => setColor(e.target.value)}/>
      </label>
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


      {/*投稿一覧
      /*
      <div className="mt-6 space-y-2">
        {posts.map((post)=>(
          <div key = {post.id} className="p-3 border rounded bg-gray-50">
            <p>{post.text}</p>
            <img src={post.image} alt = "drawing"/>
          </div>
        ))}
      </div>
      */}
    </div>
  );
}

export default PostForm;
