// Image generation utility functions

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  imageData: string; // base64 encoded image data
  success: boolean;
  error?: string;
}

export const generateImageWithGemini = async (prompt: string): Promise<GenerateImageResponse> => {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const data = await response.json();
    return {
      imageData: data.imageData,
      success: true,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      imageData: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const downloadGeneratedImage = (imageData: string, filename?: string) => {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};