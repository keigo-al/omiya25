import React, { useState } from "react";
import Sketch from "react-p5";
import { sendPostToServer } from "../api/postApi";

function PostForm() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [drawingLog, setDrawingLog] = useState([]);
  const [color, setColor] = useState("#000000");

  let isDrawing = false;

  const setup = (p5, canvasParentRef) => {
    // すでに存在するインスタンスがあれば削除
    if (window.p5Instance) {
      window.p5Instance.remove();
    }

    const canvas = p5.createCanvas(400, 300).parent(canvasParentRef);
    canvas.style("width", "400px");
    canvas.style("height", "300px");

    p5.background(255); // 白背景
    window.p5Instance = p5;
  };

  const draw = (p5) => {
    if (
      p5.mouseIsPressed &&
      p5.mouseY < 300 &&
      p5.mouseX < 400 &&
      p5.mouseX >= 0 &&
      p5.mouseY >= 0
    ) {
      if (!isDrawing) isDrawing = true;
      p5.stroke(color);
      p5.strokeWeight(2);
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
    const res = await fetch("http://localhost:5000/api/create_sketch", {
      method: "POST",
    });
    const data = await res.json();
    return data.Sketch_id;
  };

  const convertLogToLines = (log) => {
    const lines = [];
    for (let i = 1; i < log.length; i++) {
      lines.push({
        start_x: log[i - 1].x,
        start_y: log[i - 1].y,
        end_x: log[i].x,
        end_y: log[i].y,
      });
    }
    return lines;
  };

  const saveLines = async (sketch_id, lines) => {
    await fetch("http://localhost:5000/api/save_lines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sketch_id, lines }),
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
  <div className="p-4 max-w-md mx-auto bg-purple-50 min-h-screen">
    <form onSubmit={handleSubmit} className="space-y-2">
        {/* 色選択ツール */}
        <div className="flex gap-2 mb-2">
          {["#000000", "#ff0000", "#0000ff", "#00cc00"].map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.preventDefault();
                setColor(c);
              }}
              className="w-6 h-6 rounded-full border-2"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <label className="block">
          線の色:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        {/* キャンバス */}
        <div className="w-[400px] h-[300px]">
          <Sketch setup={setup} draw={draw} />
        </div>

        {/* 投稿ボタン */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type="submit"
        >
          投稿
        </button>
      </form>
    </div>
  );
}

export default PostForm;