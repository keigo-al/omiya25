import React, {useRef, useEffect} from 'react';

const Canvas = ({drawings}) =>{
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas)return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawings.forEach(d =>{
      if(d.type === 'line' && Array.isArray(d.log)){
        ctx.beginPath();
        const log = d.log;
        
        for(let i = 0; i < log.length;i++){
          const point = log[i];
          if(i === 0){
            ctx.moveTo(point.x,point.y);
          }else{
            ctx.lineTo(point.x,point.y);
          }
        }

        ctx.strokeStyle = d.color || 'black';
        ctx.lineWidth = d.width || 2;
        ctx.stroke();
      }
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