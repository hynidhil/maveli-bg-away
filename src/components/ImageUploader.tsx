import React, { useState, useRef } from 'react';
import { Upload, Loader, Download, Image as ImageIcon, AlertCircle, Pencil, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { addWatermarkToImage } from '@/utils/watermarkUtils';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';
import PremiumModal from '@/components/PremiumModal';

const ImageUploader = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is premium
  const isPremium = localStorage.getItem('isPremium') === 'true';

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
      };
      reader.readAsDataURL(file);
    }
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

  const handleDownload = async (isHD = false) => {
    if (!processedImage) return;
    
    if (isHD && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    
    let downloadUrl = processedImage;
    
    // Add watermark for free users on regular downloads
    if (!isPremium && !isHD) {
      downloadUrl = await addWatermarkToImage(processedImage);
    }
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = isHD ? 'background-removed-hd.png' : 'background-removed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualEditComplete = (editedImageUrl: string) => {
    setProcessedImage(editedImageUrl);
    setShowManualEditor(false);
  };

  const handleBackgroundEffectApplied = (imageWithBackground: string) => {
    setProcessedImage(imageWithBackground);
    setShowBackgroundEffects(false);
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
            <h3 className="text-lg font-semibold text-center text-foreground">Processed Image</h3>
            <div className="relative bg-card rounded-lg p-4 border min-h-[200px] flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="w-8 h-8 text-green-500 animate-spin" />
                  <p className="text-muted-foreground">Removing background...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              ) : processedImage ? (
                <div className="relative">
                  {/* Checkered background to show transparency */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                  <img
                    src={processedImage}
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
          
          <Button
            onClick={() => handleDownload(false)}
            disabled={!processedImage || isProcessing}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10 px-8 py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Download {!isPremium && '(with watermark)'}
          </Button>

          <Button
            onClick={() => handleDownload(true)}
            disabled={!processedImage || isProcessing}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-2"
          >
            {isPremium ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download HD
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                HD Download (Premium)
              </>
            )}
          </Button>
        </div>
      )}

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
};

export default ImageUploader;
