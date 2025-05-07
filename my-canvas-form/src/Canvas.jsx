import React, {useRef, useEffect} from 'react';

const Canvas = ({drawings}) =>{
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas)return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawings.forEach(d =>{
      if(d.type === 'circle'){
        ctx.
      }
    })
  })
}