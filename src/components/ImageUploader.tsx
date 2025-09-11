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
      
      {/* Main Upload Area */}
      <div className="w-full max-w-4xl mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {!uploadedImage ? (
          <div 
            className="border-2 border-dashed border-green-500/30 rounded-lg p-16 cursor-pointer hover:border-green-500/50 transition-colors bg-gray-900/50"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-2">Upload Image</p>
                <p className="text-gray-400 text-lg">Click here or drag and drop your image</p>
                <p className="text-gray-500 text-sm mt-2">Supports JPG, PNG, WebP up to 12MB</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
              <Button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
                >
                  Background Effects
                </Button>
              )}
              <Button
                onClick={resetAll}
                variant="outline"
                className="px-6 py-3 rounded-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Reset All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3 max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Image Preview and Processing */}
      {uploadedImage && (
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
          {/* Original Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-xl font-bold text-white">Original</h3>
              <Button
                onClick={() => setShowManualEditor(true)}
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-3 py-1"
                title="Manual editing tool"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <img
                src={uploadedImage}
                alt="Original"
                className="w-full h-auto max-h-[300px] object-contain rounded"
              />
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-xl font-bold text-white">Result</h3>
              {processedImage && (
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-3 py-1"
                >
                  {showComparison ? 'Show Processed' : 'Compare Before/After'}
                </Button>
              )}
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 min-h-[300px] flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="w-8 h-8 text-green-500 animate-spin" />
                  <p className="text-white font-semibold">Removing background...</p>
                  <p className="text-gray-400 text-sm">Processing fine details</p>
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
                    className="w-full h-auto max-h-[300px] object-contain rounded relative z-10"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                  <p>Processed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Options */}
      {processedImage && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 max-w-4xl mx-auto mt-8">
          <h3 className="text-xl font-bold mb-6 text-center text-white">Download Options</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center space-y-3 p-4 bg-gray-800 rounded-lg">
              <p className="font-bold text-white">Low Quality</p>
              <p className="text-gray-400 text-sm">800x600px • {getEstimatedFileSize('low')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'low')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-3 p-4 bg-gray-800 rounded-lg">
              <p className="font-bold text-white">Medium Quality</p>
              <p className="text-gray-400 text-sm">1920x1080px • {getEstimatedFileSize('medium')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'medium')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="text-center space-y-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="font-bold text-white">High Quality {getPlanLimits(getUserPlan().type).hdDownloads ? '' : '🔒'}</p>
              <p className="text-gray-400 text-sm">Original Size • {getEstimatedFileSize('high')}</p>
              <Button
                onClick={() => downloadImage(processedImage, 'high')}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-2"
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
