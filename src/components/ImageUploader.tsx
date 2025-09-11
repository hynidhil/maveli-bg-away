import React, { useState, useRef } from 'react';
import { Upload, Loader, Download, Image as ImageIcon, AlertCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { canUseBackgroundRemoval, incrementBackgroundRemovalUsage, getPlanLimits } from '@/utils/planManager';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';
import PlanLimitModal from '@/components/PlanLimitModal';
import PlanStatus from '@/components/PlanStatus';

const ImageUploader = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false);
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
    
    // Check plan limits
    if (!canUseBackgroundRemoval()) {
      setShowPlanLimitModal(true);
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Loading image for processing...');
      const imageElement = await loadImage(uploadedFile);
      console.log('Image loaded, starting background removal...');
      
      const processedBlob = await removeBackground(imageElement);
      
      if (!processedBlob || processedBlob.size === 0) {
        throw new Error('Background removal returned empty result');
      }
      
      // Increment usage count on successful processing
      incrementBackgroundRemovalUsage();
      
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImage(processedUrl);
      console.log(`Background removal completed successfully (${Math.round(processedBlob.size / 1024)}KB)`);
    } catch (err) {
      console.error('Error during background removal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove background';
      setError(errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes('quota exceeded')) {
        setError('API quota exceeded. The service will use local processing for now.');
      } else if (errorMessage.includes('Invalid API key')) {
        setError('API configuration issue. Using local processing instead.');
      } else if (errorMessage.includes('too large')) {
        setError('Image is too large. Please use an image smaller than 12MB.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, quality: 'low' | 'medium' | 'high') => {
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    // Check if HD downloads are allowed
    if (quality === 'high' && !planLimits.hdDownloads) {
      setShowPlanLimitModal(true);
      return;
    }
    
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
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (!planLimits.manualEditing) {
      setShowPlanLimitModal(true);
      return;
    }
    
    setProcessedImage(editedImageUrl);
    setShowManualEditor(false);
  };

  const handleBackgroundEffectApplied = (imageWithBackground: string) => {
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (!planLimits.backgroundEffects) {
      setShowPlanLimitModal(true);
      return;
    }
    
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
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <PlanStatus onUpgradeClick={() => setShowPlanLimitModal(true)} />
      
      <PlanLimitModal
        isOpen={showPlanLimitModal}
        onClose={() => setShowPlanLimitModal(false)}
      />
      
      {/* Upload Section */}
      <div className="text-center mb-16">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {!uploadedImage ? (
          <div 
            className="upload-area rounded-3xl p-20 cursor-pointer transition-all duration-300 max-w-2xl mx-auto"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-strong">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-3">Upload Image</p>
                <p className="text-gray-600 text-xl mb-1">or drop a file,</p>
                <p className="text-gray-500 text-lg">paste image or URL</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary px-8 py-4 rounded-full text-lg font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Image
            </Button>
            <Button
              onClick={resetAll}
              className="ml-4 px-8 py-4 rounded-full text-lg font-semibold mode-toggle"
            >
              Reset All
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center space-x-3 shadow-minimal">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Image Preview and Processing */}
      {uploadedImage && (
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Original Image */}
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <h3 className="text-3xl font-bold text-gray-900">Original</h3>
              <Button
                onClick={() => setShowManualEditor(true)}
                size="sm"
                className="mode-toggle rounded-full px-4 py-2"
                title="Manual editing tool"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="card-modern p-8">
              <img
                src={uploadedImage}
                alt="Original"
                className="w-full h-auto max-h-[400px] object-contain image-preview"
              />
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <h3 className="text-3xl font-bold text-gray-900">Result</h3>
              {processedImage && (
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  size="sm"
                  className="mode-toggle rounded-full px-4 py-2"
                >
                  {showComparison ? 'Show Processed' : 'Compare Before/After'}
                </Button>
              )}
            </div>
            <div className="card-modern p-8 min-h-[400px] flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-6">
                  <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-gray-700 font-semibold text-lg">Removing background...</p>
                  <p className="text-gray-500">Processing fine details like hair and edges</p>
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
                    className="w-full h-auto max-h-[400px] object-contain image-preview relative z-10"
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
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="btn-primary px-16 py-5 text-xl font-bold rounded-full shadow-strong"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              'Remove Background'
            )}
          </Button>
          
          {processedImage && (
            <Button
              onClick={() => setShowBackgroundEffects(true)}
              className="btn-secondary px-16 py-5 text-xl font-bold rounded-full shadow-strong"
            >
              Background Effects
            </Button>
          )}
        </div>
      )}

      {/* Download Options */}
      {processedImage && (
        <div className="card-modern p-10">
          <h3 className="text-3xl font-bold mb-12 text-center text-gray-900">Download Options</h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center space-y-6 p-8 bg-gray-50 rounded-3xl shadow-minimal">
              <p className="font-bold text-xl text-gray-900">Low Quality</p>
              <p className="text-gray-600 text-lg">800x600px</p>
              <p className="text-gray-500">{getEstimatedFileSize('low')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'low')}
                className="w-full mode-toggle rounded-full py-4 text-lg font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-6 p-8 bg-gray-50 rounded-3xl shadow-minimal">
              <p className="font-bold text-xl text-gray-900">Medium Quality</p>
              <p className="text-gray-600 text-lg">1920x1080px</p>
              <p className="text-gray-500">{getEstimatedFileSize('medium')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'medium')}
                className="w-full mode-toggle rounded-full py-4 text-lg font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-6 p-8 yellow-highlight rounded-3xl shadow-minimal">
              <p className="font-bold text-xl text-gray-900">High Quality {getPlanLimits(getUserPlan().type).hdDownloads ? '' : '🔒'}</p>
              <p className="text-gray-700 text-lg">Original Size</p>
              <p className="text-gray-600">{getEstimatedFileSize('high')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'high')}
                className="btn-secondary w-full rounded-full py-4 text-lg font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                {getPlanLimits(getUserPlan().type).hdDownloads ? 'Download HD' : 'HD (Premium)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
