import React, {useRef, useEffect} from 'react';

const Canvas = ({drawings}) => {
  const canvasRef = useRef(null);

  useEffect(()=> {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    drawings.forEach(d => {
      if(d.type === 'circle'){
        ctx.beginPath();
        ctx.arc(d.x,d.y,d.radius,0,Math.PI*2);
        ctx.fillStyle = d.color || 'black';
        ctx.fill();
      }
    });
  },[drawings]);
  
  return (
    <canvas
      ref = {canvasRef}
      width={800}
      height={600}
      style={{border: '1px solid ###ccc',marginTop: '10px'}}
    />
  );
};

export default Canvas;