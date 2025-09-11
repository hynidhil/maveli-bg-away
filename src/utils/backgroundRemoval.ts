import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting advanced background removal with RMBG-1.4...');
    
    // Use RMBG-1.4 model which is specifically designed for high-quality background removal
    const segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/png', 1.0);
    console.log('Image converted to base64');
    
    // Process the image with the advanced segmentation model
    console.log('Processing with RMBG-1.4 model...');
    const result = await segmenter(imageData);
    
    console.log('Advanced segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Invalid segmentation result from RMBG model');
    }

    // Find the subject mask (RMBG model provides better structure)
    let mask = null;
    if (result[0].mask) {
      mask = result[0].mask;
    } else {
      // Try different result structures
      for (const item of result) {
        if (item.mask) {
          mask = item.mask;
          break;
        }
      }
    }
    
    if (!mask || !mask.data) {
      throw new Error('No valid mask found in segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask with improved processing for fine edges
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Apply the mask to alpha channel with better threshold handling for fine details
    const maskData = mask.data;
    const threshold = 0.3; // Lower threshold for better edge detection
    
    for (let i = 0; i < maskData.length; i++) {
      const maskValue = maskData[i];
      let alpha;
      
      if (maskValue > threshold) {
        // Keep the pixel (subject) with anti-aliasing
        alpha = Math.min(255, Math.round(maskValue * 255));
      } else {
        // Remove the pixel (background)
        alpha = 0;
      }
      
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Advanced mask applied successfully with improved edge handling');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob with advanced background removal');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error in advanced background removal:', error);
    throw new Error('Background removal failed. Please try again with a different image.');
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
