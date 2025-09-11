
export const addWatermarkToImage = (imageUrl: string, watermarkText: string = "ClearPix"): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(imageUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark
      const fontSize = Math.max(20, canvas.width / 30);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      
      const text = watermarkText;
      const textWidth = ctx.measureText(text).width;
      const x = canvas.width - textWidth - 20;
      const y = canvas.height - 30;
      
      // Draw text with outline
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageUrl;
  });
};
