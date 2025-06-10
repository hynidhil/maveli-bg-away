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
    console.log('Starting advanced background removal process...');
    
    // Use RMBG-1.4 model which is specifically designed for background removal
    const segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
      device: 'wasm',
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

    // Find the person/subject mask (RMBG model returns different structure)
    let mask = null;
    if (result[0].mask) {
      mask = result[0].mask;
    } else {
      // Try to find the mask in the result structure
      for (const item of result) {
        if (item.label && (item.label.toLowerCase().includes('person') || item.label.toLowerCase().includes('subject')) && item.mask) {
          mask = item.mask;
          break;
        }
      }
      // If no specific label found, use the first available mask
      if (!mask && result[0].mask) {
        mask = result[0].mask;
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
    
    // Apply the mask with improved processing
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply the mask to alpha channel with better threshold handling
    const maskData = mask.data;
    const threshold = 0.5; // Threshold for better edge detection
    
    for (let i = 0; i < maskData.length; i++) {
      // Use the mask value directly (RMBG model provides better masks)
      const maskValue = maskData[i];
      let alpha;
      
      if (maskValue > threshold) {
        // Keep the pixel (subject)
        alpha = Math.min(255, Math.round(maskValue * 255));
      } else {
        // Remove the pixel (background)
        alpha = 0;
      }
      
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Advanced mask applied successfully');
    
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
    
    // Fallback to the previous segmentation model if RMBG fails
    console.log('Falling back to segformer model...');
    try {
      const fallbackSegmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'wasm',
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      resizeImageIfNeeded(canvas, ctx, imageElement);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      const result = await fallbackSegmenter(imageData);
      
      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Fallback segmentation also failed');
      }
      
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) throw new Error('Could not get output canvas context');
      
      outputCtx.drawImage(canvas, 0, 0);
      const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const data = outputImageData.data;
      
      for (let i = 0; i < result[0].mask.data.length; i++) {
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }
      
      outputCtx.putImageData(outputImageData, 0, 0);
      
      return new Promise((resolve, reject) => {
        outputCanvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('Fallback processing completed');
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob with fallback'));
            }
          },
          'image/png',
          1.0
        );
      });
    } catch (fallbackError) {
      console.error('Both advanced and fallback methods failed:', fallbackError);
      throw new Error('Background removal failed completely');
    }
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
