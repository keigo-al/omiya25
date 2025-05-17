import React, { useRef, useEffect, useState } from 'react';


const Canvas = ({ lines }) => {
  const canvasRef = useRef(null);
  const [isDrawing,setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(isDrawing || lines.length === 0) return;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setIsDrawing(true);

    let index = 0;

    const drawNext = () => {
      if (index >= lines.length){
        setIsDrawing(false);
        return;
      } 

      const line = lines[index];
      ctx.beginPath();
      ctx.moveTo(line.start_x, line.start_y);
      ctx.lineTo(line.end_x, line.end_y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      index++;
      setTimeout(drawNext, 30); // 30ms 間隔で次の線へ
    };

    drawNext();
  }, [lines]);

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
