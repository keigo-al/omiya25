import React, { useState } from "react";
import Sketch from "react-p5";
import { sendPostToServer } from "../api/postApi";

function PostForm() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [drawingLog, setDrawingLog] = useState([]);
  const [color, setColor] = useState("#000000");
  const [thickness,setThickness] = useState(2);

  let isDrawing = false;

  const setup = (p5, canvasParentRef) => {
    // すでに存在するインスタンスがあれば削除
    if (window.p5Instance) {
      window.p5Instance.remove();
    }

    const canvas = p5.createCanvas(400, 300).parent(canvasParentRef);
    canvas.style("width", "800px");
    canvas.style("height", "600px");

    p5.background(255); // 白背景
    window.p5Instance = p5;
  };

  const draw = (p5) => {
    if (
      p5.mouseIsPressed &&
      p5.mouseY < 600 &&
      p5.mouseX < 800 &&
      p5.mouseX >= 0 &&
      p5.mouseY >= 0
    ) {
      if (!isDrawing) isDrawing = true;
      p5.stroke(color);
      p5.strokeWeight(thickness);
      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);

      setDrawingLog((prev) => [
        ...prev,
        { x: p5.mouseX, y: p5.mouseY, time: p5.millis() },
      ]);
    } else {
      isDrawing = false;
    }
  };

  const createSketch = async () => {
    const res = await fetch("http://172.31.91.184:5000/api/create_sketch", {
      method: "POST",
    });
    const data = await res.json();
    return data.sketch_id;
  };

  const convertLogToLines = (log) => {
    const lines = [];
    for (let i = 1; i < log.length; i++) {
      lines.push({
        start_x: log[i - 1].x,
        start_y: log[i - 1].y,
        end_x: log[i].x,
        end_y: log[i].y,
        color,
        thickness,
      });
    }
    return lines;
  };

  const saveLines = async (sketch_id, lines) => {
    await fetch("http://172.31.91.184:5000/api/save_lines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sketch_id, lines}),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const canvas = document.querySelector("canvas");
    const imageData = canvas.toDataURL("image/png");

    const newPost = {
      id: Date.now(),
      text,
      image: imageData,
      log: drawingLog,
      color,
      thickness,
    };

    try {
      const sketch_id = await createSketch();
      const lines = convertLogToLines(drawingLog);
      console.log(lines);
      await saveLines(sketch_id, lines);
    } catch (error) {
      console.error("送信エラー:", error);
    }

    setText("");
    setDrawingLog([]);

    // Canvasを白でリセット
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

 return (
  <div
    style={{
      padding: '16px',
      maxWidth: '900px',
      //margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F3E8FF',
    }}
  >
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* キャンバスとコントロールを横並び */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
        }}
      >
        {/* 左：キャンバス */}
        <div
          style={{
            width: '800px',
            height: '600px',
            backgroundColor: '#FEF3C7',
            padding: '8px',
            border: '4px solid #FFBB00',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            touchAction: 'pan-x pinch-zoom',
            overscrollBehaviorY: 'contain',
          }}
        >
          <Sketch setup={setup} draw={draw} />
        </div>

        {/* 右：色と太さのコントロール */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 色選択 */}
          <div>
            <div
              style={{
                fontWeight: '500',
                marginBottom: '8px',
              }}
            >
              線の色
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#000000', '#ff0000', '#0000ff', '#00cc00'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: color === c ? '2px solid #3B82F6' : '1px solid #ccc',
                    backgroundColor: c,
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginTop: '8px', width: '100%' }}
            />
          </div>

          {/* 太さ選択 */}
          <div>
            <div
              style={{
                fontWeight: '500',
                marginBottom: '8px',
              }}
            >
              線の太さ
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 4, 6, 8, 10].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setThickness(w)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: thickness === w ? '#3B82F6' : 'transparent',
                    color: thickness === w ? '#fff' : '#000',
                  }}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 投稿ボタン */}
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: '#3B82F6',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        投稿
      </button>
    </form>
  </div>
);

}

export default PostForm;