import React, { useState, useRef } from 'react';
import { useAppContext } from '../store';
import { SHIRT_PATHS } from '../constants';
import { Shirt3D } from './Shirt3D';
import { Box, Layers, SplitSquareHorizontal } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const {
    category, model, side, setSide,
    mainColor, secondaryColor, pattern,
    layers, selectedLayerId, setSelectedLayerId, updateLayer,
    viewMode, setViewMode
  } = useAppContext();

  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const paths = SHIRT_PATHS[category]?.[model] || SHIRT_PATHS['football']['round-neck'];
  const baseShape = side === 'front' ? paths.front : paths.back;
  const collarShape = side === 'front' ? paths.collarFront : paths.collarBack;

  const currentLayers = layers.filter(l => l.side === side && l.visible).sort((a, b) => a.zIndex - b.zIndex);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedLayerId(id);
    setDraggingId(id);
    
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    const layer = layers.find(l => l.id === id);
    if (layer) {
      setDragOffset({ x: cursorPt.x - layer.x, y: cursorPt.y - layer.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !svgRef.current) return;
    
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    updateLayer(draggingId, {
      x: cursorPt.x - dragOffset.x,
      y: cursorPt.y - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleSvgClick = () => {
    setSelectedLayerId(null);
  };

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
      
      {/* View Toggle (Front/Back) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-md flex p-1 z-10 transition-colors">
        <button 
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${side === 'front' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={() => setSide('front')}
        >
          Frente
        </button>
        <button 
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${side === 'back' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={() => setSide('back')}
        >
          Costas
        </button>
      </div>

      {/* 2D / 3D Mode Toggle */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex p-1 z-10 transition-colors">
        <button 
          className={`p-2 rounded-md transition-colors ${viewMode === '3d' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          onClick={() => setViewMode('3d')}
          title="VisualizaÃ§Ã£o 3D"
        >
          <Box size={20} />
        </button>
        <button 
          className={`p-2 rounded-md transition-colors ${viewMode === 'split' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          onClick={() => setViewMode('split')}
          title="VisÃ£o Dividida (2D + 3D)"
        >
          <SplitSquareHorizontal size={20} />
        </button>
        <button 
          className={`p-2 rounded-md transition-colors ${viewMode === '2d' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          onClick={() => setViewMode('2d')}
          title="EdiÃ§Ã£o 2D Precisa"
        >
          <Layers size={20} />
        </button>
      </div>

      <div className={`w-full h-full flex ${viewMode === 'split' ? 'flex-row' : ''}`}>
        {/* 3D View */}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2 border-r border-gray-300 dark:border-gray-700' : 'w-full'} h-full relative`}>
            <Shirt3D />
          </div>
        )}

        {/* 2D Canvas / SVG Container */}
        <div 
          className={
            viewMode === '2d' 
              ? 'w-full h-full flex items-center justify-center p-8 relative z-0'
              : viewMode === 'split'
              ? 'w-1/2 h-full flex items-center justify-center p-8 relative z-0 bg-gray-50 dark:bg-gray-800/50'
              : 'absolute bottom-4 right-4 w-64 h-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 p-2 overflow-hidden flex flex-col'
          }
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {viewMode === '3d' && (
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center border-b border-gray-100 dark:border-gray-700 pb-1">
              Minimapa 2D (EditÃ¡vel)
            </div>
          )}
          <svg 
            id="shirt-svg"
            ref={svgRef}
            viewBox="0 0 300 400" 
            className={`drop-shadow-2xl ${viewMode === '3d' ? 'w-full h-full' : 'max-h-full max-w-full'}`}
            onClick={handleSvgClick}
            style={viewMode !== '3d' ? { height: '80vh' } : {}}
          >
            <defs>
              {/* Patterns */}
              <pattern id="pattern-stripes" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill={mainColor} />
                <rect width="10" height="20" fill={secondaryColor} fillOpacity="0.3" />
              </pattern>
              <linearGradient id="pattern-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={mainColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </linearGradient>
              
              {/* Clip Path for layers to stay inside shirt */}
              <clipPath id="shirt-clip">
                <path d={baseShape} />
              </clipPath>
            </defs>

            {/* Base Shirt */}
            <path 
              d={baseShape} 
              fill={pattern === 'solid' ? mainColor : pattern === 'stripes' ? 'url(#pattern-stripes)' : 'url(#pattern-gradient)'} 
              stroke="#000000" 
              strokeWidth="1" 
              strokeOpacity="0.1"
            />
            
            {/* Collar/Details */}
            {collarShape && (
              <path 
                d={collarShape} 
                fill={secondaryColor} 
              />
            )}

            {/* Layers Container (Clipped to shirt) */}
            <g clipPath="url(#shirt-clip)">
              {currentLayers.map(layer => (
                <g 
                  key={layer.id}
                  transform={`translate(${layer.x}, ${layer.y}) rotate(${layer.rotation}, ${layer.width/2}, ${layer.height/2})`}
                  onMouseDown={(e) => !layer.locked && handleMouseDown(e, layer.id)}
                  style={{ 
                    cursor: layer.locked ? 'default' : draggingId === layer.id ? 'grabbing' : 'grab', 
                    opacity: layer.opacity ?? 1,
                    mixBlendMode: layer.blendMode || 'normal'
                  }}
                >
                  {/* Selection Highlight */}
                  {selectedLayerId === layer.id && !layer.locked && (
                    <rect 
                      x="-2" y="-2" 
                      width={layer.width + 4} 
                      height={layer.height + 4} 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="2" 
                      strokeDasharray="4"
                    />
                  )}

                  {layer.type === 'text' ? (
                    <text 
                      x={layer.width / 2} 
                      y={layer.height / 2} 
                      fill={layer.color}
                      fontFamily={layer.font}
                      fontSize={layer.height}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ userSelect: 'none' }}
                    >
                      {layer.content}
                    </text>
                  ) : (
                    <image 
                      href={layer.content} 
                      width={layer.width} 
                      height={layer.height} 
                      preserveAspectRatio="none"
                    />
                  )}
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
