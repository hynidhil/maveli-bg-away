// Mobile utility functions for better mobile browser support

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const getMobileFileSizeLimit = (): number => {
  if (isMobile()) {
    return 3 * 1024 * 1024; // 3MB for mobile
  }
  return 10 * 1024 * 1024; // 10MB for desktop
};

export const getMobileImageDimensionLimit = (): number => {
  if (isMobile()) {
    return 1536; // 1536px for mobile
  }
  return 4096; // 4096px for desktop
};

export const optimizeImageForMobile = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!isMobile()) {
      resolve(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const maxDimension = getMobileImageDimensionLimit();
      let { width, height } = img;
      
      // Resize if too large
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(optimizedFile);
        } else {
          reject(new Error('Failed to optimize image'));
        }
      }, file.type, 0.8); // 80% quality for mobile
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(file);
  });
};

export const createMobileFileInput = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  
  // Mobile-specific attributes
  if (isMobile()) {
    input.setAttribute('capture', 'environment'); // Use back camera on mobile
  }
  
  return input;
};

export const triggerMobileFileUpload = (inputId: string): void => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (input) {
    // Clear previous value to ensure change event fires
    input.value = '';
    input.click();
  }
};

export const addMobileTouchHandlers = (element: HTMLElement, callback: () => void): void => {
  if (!isMobile()) return;

  let touchStartTime = 0;
  const touchDuration = 200; // ms

  element.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
    e.preventDefault();
  }, { passive: false });

  element.addEventListener('touchend', (e) => {
    const touchEndTime = Date.now();
    if (touchEndTime - touchStartTime < touchDuration) {
      e.preventDefault();
      callback();
    }
  }, { passive: false });
};

export const getMobileErrorMessage = (error: Error): string => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('timeout')) {
    return 'Processing took too long. Please try with a smaller image or check your internet connection.';
  }
  
  if (errorMessage.includes('quota') || errorMessage.includes('api')) {
    return 'Service temporarily unavailable. Please try again in a moment.';
  }
  
  if (errorMessage.includes('size') || errorMessage.includes('large')) {
    return 'Image too large for mobile processing. Please use a smaller image (under 3MB).';
  }
  
  if (errorMessage.includes('format')) {
    return 'Unsupported image format. Please use JPG, PNG, or WEBP.';
  }
  
  if (errorMessage.includes('memory')) {
    return 'Not enough memory to process this image. Please try a smaller image.';
  }
  
  return 'Failed to process image. Please try again with a different image.';
};
