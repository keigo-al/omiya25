import React, { useState } from "react";
import Sketch from "react-p5";

export default function PostForm() {
  const [drawingLog, setDrawingLog] = useState([]);
  const [color, setColor]           = useState("#000000");
  const [thickness, setThickness]   = useState(2);

  let isDrawing = false;

  // p5 setup
  const setup = (p5, parentRef) => {
    if (window.p5Instance) window.p5Instance.remove();
    const canvas = p5.createCanvas(800, 600).parent(parentRef);
    p5.background(255);
    window.p5Instance = p5;
  };

  // 毎フレームの描画＆ログ収集
  const draw = (p5) => {
    if (p5.mouseIsPressed && p5.mouseY >= 0 && p5.mouseY <= 600) {
      if (!isDrawing) isDrawing = true;
      p5.stroke(color);
      p5.strokeWeight(thickness);
      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
      setDrawingLog(prev => [...prev, { x: p5.mouseX, y: p5.mouseY }]);
    } else {
      isDrawing = false;
    }
  };

  // 新規スケッチID取得
  const createSketch = async () => {
    const res = await fetch("http://172.31.91.184:5000/api/create_sketch", { method: "POST" });
    if (!res.ok) throw new Error("create_sketch failed");
    return (await res.json()).sketch_id;
  };

  // 点ログを線分オブジェクトに変換
  const convertLogToLines = (log) => {
    const lines = [];
    for (let i = 1; i < log.length; i++) {
      lines.push({
        start_x:  log[i-1].x,
        start_y:  log[i-1].y,
        end_x:    log[i].x,
        end_y:    log[i].y,
        color,
        thickness,
      });
    }
    return lines;
  };

  // 線分をサーバに保存
  const saveLines = async (sketch_id, lines) => {
    const res = await fetch("http://172.31.91.184:5000/api/save_lines", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ sketch_id, lines }),
    });
    if (!res.ok) console.error("save_lines failed:", await res.text());
  };

  // マウス／指を離した瞬間の自動投稿処理
  const mouseReleased = async (p5) => {
    if (drawingLog.length < 2) {
      setDrawingLog([]);       // 点数不足ならリセットだけ
      return;
    }
    try {
      const sketch_id = await createSketch();
      const lines     = convertLogToLines(drawingLog);
      await saveLines(sketch_id, lines);
    } catch (err) {
      console.error("送信エラー:", err);
    }
    // リセット
    setDrawingLog([]);
    p5.background(255);
  };

  return (
    <div style={{
      padding: 16,
      maxWidth: '100vw',
      minHeight: '100vh',
      backgroundColor: '#F3E8FF',
      boxSizing: 'border-box'
    }}>
      {/* コントロール */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 24 }}>
        {/* 色 */}
        <div>
          <strong>線の色</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {['#000000','#ff0000','#0000ff','#00cc00'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: color===c ? '2px solid #3B82F6' : '1px solid #ccc',
                  backgroundColor: c
                }}
              />
            ))}
          </div>
        </div>
        {/* 太さ */}
        <div>
          <strong>線の太さ</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[1,2,4,6,8,10].map(w => (
              <button
                key={w}
                type="button"
                onClick={() => setThickness(w)}
                style={{
                  padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4,
                  backgroundColor: thickness===w ? '#3B82F6' : 'transparent',
                  color: thickness===w ? '#fff' : '#000'
                }}
              >{w}px</button>
            ))}
          </div>
        </div>
      </div>

      {/* キャンバス */}
      <div style={{
        width: 800,
        height: 600,
        border: '4px solid #FFBB00',
        borderRadius: 8,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backgroundColor: '#FEF3C7',
        touchAction: 'pan-x pinch-zoom',
        overscrollBehaviorY: 'contain'
      }}>
        <Sketch
          setup={setup}
          draw={draw}
          mouseReleased={mouseReleased}
        />
      </div>
    </div>
  );
}
