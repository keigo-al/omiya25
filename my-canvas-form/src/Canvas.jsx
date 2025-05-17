import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ sketches }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sketches.length === 0 || isDrawing) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setIsDrawing(true);

    let sketchIndex = 0;
    let lineIndex = 0;

    const drawNext = () => {
      if (sketchIndex >= sketches.length) {
        setIsDrawing(false);
        return;
      }

      const currentSketch = sketches[sketchIndex];
      const lines = currentSketch.lines;
      const animate = currentSketch.animate;

      // 静止画モード（一発描画）
      if (!animate) {
        lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.start_x, line.start_y);
          ctx.lineTo(line.end_x, line.end_y);
          ctx.strokeStyle = line.color || '#000000';
          ctx.lineWidth = line.thickness || 2;
          ctx.stroke();
        });
        sketchIndex++;
        setTimeout(drawNext, 0); // 次のスケッチへ
        return;
      }

      // アニメーションモード
      if (lineIndex < lines.length) {
        const line = lines[lineIndex];
        ctx.beginPath();
        ctx.moveTo(line.start_x, line.start_y);
        ctx.lineTo(line.end_x, line.end_y);
        ctx.strokeStyle = line.color || '#000000';
        ctx.lineWidth = line.thickness || 2;
        ctx.stroke();

        lineIndex++;
        setTimeout(drawNext, 30);
      } else {
        lineIndex = 0;
        sketchIndex++;
        setTimeout(drawNext, 100); // 次のスケッチまで少し休む
      }
    };

    drawNext();
  }, [sketches]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid #ccc', marginTop: '1rem' }}
    />
  );
};

export default Canvas;
