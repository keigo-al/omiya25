import React, { useRef, useEffect } from 'react';

const Canvas = ({ lines }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(line => {
      const { start_x, start_y, end_x, end_y } = line;
      if (
        typeof start_x !== 'number' || typeof start_y !== 'number' ||
        typeof end_x !== 'number' || typeof end_y !== 'number'
      ) return;

      ctx.beginPath();
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(end_x, end_y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
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
