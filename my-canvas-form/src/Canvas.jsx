import React, {useRef, useEffect} from 'react';

const Canvas = ({posts}) =>{
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas)return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    posts.forEach(post =>{
      const log = post.log;
      if(!log || log.length < 2)return;

      ctx.beginPath();
      ctx.moveTo(log[0].x,log[0].y);
      for(let i = 1; i < log.length; i++){
        ctx.lineTo(log[i].x,log[i].y);
      }

      ctx.strokeStyle = d.color || 'black';
      ctx.lineWidth = d.width || 2;
      ctx.stroke();
    });
  },[drawings]);
  
  return(
    <canvas
      ref = {canvasRef}
      width = {800}
      height = {600}
      style = {{border: '1px solid #ccc', marginTop:'1rem'}}
    />
  );
};

export default Canvas;