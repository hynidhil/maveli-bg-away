import React, { useState, useRef } from 'react';
import { Upload, X, Download, Pencil, Loader, RotateCcw, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';

interface ImageData {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  isProcessing: boolean;
  error: string | null;
}

const BatchImageUploader = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [showManualEditor, setShowManualEditor] = useState<string | null>(null);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState<{ [key: string]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 3;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - images.length} more.`);
      return;
    }

    const newImages: ImageData[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      isProcessing: false,
      error: null,
    }));

    setImages(prev => [...prev, ...newImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - images.length} more.`);
      return;
    }

    const newImages: ImageData[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      isProcessing: false,
      error: null,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processBackgroundRemoval = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isProcessing: true, error: null } : img
    ));

    try {
      const imageElement = await loadImage(image.file);
      const processedBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(processedBlob);

      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, processedUrl, isProcessing: false }
          : img
      ));
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, isProcessing: false, error: 'Failed to remove background' }
          : img
      ));
    }
  };

  const deleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const resetImage = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, processedUrl: null, error: null }
        : img
    ));
  };

  const clearAll = () => {
    setImages([]);
  };

  const downloadImage = (imageUrl: string, filename: string, quality: 'low' | 'medium' | 'high') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Adjust resolution based on quality
      switch (quality) {
        case 'low':
          width = Math.min(width, 800);
          height = Math.min(height, 600);
          break;
        case 'medium':
          width = Math.min(width, 1920);
          height = Math.min(height, 1080);
          break;
        case 'high':
          // Keep original resolution
          break;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      if (image.processedUrl) {
        downloadImage(image.processedUrl, `processed-image-${index + 1}.png`, 'high');
      }
    });
  };

  const toggleComparison = (imageId: string) => {
    setShowComparison(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const handleManualEditComplete = (imageId: string, editedImageUrl: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, processedUrl: editedImageUrl } : img
    ));
    setShowManualEditor(null);
  };

  const handleBackgroundEffectApplied = (imageId: string, imageWithBackground: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, processedUrl: imageWithBackground } : img
    ));
    setShowBackgroundEffects(null);
  };

  const manualEditorImage = images.find(img => img.id === showManualEditor);
  const backgroundEffectsImage = images.find(img => img.id === showBackgroundEffects);

  if (showManualEditor && manualEditorImage) {
    return (
      <ManualEditor
        imageUrl={manualEditorImage.originalUrl}
        onComplete={(editedUrl) => handleManualEditComplete(showManualEditor, editedUrl)}
        onCancel={() => setShowManualEditor(null)}
      />
    );
  }

  if (showBackgroundEffects && backgroundEffectsImage) {
    return (
      <BackgroundEffects
        processedImageUrl={backgroundEffectsImage.processedUrl || backgroundEffectsImage.originalUrl}
        originalImageUrl={backgroundEffectsImage.originalUrl}
        onApply={(imageWithBg) => handleBackgroundEffectApplied(showBackgroundEffects, imageWithBg)}
        onCancel={() => setShowBackgroundEffects(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Upload Section */}
      <div className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div 
          className="border-2 border-dashed border-green-500/30 rounded-lg p-12 cursor-pointer hover:border-green-500/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Upload up to {MAX_IMAGES} images ({images.length}/{MAX_IMAGES})
              </p>
              <p className="text-muted-foreground">Click here or drag and drop your images</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      {images.length > 0 && (
        <div className="flex justify-center gap-4">
          <Button onClick={clearAll} variant="outline" className="text-red-500 border-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button 
            onClick={downloadAll} 
            disabled={images.every(img => !img.processedUrl)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-card rounded-lg border p-4 space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={showComparison[image.id] && image.processedUrl ? image.processedUrl : image.originalUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                {/* Comparison Toggle */}
                {image.processedUrl && (
                  <Button
                    onClick={() => toggleComparison(image.id)}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white/90"
                  >
                    {showComparison[image.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                )}

                {/* Manual Edit Button */}
                <Button
                  onClick={() => setShowManualEditor(image.id)}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 left-2 bg-white/90"
                  title="Manual editing tool"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              {/* Processing State */}
              {image.isProcessing && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}

              {/* Error State */}
              {image.error && (
                <div className="text-red-600 text-sm text-center">
                  {image.error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => processBackgroundRemoval(image.id)}
                  disabled={image.isProcessing}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Remove BG
                </Button>
                
                <Button
                  onClick={() => setShowBackgroundEffects(image.id)}
                  disabled={!image.processedUrl}
                  size="sm"
                  variant="outline"
                >
                  Effects
                </Button>
                
                <Button
                  onClick={() => resetImage(image.id)}
                  size="sm"
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                
                <Button
                  onClick={() => deleteImage(image.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-500"
                >
                  <X className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>

              {/* Download Options */}
              {image.processedUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Download Quality:</p>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      onClick={() => downloadImage(image.processedUrl!, `low-${image.file.name}`, 'low')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Low (800px)
                    </Button>
                    <Button
                      onClick={() => downloadImage(image.processedUrl!, `med-${image.file.name}`, 'medium')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Med (1080p)
                    </Button>
                    <Button
                      onClick={() => downloadImage(image.processedUrl!, `hd-${image.file.name}`, 'high')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      HD (Full)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchImageUploader;
