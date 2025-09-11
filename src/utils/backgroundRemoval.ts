// Professional background removal using Remove.bg API
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB limit for Remove.bg API

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting professional background removal with Remove.bg API...');
    
    const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
    if (!apiKey) {
      throw new Error('Remove.bg API key not configured. Please check your environment configuration.');
    }

    // Convert image to canvas first to get proper format and size
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Set canvas dimensions to match image
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0);
    
    // Convert canvas to blob
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image to blob'));
          }
        },
        'image/png',
        0.9
      );
    });

    // Check file size
    if (imageBlob.size > MAX_FILE_SIZE) {
      throw new Error('Image file is too large. Please use an image smaller than 12MB.');
    }

    console.log(`Processing image with Remove.bg API (${Math.round(imageBlob.size / 1024)}KB)...`);

    // Prepare form data for Remove.bg API
    const formData = new FormData();
    formData.append('image_file', imageBlob, 'image.png');
    formData.append('size', 'auto');
    formData.append('format', 'png');
    formData.append('type', 'auto');
    formData.append('crop', 'false');
    formData.append('add_shadow', 'false');
    formData.append('semitransparency', 'true');
    formData.append('channels', 'rgba');
    formData.append('roi', '0% 0% 100% 100%');
    formData.append('position', 'center');

    // Make API request to Remove.bg
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].title || errorMessage;
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      
      // Handle specific error cases
      if (response.status === 402) {
        errorMessage = 'API quota exceeded. Please check your Remove.bg account credits.';
      } else if (response.status === 403) {
        errorMessage = 'Invalid API key. Please check your Remove.bg API key.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid image format or size. Please try a different image.';
      }
      
      throw new Error(errorMessage);
    }

    // Get the processed image as blob
    const processedBlob = await response.blob();
    
    if (processedBlob.size === 0) {
      throw new Error('Received empty response from Remove.bg API');
    }

    console.log('Background removal completed successfully with Remove.bg API');
    return processedBlob;

  } catch (error) {
    console.error('Error in Remove.bg background removal:', error);
    
    // Fallback to local processing if API fails
    console.log('Falling back to local background removal...');
    return await removeBackgroundLocal(imageElement);
  }
};

// Fallback local background removal using Hugging Face transformers
const removeBackgroundLocal = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting local background removal fallback...');
    
    // Dynamic import to avoid loading if not needed
    const { pipeline } = await import('@huggingface/transformers');
    
    // Use a lightweight model for fallback
    const segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic', {
      quantized: true,
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize if too large for local processing
    let width = imageElement.naturalWidth;
    let height = imageElement.naturalHeight;
    const maxDimension = 512;
    
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/png', 1.0);
    
    // Process the image
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('No segmentation result');
    }

    // Find the best mask
    let mask = null;
    for (const item of result) {
      if (item.label && (item.label.includes('person') || item.label.includes('LABEL_0')) && item.mask) {
        mask = item.mask;
        break;
      }
    }
    
    if (!mask && result[0] && result[0].mask) {
      mask = result[0].mask;
    }
    
    if (!mask || !mask.data) {
      throw new Error('No valid mask found');
    }
    
    // Apply mask
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    outputCtx.drawImage(canvas, 0, 0);
    
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    const maskData = mask.data;
    
    for (let i = 0; i < maskData.length; i++) {
      const maskValue = maskData[i];
      data[i * 4 + 3] = maskValue > 0.5 ? Math.min(255, Math.round(maskValue * 255)) : 0;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Local background removal completed');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from local processing'));
          }
        },
        'image/png',
        1.0
      );
    });
    
  } catch (error) {
    console.error('Local background removal failed:', error);
    throw new Error('Background removal failed. Please try again with a different image.');
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(file);
  });
};