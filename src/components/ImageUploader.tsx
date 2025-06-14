import React, { useState, useRef } from 'react';
import { Upload, Loader, Download, Image as ImageIcon, AlertCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';

const ImageUploader = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
        setShowManualEditor(false);
        setShowBackgroundEffects(false);
        setShowComparison(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
        setShowManualEditor(false);
        setShowBackgroundEffects(false);
        setShowComparison(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveBackground = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Loading image for processing...');
      const imageElement = await loadImage(uploadedFile);
      console.log('Image loaded, starting background removal...');
      
      const processedBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImage(processedUrl);
      console.log('Background removal completed successfully');
    } catch (err) {
      console.error('Error during background removal:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove background');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, quality: 'low' | 'medium' | 'high') => {
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

      // Get estimated file size
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `background-removed-${quality}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  };

  const handleManualEditComplete = (editedImageUrl: string) => {
    setProcessedImage(editedImageUrl);
    setShowManualEditor(false);
  };

  const handleBackgroundEffectApplied = (imageWithBackground: string) => {
    setProcessedImage(imageWithBackground);
    setShowBackgroundEffects(false);
  };

  const resetAll = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setUploadedFile(null);
    setError(null);
    setShowComparison(false);
  };

  const getEstimatedFileSize = (quality: string) => {
    switch (quality) {
      case 'low': return '~200KB';
      case 'medium': return '~1MB';
      case 'high': return '~3MB';
      default: return '';
    }
  };

  if (showManualEditor && uploadedImage) {
    return (
      <ManualEditor
        imageUrl={uploadedImage}
        onComplete={handleManualEditComplete}
        onCancel={() => setShowManualEditor(false)}
      />
    );
  }

  if (showBackgroundEffects && processedImage) {
    return (
      <BackgroundEffects
        processedImageUrl={processedImage}
        originalImageUrl={uploadedImage}
        onApply={handleBackgroundEffectApplied}
        onCancel={() => setShowBackgroundEffects(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Upload Section */}
      <div className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {!uploadedImage ? (
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
                <p className="text-lg font-medium text-foreground">Upload your image</p>
                <p className="text-muted-foreground">Click here or drag and drop your image</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Image
            </Button>
            <Button
              onClick={resetAll}
              variant="outline"
              className="ml-2"
            >
              Reset All
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Image Preview and Processing */}
      {uploadedImage && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-lg font-semibold text-foreground">Original Image</h3>
              <Button
                onClick={() => setShowManualEditor(true)}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
                title="Manual editing tool"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative bg-card rounded-lg p-4 border">
              <img
                src={uploadedImage}
                alt="Original"
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-lg font-semibold text-foreground">Processed Image</h3>
              {processedImage && (
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  variant="outline"
                  size="sm"
                >
                  {showComparison ? 'Show Processed' : 'Compare Before/After'}
                </Button>
              )}
            </div>
            <div className="relative bg-card rounded-lg p-4 border min-h-[200px] flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="w-8 h-8 text-green-500 animate-spin" />
                  <p className="text-muted-foreground">Removing background...using advanced AI</p>
                  <p className="text-sm text-muted-foreground">Processing fine details like hair and edges</p>
                </div>
              ) : processedImage ? (
                <div className="relative">
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                  <img
                    src={showComparison ? uploadedImage : processedImage}
                    alt="Processed"
                    className="w-full h-auto max-h-96 object-contain rounded-lg relative z-10"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 text-muted-foreground">
                  <ImageIcon className="w-12 h-12" />
                  <p>Processed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {uploadedImage && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Remove Background'
            )}
          </Button>
          
          {processedImage && (
            <Button
              onClick={() => setShowBackgroundEffects(true)}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10 px-8 py-2"
            >
              Background Effects
            </Button>
          )}
        </div>
      )}

      {/* Download Options */}
      {processedImage && (
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-center">Download Options</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <p className="font-medium">Low Quality</p>
              <p className="text-sm text-muted-foreground">800x600px</p>
              <p className="text-sm text-muted-foreground">{getEstimatedFileSize('low')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'low')}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-medium">Medium Quality</p>
              <p className="text-sm text-muted-foreground">1920x1080px</p>
              <p className="text-sm text-muted-foreground">{getEstimatedFileSize('medium')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'medium')}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-medium">High Quality</p>
              <p className="text-sm text-muted-foreground">Original Size</p>
              <p className="text-sm text-muted-foreground">{getEstimatedFileSize('high')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'high')}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download HD
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
