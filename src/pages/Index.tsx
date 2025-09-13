import React, { useState } from 'react';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import BatchImageUploader from '@/components/BatchImageUploader';
import ImageGenerator from '@/components/ImageGenerator';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getUserPlan, canUseBackgroundRemoval, incrementBackgroundRemovalUsage, getPlanLimits } from '@/utils/planManager';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { isUserAuthenticated, incrementGuestBackgroundRemovalUsage, getGuestRemainingRemovals, resetGuestUsage } from '@/utils/planManager';
import ManualEditor from '@/components/ManualEditor';
import BackgroundEffects from '@/components/BackgroundEffects';
import PlanLimitModal from '@/components/PlanLimitModal';
import PlanStatus from '@/components/PlanStatus';
import { Upload, Layers, Sparkles, Star, Zap, Shield, Loader, Download, Image as ImageIcon, AlertCircle, Pencil, Eye, EyeOff } from 'lucide-react';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch' | 'generate'>('single');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState<string>('');
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }
    
    // Mobile-specific file size limits
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const maxSize = isMobile ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for mobile, 10MB for desktop
    
    if (file.size > maxSize) {
      setError(`Image file is too large. Please use an image smaller than ${isMobile ? '5MB' : '10MB'}.`);
      return;
    }
    
    // Check image dimensions for mobile
    const img = new Image();
    img.onload = () => {
      const maxDimension = isMobile ? 2048 : 4096;
      if (img.naturalWidth > maxDimension || img.naturalHeight > maxDimension) {
        setError(`Image dimensions too large for mobile. Please use an image smaller than ${maxDimension}x${maxDimension} pixels.`);
        return;
      }
      
      // Proceed with file processing
      setUploadedFile(file);
      resetRetryCount(); // Reset retry count for new image
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage('');
        setError('');
        setShowManualEditor(false);
        setShowBackgroundEffects(false);
        setShowComparison(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file. Please try again.');
      };
      reader.readAsDataURL(file);
    };
    
    img.onerror = () => {
      setError('Invalid image file. Please select a valid image.');
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage('');
        setError('');
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

  // Mobile-specific touch event handlers
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Trigger file input on mobile touch
    document.getElementById('hero-file-input')?.click();
  };

  const handleRemoveBackground = async () => {
    console.log('Remove background button clicked');
    console.log('Uploaded file:', uploadedFile);
    
    if (!uploadedFile) {
      console.log('No uploaded file found');
      setError('Please select an image first');
      return;
    }
    
    const isAuthenticated = isUserAuthenticated();
    console.log('User authenticated:', isAuthenticated);
    
    // Check usage limits before processing
    if (!isAuthenticated) {
      // For guest users, check guest limit
      if (!incrementGuestBackgroundRemovalUsage()) {
        console.log('Guest usage limit exceeded');
        setShowPlanLimitModal(true);
        return;
      }
    } else {
      // For authenticated users, check their plan
      if (!canUseBackgroundRemoval()) {
        console.log('User plan limit exceeded');
        setShowPlanLimitModal(true);
        return;
      }
    }
    
    console.log('Starting background removal process...');
    setIsProcessing(true);
    setError('');
    
    // Mobile-specific timeout and error handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const timeoutDuration = isMobile ? 60000 : 30000; // 60s for mobile, 30s for desktop
    
    try {
      console.log('Loading image...');
      
      // Create timeout promise for mobile
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Processing timeout. Please try with a smaller image or check your internet connection.'));
        }, timeoutDuration);
      });
      
      // Mobile-optimized image loading
      const imageLoadPromise = loadImage(uploadedFile);
      const imageElement = await Promise.race([imageLoadPromise, timeoutPromise]) as HTMLImageElement;
      
      console.log('Image loaded, starting background removal...');
      
      // Mobile-optimized background removal with timeout
      const backgroundRemovalPromise = removeBackground(imageElement);
      const processedBlob = await Promise.race([backgroundRemovalPromise, timeoutPromise]) as Blob;
      
      if (!processedBlob || processedBlob.size === 0) {
        throw new Error('Background removal returned empty result. Please try with a different image.');
      }
      
      console.log('Background removal successful, blob size:', processedBlob.size);
      
      // Only increment usage for authenticated users (guest usage already incremented above)
      if (isAuthenticated) {
        incrementBackgroundRemovalUsage();
      }
      
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
      console.log('Processed image URL created');
      
      // Clean up previous blob URLs to prevent memory leaks on mobile
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
      
    } catch (err) {
      console.error('Error during background removal:', err);
      let errorMessage = 'Failed to remove background';
      
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'Processing took too long. Please try with a smaller image or better internet connection.';
        } else if (err.message.includes('API')) {
          errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
        } else if (err.message.includes('size') || err.message.includes('large')) {
          errorMessage = 'Image too large for mobile processing. Please use a smaller image (under 5MB).';
        } else if (err.message.includes('format')) {
          errorMessage = 'Unsupported image format. Please use JPG, PNG, or WEBP.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      // Reset processing state without reloading
      setIsProcessing(false);
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  // Mobile retry mechanism
  const handleRetry = async () => {
    if (retryCount >= 2) {
      setError('Maximum retry attempts reached. Please try with a smaller image or different format.');
      return;
    }
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setError('');
    
    // Wait a moment before retrying
    setTimeout(() => {
      handleRemoveBackground();
      setIsRetrying(false);
    }, 2000);
  };

  // Reset retry count when new image is uploaded
  const resetRetryCount = () => {
    setRetryCount(0);
    setError('');
  };

  const downloadImage = (imageUrl: string, quality: 'low' | 'medium' | 'high') => {
    const isAuthenticated = isUserAuthenticated();
    
    if (quality === 'high' && !isAuthenticated) {
      setAuthMessage('HD downloads require an account. Sign up for free to unlock HD downloads!');
      setShowAuthModal(true);
      return;
    }
    
    const plan = getUserPlan();
    const planLimits = getPlanLimits(plan.type);
    
    if (quality === 'high' && isAuthenticated && !planLimits.hdDownloads) {
      // Show upgrade message for authenticated users without premium
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

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
          break;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Determine MIME type and quality based on format
      let mimeType = 'image/png';
      let qualityValue = 1.0;
      
      switch (downloadFormat) {
        case 'jpg':
          mimeType = 'image/jpeg';
          qualityValue = 0.9;
          break;
        case 'webp':
          mimeType = 'image/webp';
          qualityValue = 0.9;
          break;
        case 'png':
        default:
          mimeType = 'image/png';
          qualityValue = 1.0;
          break;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `background-removed-${quality}.${downloadFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, mimeType, qualityValue);
    };
    img.src = imageUrl;
  };

  const handleManualEditComplete = (editedImageUrl: string) => {
    const isAuthenticated = isUserAuthenticated();
    
    if (!isAuthenticated) {
      setAuthMessage('Manual editing requires an account. Sign up for free to access editing tools!');
      setShowAuthModal(true);
      return;
    }
    
    setProcessedImage(editedImageUrl);
    setShowManualEditor(false);
  };

  const handleBackgroundEffectApplied = (imageWithBackground: string) => {
    const isAuthenticated = isUserAuthenticated();
    
    if (!isAuthenticated) {
      setAuthMessage('Background effects require an account. Sign up for free to access background effects!');
      setShowAuthModal(true);
      return;
    }
    
    setProcessedImage(imageWithBackground);
    setShowBackgroundEffects(false);
  };

  const getRemainingText = () => {
    const isAuthenticated = isUserAuthenticated();
    if (isAuthenticated) {
      const plan = getUserPlan();
      const remaining = plan.backgroundRemovalsLimit - plan.backgroundRemovalsUsed;
      return `${remaining} free removals left`;
    } else {
      const remaining = getGuestRemainingRemovals();
      return `${remaining} free removal left (Sign up for 2 more!)`;
    }
  };

  const resetAll = () => {
    setUploadedImage('');
    setProcessedImage('');
    setUploadedFile(null);
    setError('');
    setShowComparison(false);
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
    <div className="min-h-screen bg-black">
      <Header />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
      />
      
      {/* Hero Section */}
      <section className="hero-section section-padding pt-16 bg-black">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-center min-h-[80vh] px-4 md:px-0">
            {/* Left Side - Text Content */}
            <div className="space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight animate-fade-in">
                Remove Image
                <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent animate-gradient">
                  Background
                </span>
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                <span className="feature-badge px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-white">
                  100% Automatically and
                </span>
                <span className="green-highlight px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold text-green-400">
                  Free
                </span>
              </div>
              <p className="hero-subtitle text-sm md:text-base text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0">
                Upload your images and let our advanced AI remove backgrounds instantly. 
                Perfect for e-commerce, social media, and professional use.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
                <div className="feature-badge flex items-center gap-2 px-3 md:px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 animate-bounce-in">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
                  <span className="text-white font-medium text-xs md:text-sm">Lightning Fast</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-3 md:px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 animate-bounce-in" style={{animationDelay: '0.1s'}}>
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
                  <span className="text-white font-medium text-xs md:text-sm">100% Secure</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-3 md:px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
                  <span className="text-white font-medium text-xs md:text-sm">HD Quality</span>
                </div>
              </div>
            </div>
            
            {/* Middle - Image Card with Split Background */}
            <div className="relative flex justify-center order-2 md:order-2 lg:order-2">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden">
                {/* Split background */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-white"></div>
                  <div className="w-1/2 bg-blue-600"></div>
                </div>
                {/* Animated GIF placed on top of the split background */}
                <img 
                  src="/banner-animated.gif" 
                  alt="Background Removal Demo" 
                  className="relative z-10 w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Right Side - Preview */}
            <div className="relative order-3 md:order-3 lg:order-3">
              {/* Decorative elements like remove.bg - hidden on mobile */}
              <div className="hidden md:block absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-30 -z-10"></div>
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-40 -z-10"></div>
              <div className="hidden md:block absolute -bottom-8 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 transform rotate-45 opacity-20 -z-10"></div>
              {!uploadedImage ? (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="hero-file-input"
                  />
                  
                  <div 
                    className="text-center cursor-pointer touch-manipulation"
                    onClick={() => document.getElementById('hero-file-input')?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 hover:from-green-600 hover:to-green-700 transition-all touch-manipulation">
                      <Upload className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Ready to Start?</h3>
                    <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 px-2">
                      Upload your image and start removing backgrounds instantly with our AI-powered tool.
                    </p>
                    <div className="space-y-3 md:space-y-4">
                      <Button className="btn-primary w-full py-2 md:py-3 text-base md:text-lg font-bold rounded-full touch-manipulation">
                        Start Creating
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <div className="w-full text-center mb-2">
                      <span className="text-xs text-gray-400">{getRemainingText()}</span>
                    </div>
                    <Button
                      onClick={() => document.getElementById('hero-file-input')?.click()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      New
                    </Button>
                    <Button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                          Processing
                        </>
                      ) : (
                        'Remove BG'
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        resetGuestUsage();
                        window.location.reload();
                      }}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full"
                    >
                      Reset Usage
                    </Button>
                    {processedImage && (
                      <>
                        <Button
                          onClick={() => setShowManualEditor(true)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setShowBackgroundEffects(true)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full"
                        >
                          Effects
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={resetAll}
                      size="sm"
                      variant="outline"
                      className="rounded-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {uploadedImage && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-2">
                        <h4 className="text-xs md:text-sm font-medium text-gray-300">Original</h4>
                        <img
                          src={uploadedImage}
                          alt="Original"
                          className="w-full h-40 md:h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                      {processedImage && (
                        <div className="space-y-2">
                          <h4 className="text-xs md:text-sm font-medium text-gray-300">Result</h4>
                          <img
                            src={processedImage}
                            alt="Processed"
                            className="w-full h-40 md:h-48 object-cover rounded-lg border border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-300">{error}</span>
                      </div>
                      {/* Mobile retry button */}
                      {retryCount < 2 && !isProcessing && (
                        <Button
                          onClick={handleRetry}
                          disabled={isRetrying}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs touch-manipulation"
                        >
                          {isRetrying ? 'Retrying...' : `Retry (${2 - retryCount} attempts left)`}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Download Options */}
                  {processedImage && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Editing Tools</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button
                          onClick={() => setShowManualEditor(true)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Fine-tune Edges
                        </Button>
                        <Button
                          onClick={() => setShowBackgroundEffects(true)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        >
                          Add Background
                        </Button>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-300">Download Options</h4>
                      
                      {/* Format Selection */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Format:</p>
                        <div className="flex gap-1 flex-wrap">
                          {(['png', 'jpg', 'webp'] as const).map((format) => (
                            <Button
                              key={format}
                              onClick={() => setDownloadFormat(format)}
                              size="sm"
                              variant={downloadFormat === format ? "default" : "outline"}
                              className={`text-xs px-2 md:px-3 py-1 touch-manipulation ${
                                downloadFormat === format
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {format.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Quality Selection */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Quality:</p>
                        <div className="grid grid-cols-3 gap-1 md:gap-2">
                          <Button
                            onClick={() => downloadImage(processedImage, 'low')}
                            size="sm"
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs touch-manipulation"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Low
                          </Button>
                          <Button
                            onClick={() => downloadImage(processedImage, 'medium')}
                            size="sm"
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs touch-manipulation"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Med
                          </Button>
                          <Button
                            onClick={() => downloadImage(processedImage, 'high')}
                            size="sm"
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs touch-manipulation"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            HD
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Images Gallery */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              See It In Action
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { src: '/imgi_15_person-1.png', alt: 'Person 1' },
              { src: '/imgi_16_person-2.png', alt: 'Person 2' },
              { src: 'https://i.postimg.cc/Xv9qfYy2/imgi-17-person-3.png', alt: 'Person 3' }
            ].map((image, index) => {
              const labels = [
                'Original',
                'Transparent background', 
                'New background'
              ];
              
              return (
              <div
                key={index}
                className="relative group cursor-pointer space-y-3"
                onClick={() => {
                  fetch(image.src)
                    .then(res => res.blob())
                    .then(blob => {
                      const file = new File([blob], `sample-${index + 1}.png`, { type: 'image/png' });
                      setUploadedFile(file);
                      setUploadedImage(image.src);
                      setProcessedImage('');
                      setError('');
                      setShowManualEditor(false);
                      setShowBackgroundEffects(false);
                      setShowComparison(false);
                      // Scroll to top to see the loaded image
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg border border-gray-600 group-hover:border-green-500 transition-all duration-300"
                />
                <div className="text-center">
                  <p className="text-white font-medium text-sm">{labels[index]}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              How It Works
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Upload Image</h4>
              <p className="text-gray-300">Drag & drop or click to upload. Supports JPG, PNG, WEBP up to 12MB.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">AI Processing</h4>
              <p className="text-gray-300">Advanced AI automatically detects and removes backgrounds in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Download Result</h4>
              <p className="text-gray-300">Get your image in multiple formats: web-ready, HD, or transparent PNG.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;