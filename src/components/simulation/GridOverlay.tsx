import { useMemo } from "react";
import { TilingSprite } from '@pixi/react';
import * as PIXI from 'pixi.js';

const GridOverlay = ({width, height}: {width: number, height: number}) => { 
  const gridTexture = useMemo(() => { 
      const canvas = document.createElement('canvas'); 
      const gridSize = 40; 
      canvas.width = gridSize; 
      canvas.height = gridSize; 
      const ctx = canvas.getContext('2d'); 
      if (ctx) { 
          ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)'; 
          ctx.beginPath(); 
          ctx.moveTo(gridSize, 0); 
          ctx.lineTo(gridSize, gridSize); 
          ctx.lineTo(0, gridSize); 
          ctx.stroke(); 
      } 
      return PIXI.Texture.from(canvas); 
  }, []); 
  
  return <TilingSprite texture={gridTexture} width={width} height={height} tilePosition={{ x: 0, y: 0 }} />; 
};

export default GridOverlay;