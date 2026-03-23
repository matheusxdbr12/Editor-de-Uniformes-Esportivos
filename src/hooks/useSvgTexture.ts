import { useState, useEffect } from 'react';
import * as THREE from 'three';

export function useSvgTexture(svgElementId: string, dependencies: any[]) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const svg = document.getElementById(svgElementId);
    if (!svg) return;

    // Clone the SVG node to modify it without affecting the DOM
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    
    // Set explicit high resolution width and height for sharp rasterization
    const texWidth = 1536; // 300 * 5.12
    const texHeight = 2048; // 400 * 5.12
    clonedSvg.setAttribute('width', texWidth.toString());
    clonedSvg.setAttribute('height', texHeight.toString());

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clonedSvg);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    let newTexture: THREE.CanvasTexture | null = null;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = texWidth;
      canvas.height = texHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        newTexture = new THREE.CanvasTexture(canvas);
        newTexture.anisotropy = 16;
        newTexture.colorSpace = THREE.SRGBColorSpace;
        newTexture.minFilter = THREE.LinearMipmapLinearFilter;
        newTexture.magFilter = THREE.LinearFilter;
        newTexture.generateMipmaps = true;
        
        setTexture(prev => {
          if (prev) prev.dispose();
          return newTexture;
        });
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;

    return () => {
      // We don't dispose here immediately because the next render might still need it
      // Disposal is handled in the setTexture callback
    };
  }, dependencies);

  return texture;
}
