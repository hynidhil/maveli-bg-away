
import React, { useState, useRef } from 'react';
import { Upload, Loader, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageUploader = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage(null); // Reset processed image when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For demo purposes, we'll use a placeholder or the same image with some visual effect
    // In a real app, this would be the AI-processed image
    setProcessedImage(uploadedImage);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Image Preview and Processing */}
      {uploadedImage && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-foreground">Original Image</h3>
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
          
          <Button
            onClick={handleDownload}
            disabled={!processedImage || isProcessing}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10 px-8 py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Result
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
